const db = require("../../database");
const Discord = require('discord.js');

exports.run = async (client, message, command, args) => {
    if(args[0] != null && args[0].toLowerCase() != "credits" && args[0].toLowerCase() != "invites" && args[0].toLowerCase() != "messages"){
        message.reply("That sort type is invalid, please use: credits | invites | messages");
    } else if (args[1] != null && (args[1] != parseInt(args[1], 10) || args[1] < 1)) {
        message.reply("That page number is invalid, please enter a valid page number.");
    } else {
        message.channel.send('Updating the leaderboard.').then(msg => {
            db.getTop(args[1] != null ? args[1] : 1, args[0] != null ? args[0].toLowerCase() : "credits", (result) => {
                if (result != false){
                    var leaderboard = new Discord.RichEmbed()
                    .setTitle(`|<=>| Leaderboard Sorted by ` + (args[0] != null ? args[0].charAt(0).toUpperCase() + args[0].slice(1) : "Credits") + `, Page ` + (args[1] != null ? args[1] : 1) + ` |<=>|`)
                    .setColor(0x7289DA)
                    .setFooter("hi - by FrostTaco and LittleWhole")
                    .setTimestamp();
                    var users = "";
                    Object.keys(result).forEach((key) => {
                        var row = result[key];
                        users += client.users.get(row["id"]).tag + " - " + row[args[0] != null ? args[0].toLowerCase() : "credits"] + "\n";
                    });
                    leaderboard = leaderboard.addField("Users", users);
                    msg.edit({embed: leaderboard});
                } else {
                    msg.edit(`There was an issue updating the leaderboard. Please try again later.`);
                }
            });
        });
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["lb", "board"],
    permissionlevel: 0
};

exports.help = {
    name: "leaderboard",
    description: "Views the leaderboard, default sorted by credits.",
    usage: "[credits|invites|messages] [page]",
    category: "Economy"
};