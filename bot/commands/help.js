const Discord = require('discord.js');

exports.run = async (client, message, cmd, args) => {
    if (!args[0]) {
        var helpEmbed = new Discord.RichEmbed()
            .setTitle(`|<=>| Commands |<=>|`)
            .setDescription(`Use !help <command> for details on a certain command.\n\n${client.commands.map(c => `[${c.help.category}] **\`${c.help.name}\`** - ${c.help.description}`).join("\n")}`)
            .setColor(0x7289da)
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
                .setColor(0x7289da)
                .setTimestamp();
            message.channel.send({ embed: helpEmbedTwo });
        }
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["?"]
};

exports.help = {
    name: "help",
    description: "Get a list of commands.",
    usage: "[command]",
    category: "Information"
};