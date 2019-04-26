const log = require('./logger').log;
function render(req, res, page, args){
    log.info("[web] " + req.headers['cf-connecting-ip'] + " " + (typeof req.user != 'undefined' ? req.user.username + " " : "") + "accessed " + req.url + " and rendered " + page);
    res.render(page, args);
}
exports.render = render;