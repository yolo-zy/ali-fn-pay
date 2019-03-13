//https://github.com/befinal/node-tenpay
var tenpay = require('tenpay');
var path = require('path');

/**
 *  微信查单
 */
async function WeChatOrder(params) {
    //返回结果
    var result = {};

    //返回结果
    var interfaces = {
        data: '',
        status: 1,
        msg: ''
    };
    var config = params.config;
    var data = params.data;

    //实例化tenpay对象
    var api = new tenpay(config);
    //查询订单
    result = await api.orderQuery(data);

    if (result.return_code != 'SUCCESS' || result.return_msg != 'OK') {
        interfaces.status = 0;
        interfaces.msg = result.return_code + ',' + result.return_msg + ',' + result.trade_state_desc;
    } else {
        interfaces.data = {
            out_trade_no: result.out_trade_no,
            result_code: result.result_code,
            time_end: result.time_end,
            trade_state_desc: result.trade_state_desc,
            total_fee: result.total_fee,
            cash_fee: result.cash_fee,
            transaction_id: result.transaction_id
        };
        interfaces.status = 1;
        interfaces.msg = result.trade_state_desc;
    }

    return interfaces;
}
module.exports = WeChatOrder;