var mysql = require('mysql');

const main = require("./main");
const log = require('./logger').log;

var pool = mysql.createPool({
    host: "localhost",
    user: "hi",
    password: process.env.MYSQL_PASSWORD,
    connectionLimit: 190,
    database: "hi_discord"
});

var users = {};
var queuedMsgs = {};
var giveaways = {};

var invites = {};

var DB = (function () {
    function _query(query, params, callback) {
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                callback(null, err);
                log.error("[DB] " + err);
            }

            connection.query(query, params, function (err, rows) {
                if (!err) {
                    callback(rows);
                }
                else {
                    callback(null, err);
                }
                connection.release();
            });

            connection.on('error', function (err) {
                connection.release();
                callback(null, err);
                log.error("[DB] " + err);
            });
        });
    };
    return {
        query: _query
    };
})();

function updateData(){
    getGiveaways();
}

updateData();

function getUserDB(userid, next){
    DB.query("SELECT * FROM users WHERE id = " + userid, function (err, result){
        if (err) log.error("[DB] User could not be loaded: " + err);
        if(result.length != 0){
            Object.keys(result).forEach((key) => { 
                var row = result[key];
                users[row["id"]] = {};
                users[row["id"]]["permissionlevel"] = row["permissionlevel"];
                users[row["id"]]["IPs"] = row["IPs"];
                users[row["id"]]["darkmode"] = row["darkmode"];
                users[row["id"]]["invitedby"] = row["invitedby"];
                users[row["id"]]["invites"] = row["invites"];
                users[row["id"]]["leaves"] = row["leaves"];
                users[row["id"]]["messages"] = row["messages"];
                users[row["id"]]["credits"] = row["credits"];
                users[row["id"]]["giveawayswon"] = row["giveawayswon"];
                log.info("Loaded user " + row["id"] + ": " + JSON.stringify(users[row["id"]]));
            });
            return next(true);
        }
        return next(false);
    });
}

function makeUser(userid, invitedby, other, next){
    userExists(userid, (exists) => {
        if(exists) return next(true);
        var query = "INSERT INTO users (id, invitedby";
        var values = userid + ", " + invitedby;
        if(typeof other != undefined && other != null){
            Object.keys(other).forEach(function(key){
                query += ", " + key;
                values += ", " + other[key];
            });
        }
        query += ") VALUES (" + values + ")";
        DB.query(query, function (err, result){
            if (err) log.error("[DB] User could not be created: " + err);
            if(result) {
                users[userid] = {};
                users[userid]["permissionlevel"] = other !== undefined && other !== null && other["permissionlevel"] !== undefined && other["permissionlevel"] !== null ? other["permissionlevel"] : null;
                users[userid]["IPs"] = other !== undefined && other !== null && other["IPs"] !== undefined && other["IPs"] !== null ? other["IPs"] : null;
                users[userid]["darkmode"] = other !== undefined && other !== null && other["darkmode"] !== undefined && other["darkmode"] !== null ? other["darkmode"] : null;
                users[userid]["invitedby"] = invitedby;
                users[userid]["invites"] = other !== undefined && other !== null && other["invites"] !== undefined && other["invites"] !== null ? other["invites"] : null;
                users[userid]["leaves"] = other !== undefined && other !== null && other["leaves"] !== undefined && other["leaves"] !== null ? other["leaves"] : null;
                users[userid]["messages"] = other !== undefined && other !== null && other["messages"] !== undefined && other["messages"] !== null ? other["messages"] : null;
                users[userid]["credits"] = other !== undefined && other !== null && other["credits"] !== undefined && other["credits"] !== null ? other["credits"] : null;
                users[userid]["giveawayswon"] = other !== undefined && other !== null && other["giveawayswon"] !== undefined && other["giveawayswon"] !== null ? other["giveawayswon"] : null;
                log.info("Created user " + userid + ": " + JSON.stringify(users[userid]));
            } else {
                log.error("[DB] User could not be created.")
                return next(false);
            }
        });
        return next(true);
    });
}

function getUser(userid, next){
    userExists(userid, (exists) => {
        if(!exists){
            makeUser(userid, null, {}, (success) => {
                if(success){
                    return next(users[userid]);
                } else {
                    return next(false);
                }
            });
        } else {
            return next(users[userid]);
        }
    });
}

function userExists(userid, next){
    if(Object.keys(users).includes(userid)) return next(true);
    getUserDB(userid, (success) => {
        return next(success);
    });
}

function updateUser(userid, other, next){
    userExists(userid, (exists) => {
        if(!exists){
            makeUser(userid, null, other, (success) => {
                return next(success);
            });
        } else {
            var query = "UPDATE `users` SET ";
            if(typeof other != 'undefined' && other != null){
                Object.keys(other).forEach(function(key){
                    query += key + " = " + other[key] + (Object.keys(other).length - (Object.keys(other).indexOf(key) + 1) > 0 ? ", " : " ");
                    users[userid][key] = other[key];
                });
            }
            query += "WHERE id = " + userid;
            DB.query(query, function (err, result){
                if (err) log.error("[DB] User could not be updated: " + err);
                if(result) {
                    log.info("Updated user " + userid + ": " + JSON.stringify(users[userid]));
                    return next(true);
                } else {
                    log.error("[DB] User could not be updated.")
                    return next(false);
                }
            });
        }
    });
}

function getTop(low, sort, next){
    DB.query("SELECT * FROM `users` ORDER BY `" + sort + "` DESC LIMIT " + (low * 10 - 10) + ", 10;", function (err, result){
        if (err) log.error("[DB] Top could not be loaded: " + err);
        if(result) {
            log.info("Fetched leaderboard page: " + low + " by: " + sort);
            return next(result);
        } else {
            log.error("[DB] Top could not be loaded.");
            return next(false);
        }
    });
}

function queueMsg(userid){
    makeUser(userid, null, {}, (success) => {
        queuedMsgs[userid] = Object.keys(queuedMsgs).includes(userid) ? queuedMsgs[userid] + 1 : 1;
        users[userid]["messages"] = users[userid] != 'undefined' ? users[userid]["messages"] + 1 : 1;
        users[userid]["credits"] = users[userid] != 'undefined' ? users[userid]["credits"] + 1 : 1;
    });
}

function getGiveaways(){

}

setInterval(() => {
    Object.keys(queuedMsgs).forEach((userid) => {
        updateUser(userid, {messages: users[userid]["messages"], credits: users[userid]["credits"]}, () => {});
        delete queuedMsgs[userid];
    });
}, 120000);

module.exports = {
    updateData: updateData,
    makeUser: makeUser,
    getUser: getUser,
    userExists: userExists,
    updateUser: updateUser,
    queueMsg: queueMsg,
    getTop: getTop,
    invites: invites
};