const Discord = require("discord.js");
const main = require("../app");
const log = require('../logger').log;
const client = new Discord.Client();


client.on("ready", () => {
    log.info(`[bot] Tag: ${client.user.tag}!`);
});

client.on("error", err => {
    log.error(`[bot] ${err.message}!`);
});
  
client.on("message", msg => {
    
});

module.exports = {
    start: async () => {
        await client.login(process.env.DISCORD_TOKEN);
    }
};