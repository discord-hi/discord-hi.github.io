module.exports = async (client, log) => {
    client.on("message", message => {
        if (!message.content.startsWith('!')) return;
        let command = message.content.split(" ")[0].slice(1);
        let args = message.content.split(" ").slice(1);
        let cmd;
        if (client.commands.has(command)) {
            cmd = client.commands.get(command);
        } else if (client.aliases.has(command)) {
            cmd = client.commands.get(client.aliases.get(command));
        }
        if (cmd) {
            if(cmd.conf.enabled === false){
                return;
            }
            if(cmd.conf.guildOnly === true && message.channel.type != "text"){
                message.reply("This command can only be run in <#525979744093863946>");
                return;
            }
            cmd.run(client, message, command, args);
        }
    });
};