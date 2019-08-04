const db = require("../../database");
const Discord = require('discord.js');

exports.run = async (client, message, command, args) => {
    message.channel.send('Searching for your status.').then(msg => {
        var uid = message.author.id;
        if (message.mentions.members.size == 1){
            uid = message.mentions.members.values().next().value.id;
        }
        db.getUser(uid, (user) => {
            if(user !== false){
                const messageEmbed = new Discord.RichEmbed()
                .setTitle(`${client.users.get(uid).tag}'s Status`)
                .addField(':military_medal: Credits', user["credits"], true)
                .addField(':e_mail: Invites', user["invites"] + " (-" + user["leaves"] + ")", true)
                .addField(':newspaper: Messages', user["messages"], true)
                .setColor(0x7289DA)
                .setFooter("hi - by FrostTaco and LittleWhole")
                .setTimestamp();
                msg.edit({embed: messageEmbed});
            } else {
                msg.edit("Something went wrong! Please try again later.")
            }
        });
    });
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["stats", "stat"],
    permissionlevel: 0
};

exports.help = {
    name: "status",
    description: "Allows you to view your or other users credits, invites, and messages.",
    usage: "[user mention]",
    category: "Economy"
};