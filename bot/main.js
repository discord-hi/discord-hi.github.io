const Discord = require("discord.js");
const fs = require("fs");
const main = require("../main");
const log = require('../logger').log;
const client = new Discord.Client();

const serverID = "525961593239109658";
const securityRole = "531405074665046028";


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./bot/commands/", (err, files) => {
  if (err) log.error("[bot] " + err);
  files.forEach(f => {
    let props = require(`./commands/${f}`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});
fs.readdir("./bot/events/", (err, evtFiles) => {
  if (err) log.error("[bot] " + err);
  evtFiles.forEach(file => {
    const event = require(`./events/${file}`);
    event(client, log);
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

client.on("error", (e) => log.error("[bot] " + e));
client.on("warn", (w) => log.warn("[bot] " + w));

function isInServer(user) {
  if (client.guilds.get(serverID).members.has(user.id)) {
    return true;
  } else {
    return false;
  }
}

function verify(user) {
  if (!client.guilds.get(serverID).members.get(user.id).roles.has(securityRole)) {
    client.guilds.get(serverID).members.get(user.id).addRole(securityRole);
    client.guilds.get(serverID).members.get(user.id).createDM().then(function (channel) {
      channel.send("Welcome to Hi!\nRemember to check out all of our <#525980921191727106> to gain access to all of our channels!")
    });
    log.info("[bot] Verified user " + user.username);
  }
}

module.exports = {
  start: async () => {
    await client.login(process.env.DISCORD_TOKEN);
  },
  isInServer: isInServer,
  verify: verify
};