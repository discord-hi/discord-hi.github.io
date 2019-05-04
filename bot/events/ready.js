const db = require("../../database");

module.exports = async (client, log) => {
    client.on("ready", () => {
        setTimeout(() => {
            client.guilds.get("525961593239109658").fetchInvites().then(guildInvites => {
                db.invites = guildInvites;
            });
            log.info(`[bot] Tag: ${client.user.tag}\nSTATISTICS\n${client.users.size} users\n${client.channels.size} channels!`);
        }, 1000);
        client.user.setActivity("!help for commands", { type: 0 });
        setInterval(() => {
            client.user.setActivity("!help for commands", { type: 0 });
            setTimeout(() => {
                client.user.setActivity(`!help | ${client.users.size} users`, { type: 0 });
                setTimeout(() => {
                    client.user.setActivity(`!help | Daily Giveaways`, { type: 0 });
                }, 5000);
            }, 5000);
        }, 15000);
    });
};