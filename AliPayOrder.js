//https://github.com/Srar/AlipayF2F
var alipayf2f = require('alipay-ftof');
var path = require('path');

/**
 *  支付宝查单
 */
async function AliPayOrder(params) {
    //返回结果
    var interfaces = {
        data: '',
        status: 1,
        msg: ''
    };

    var config = params.config;
    var data = params.data;

    //实例化alipayf2f对象
    var alipay_f2f = new alipayf2f(config);
    //查询订单
    await alipay_f2f.checkInvoiceStatus(data.tradeNo).then(result => {
        interfaces.data = result;
        interfaces.status = 1;
        interfaces.msg = result.msg;
    }).catch(error => {
        interfaces.status = 0;
        interfaces.msg = error.message;
        interfaces.data = error;
    });

    return interfaces;
}
module.exports = AliPayOrder;