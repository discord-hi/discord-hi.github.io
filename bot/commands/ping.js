exports.run = async (client, message, command, args) => {
    message.channel.send('Ping?').then(msg => {
        msg.edit(`Pong! (took: ${msg.createdTimestamp - message.createdTimestamp}ms)`);
    });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permissionlevel: 0
};

exports.help = {
    name: "ping",
    description: "Ping the bot to check response time and latency.",
    usage: "",
    category: "Information"
};