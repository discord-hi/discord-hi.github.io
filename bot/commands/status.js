const db = require("../../database");

exports.run = async (client, message, command, args) => {
    message.channel.send('Searching for your status.').then(msg => {
        db.getUser(message.author.id, (user) => {
            if(user != false){
                msg.edit(":military_medal:: " + user["credits"] + "\n:e_mail:: " + user["invites"] + "\n:newspaper:: " + user["messages"]);
            } else {
                msg.edit("Something went wrong! Please try again later.")
            }
        });
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