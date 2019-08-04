const db = require("../../database");
module.exports = async (client, log) => {
    client.on("guildMemberRemove", (member) => {
        if(!member.bot){
            db.userExists(member.id, (exists) => {
                if(exists){
                    db.getUser(member.id, (user) => {
                        if(user["invitedby"] != null){
                            db.getUser(user["invitedby"], (inviter) => {
                                db.updateUser(user["invitedby"], {leaves: inviter["leaves"] + 1, credits: inviter["credits"] - 25}, (success) => {

                                });
                            });
                        }
                    });
                }
            });
        }
    });
}