const express = require("express"); //needed
const session = require("express-session"); //needed I think
const _ = require("lodash"); //???
//const moment = require("moment"); //???
const passport = require("passport"); //needed
const DiscordStrategy = require("passport-discord").Strategy; //needed
require("dotenv").config(); //useful so let's keep

//const bot = require("./bot"); //probably going to run our bot here so ¯\_(ツ)_/¯
//const db = require("./db"); //used for the databasing

const app = express(); //??
const PORT = process.env.PORT || 8080;
const URL = "http://hi.iceblaze.net";
const scopes = ["identify", "guilds"];
app.enable("trust proxy"); //???
app.locals._ = _; //???

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
  }
);

app.get("/", checkAuth, async (req, res) => {
    res.sendFile("index.html");
});

app.get("/giveaways", (req, res) => {
    res.sendFile("giveaways.html");
});

app.listen(PORT, () => {
  console.log(`[web] Listening on port ${PORT}`);
});
//if (!process.env.NO_DISCORD) bot.start();
