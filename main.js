const express = require("express");
const helmet = require("helmet");
const session = require("express-session"); 
const _ = require("lodash"); //???
const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
require("dotenv").config(); //put config in .env
var bodyParser = require('body-parser');

const log = require('./logger').log;
const bot = require("./bot/main");
const render = require("./render");
const database = require("./database");
//const db = require("./db"); //used for the databasing

const app = express();
const PORT = process.env.PORT || 8888;
const URL = "https://thehi.site";
const scopes = ["identify"];
app.enable("trust proxy"); 
app.locals._ = _;
app.set('view engine', 'ejs');
app.use(helmet({ noCache: true }));
app.use(express.static('views'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use('/style', express.static('./style'));
app.use('/js', express.static('./js'));
app.use('/imgs', express.static('./imgs'));
app.use('/dialog', express.static('./dialog'));


passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
      callbackURL: `${URL}/callback`,
      scope: scopes
    },
    (accessToken, refreshToken, profile, cb) => {
      process.nextTick(() => {
        return cb(null, profile);
      });
    }
  )
);

app.use(session({ secret: "ThIs Is Pr094bablY A R3aLy B0d S9cr0t Ya7a7a7a7", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.session.returnTo = req.originalUrl;
  res.redirect("/login");
}

function inServer(req, res, next){
  if(bot.isInServer(req.user)){
    return next();
  } else {
    render.render(req, res, "notInServer", {user: req.user});
  }
}

app.get("/login", (req, res, next) => {if(req.isAuthenticated()){res.redirect("/profile")} else {return(next())}}, passport.authenticate("discord", { scope: scopes }),  (req, res) => {
    res.redirect("/");
  }
);

app.get("/callback", passport.authenticate("discord", { failureRedirect: "/login" }), (req, res) => {
  res.redirect(req.session.returnTo || "/");
  delete req.session.returnTo;
});

app.get("/", (req, res) => {
  render.render(req, res, "index", {user: req.user});
});

app.get("/giveaways", (req, res) => {
  render.render(req, res, "giveaways", {user: req.user});
});

app.get("/verify", checkAuth, inServer, (req, res) => {
  bot.verify(req.user);
  render.render(req, res, "verify", {user: req.user});
});

app.get("/stream", (req, res) => {
  //if(req.headers['cf-connecting-ip'] == "144.217.13.11"){
    render.render(req, res, "stream", {});
  //} else {
    render.render(req, res, "streammain", {});
  //}
})

app.get("/streammain", (req, res) => {
  render.render(req, res, "streammain", {});
})

app.post("/settings", checkAuth, (req, res) => {
  log.info("Dark Mode: " + req.body.darkmode);
});

app.get("*", function (req, res) {
  res.status(404);
  render.render(req, res, "404");
});

app.listen(PORT, () => {
  log.info(`[web] Listening on port ${PORT}`);
});

if (!process.env.NO_DISCORD) bot.start();
