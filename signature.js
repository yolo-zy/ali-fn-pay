var md5 = require('md5');
var key = 'as478w4aDF54WDFSf54f123fdSD56feFD';
module.exports = function (params) {
    var account = params.account;
    var paramStr=key+params.config+params.data;
    var signature = md5(paramStr);
    return signature;
}