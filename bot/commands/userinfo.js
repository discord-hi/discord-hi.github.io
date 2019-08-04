const Discord = require('discord.js');

const db = require("../../database");

exports.run = async (client, message, command, args) => {
    message.channel.send('Gathering info.').then(msg => {
        var uid = message.author.id;
        if (message.mentions.members.size == 1){
            uid = message.mentions.members.values().next().value.id;
        }
        db.getUser(uid, (user) => {
            if(user !== false){
                const messageEmbed = new Discord.RichEmbed()
                .setTitle(`${client.users.get(uid).tag}'s Information`)
                .addField('Permission Level', user["permissionlevel"], true)
                .addField('Dark Mode', user["darkmode"], true)
                .addField('Invites', user["invites"], true)
                .addField('Leaves', user["leaves"], true)
                .addField('Messages', user["messages"], true)
                .addField('Credits', user["credits"], true)
                .addField('Giveaways Won', String(user["giveawayswon"]), true)
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
    guildOnly: false,
    aliases: ["info", "user"],
    permissionlevel: 1
};

exports.help = {
    name: "userinfo",
    description: "Displays almost all information we have about a user.",
    usage: "[user]",
    category: "Management"
};