exports.run = async (client, message, command, args) => {
    message.channel.send('Updating the leaderboard.').then(msg => {
        msg.edit(`There was an issue updating the leaderboard. Please try again later.`);
    });
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["lb", "board"]
};

exports.help = {
    name: "leaderboard",
    description: "Views the leaderboard, default sorted by credits.",
    usage: "[credits|invites|messages]",
    category: "Economy"
};