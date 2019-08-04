const db = require("../../database");
module.exports = async (client, log) => {
    client.on("guildMemberAdd", (member) => {
        if(!member.bot){
            member.guild.fetchInvites().then(guildInvites => {
                const ei = db.invites;
                db.invites = guildInvites;
                var invite = guildInvites.find(i => !ei.has(i.code) && i.uses == 1);
                if(invite == null) {
                    invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
                }
                db.userExists(member.id, (exists) => {
                    if(exists){
                        member.guild.channels.get("525969365276033054").send("<@" + member.id + "> has just rejoined the server(probably attempting to cheat the system)!");
                    } else {
                        db.makeUser(member.id, invite.inviter.id, {}, (success) => {
                            if(!success){
                                member.createDM().then((channel) => {
                                    channel.send("An error occured while you were joining the server. Please DM an administrator with this error code: gMA-m");
                                });
                            } else {
                                if(!invite.inviter.bot){
                                    db.getUser(invite.inviter.id, (user) => {
                                        db.updateUser(invite.inviter.id, {invites: user["invites"] + 1, credits: user["credits"] + 50}, (success) => {
                                            if (!success){
                                                member.createDM().then((channel) => {
                                                    channel.send("An error occured while you were joining the server. Please DM an administrator with this error code: gMA-u");
                                                });
                                            } else {
                                                member.guild.channels.get("525969365276033054").send("Welcome <@" + member.id + ">! You have gotten " + invite.inviter.username + " to " + user["invites"] + " invite" + (user["invites"] == 1 ? "!" : "s!") + " Please verify yourself(to prevent raiding) at <#531406637328629761> and then, to be mentioned for giveaways, or get a specific role, please look at <#525980921191727106>");
                                            }
                                        });
                                    });
                                }
                            }
                        });
                    }
                });
            });
        } else {
            db.makeUser(member.id, null, {}, (success) => {

            });
        }
    });
};