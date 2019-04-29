exports.run = async (client, message, command, args) => {
    message.channel.send('Searching for your status.').then(msg => {
        msg.edit(`There was an issue getting your stats. Please try again later.`);
    });
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["stats", "stat"]
};

exports.help = {
    name: "status",
    description: "Allows you to view your or other users credits, invites, and messages.",
    usage: "[user mention]",
    category: "Economy"
};