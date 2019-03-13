var md5 = require('md5');
var key = 'as478w4aDF54WDFSf54f123fdSD56feFD';
module.exports = function (params) {
    var account = params.account;
    var paramStr=params.config+params.data+key;
    var signature = md5(paramStr);
    return signature;
}