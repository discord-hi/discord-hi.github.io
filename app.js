const express = require("express");
const session = require("express-session"); 
const _ = require("lodash"); //???
//const moment = require("moment"); //???
const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
require("dotenv").config(); //put config in .env

//const bot = require("./bot"); //probably going to run our bot here so ¯\_(ツ)_/¯
//const db = require("./db"); //used for the databasing
//test
const app = express();
const PORT = process.env.PORT || 8080;
const URL = "https://thehi.site";
const scopes = ["identify", "guilds"];
app.enable("trust proxy"); 
app.locals._ = _;
app.use(express.static('views'));


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
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
}

app.get("/login", passport.authenticate("discord", { scope: scopes }),  (req, res) => {
    res.redirect("/");
  }
);

app.get("/callback", passport.authenticate("discord", { failureRedirect: "/login" }), (req, res) => {
    res.redirect(req.session.returnTo || "/");
    delete req.session.returnTo;
});

app.get("/", (req, res) => {
    res.sendFile("index.html");
});

app.get("/giveaways", (req, res) => {
    res.sendFile("giveaways.html");
});

app.listen(PORT, () => {
  console.log(`[web] Listening on port ${PORT}`);
});
//if (!process.env.NO_DISCORD) bot.start();
