//签名
var path = require('path');
var signature = require(path.resolve('./signature'));
// var base64 = require(path.resolve('./base64'));

function parse_signed_req(req, body,resp) {
    var bodys = body;
    var datas = body.data;
    var configs = body.config;
    var sign = body.sign;
    var sign2 = signature({
        account: req.queries.account,
        config: configs,
        data: datas
    })
    sign2=sign2.toUpperCase();
    
    if (sign == sign2) {
        var config =JSON.parse(new Buffer(configs, 'base64').toString('ascii'));
        var data = JSON.parse(new Buffer(datas, 'base64').toString('ascii'));
        return params = {
            msg: '成功',
            status:1,
            config: config,
            data: data
        }
    } else {
        return params = {
            msg: '签名错误',
            status:0,
            config: '',
            data: '',
        }
    }

}
module.exports = parse_signed_req;