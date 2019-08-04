const Discord = require('discord.js');

const db = require("../../database");

const categories = ["INFORMATION", "ECONOMY", "MANAGEMENT"];

exports.run = async (client, message, cmd, args) => {
    db.getUser(message.author.id, (user) => {
        if (!args[0]) {
            var helpEmbed = new Discord.RichEmbed()
                .setTitle(`|<=>| Commands |<=>|`)
                .setDescription(`Use !help <command> for details on a certain command.\n\n${client.commands.filter(c => c.conf.permissionlevel <= user["permissionlevel"]).sort((a, b) => {
                    var acat = categories.indexOf(a.help.category.toUpperCase());
                    if(acat == -1) return -1;
                    var bcat = categories.indexOf(b.help.category.toUpperCase());
                    if(bcat == -1) return 1;
                    if(acat < bcat) return -1;
                    if(acat > bcat) return 1;
                    return 0;
                }).map(c => `[${c.help.category}] **\`${c.help.name}\`** - ${c.help.description}`).join("\n")}`)
                .setColor(0x7289DA)
                .setFooter("hi - by FrostTaco and LittleWhole")
                .setTimestamp();
            message.channel.send({ embed: helpEmbed });
        } else {
            let command = args[0];
            if (client.commands.has(command)) {
                command = client.commands.get(command);
                if (command === null || command === undefined || !command) return message.channel.send("That command could not be found.");
                var helpEmbedTwo = new Discord.RichEmbed()
                    .setTitle(`Command: \`${command.help.name}\` `)
                    .setDescription(`${command.help.description}\n\n**Category:** ${command.help.category}\n**Command Usage** - ${command.help.name} ${command.help.usage}\n**Aliases** - ${command.conf.aliases.toString()}`)
                    .setColor(0x7289DA)
                    .setFooter("hi - by FrostTaco and LittleWhole")
                    .setTimestamp();
                message.channel.send({ embed: helpEmbedTwo });
            }
        }
    });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["?"],
    permissionlevel: 0
};

exports.help = {
    name: "help",
    description: "Get a list of commands.",
    usage: "[command]",
    category: "Information"
};