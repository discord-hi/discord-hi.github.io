const express = require("express");
const helmet = require("helmet");
const session = require("express-session"); 
const _ = require("lodash"); //???
const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
require("dotenv").config(); //put config in .env

const log = require('./logger').log;
const bot = require("./bot/main");
const render = require("./render");
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

app.listen(PORT, () => {
  log.info(`[web] Listening on port ${PORT}`);
});
if (!process.env.NO_DISCORD) bot.start();
