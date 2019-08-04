var channelBlacklist = ["537104801117372426", "525979744093863946", "535608476819390483", "526266093787152394", "526264567362224138", "526264696815222784", "526264796165963788", "526279294780178462"]//spam commands count-to-something pokecord nsfw-women-real nsfw-men-real nsfw-hentai nsfw-kinks nsfw-sendnudes

const db = require("../../database");
const log = require("../../logger").log;


module.exports = async (client, log) => {
    client.on("message", message => {
        let command = message.content.split(" ")[0].slice(1);
        let args = message.content.split(" ").slice(1);
        let cmd;
        db.getUser(message.author.id, (user) => {
            if (message.content.startsWith('!') && client.commands.has(command)) {
                cmd = client.commands.get(command);
            } else if (client.aliases.has(command)) {
                cmd = client.commands.get(client.aliases.get(command));
            }
            if (cmd) {
                if(cmd.conf.enabled === false){
                    return;
                }
                if(cmd.conf.permissionlevel > user["permissionlevel"]){
                    return;
                }
                if(cmd.conf.guildOnly === true && message.channel.type != "text"){
                    message.reply("This command can only be run in <#525979744093863946>");
                    return;
                }
                cmd.run(client, message, command, args);
            } else {
                if((!channelBlacklist.includes(message.channel.id))){
                    db.queueMsg(message.author.id);
                }
            }
        });
    });
};