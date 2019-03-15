//https://github.com/befinal/node-tenpay
var tenpay = require('tenpay');

var path = require('path');

//生成二维码
//var qrImg = require(path.resolve("../plugins/qrImg"));

/**
 *统一处理所有支付
 *
 * @param {*} params
 * @returns
 */
async function WeChatPay(params) {
    //返回结果
    var result = {};

    //返回结果
    var interfaces = {
        data: '',
        status: 1,
        msg: ''
    };
    //判断签名是否错误
    if (params.status != 1) {
        interfaces.status = 0;
        interfaces.msg = '参数处理错误';
    } else {
        var config = params.config;
        var data = params.data;

        //判断支付类型 NATIVE,JSAPI,APP,
        var trade_type = data.trade_type;
        //实例化tenpay对象
        var api = new tenpay(config);

        switch (trade_type) {
            case 'NATIVE':
                /**
                 * 微信统一支付接口
                 */
                result = await api.unifiedOrder(data);
                if (result.return_code != 'SUCCESS' || result.return_msg != 'OK') {
                    interfaces.status = 0;
                    interfaces.msg = result.return_code + result.return_msg;
                } else {
                    // var img_url = qrImg({
                    //     code_url: result.code_url,
                    //     size: 10
                    // })
                    interfaces.data = {
                        out_trade_no: data.out_trade_no,
                        code_url: result.code_url,
                        img_url: ''
                    }
                    interfaces.status = 1;
                    interfaces.msg = '成功';
                }
                break;
            case 'JSAPI':
                /**
                 * 1
                 *  获取微信JSSDK支付参数(自动下单, 兼容小程序)
                 */
                // result = await api.getPayParams(data);

                /**
                 * 2
                 * 获取微信JSSDK支付参数(通过预支付会话标识, 兼容小程序)
                 * 该方法需先调用api.unifiedOrder统一下单, 获取prepay_id;
                 */
                var results = await api.unifiedOrder(data);
                if (results.return_code != 'SUCCESS' || results.return_msg != 'OK') {
                    interfaces.status = 0;
                    interfaces.msg = results.return_code + results.return_msg;
                } else {
                    result = await api.getPayParamsByPrepay({
                        prepay_id: results.prepay_id
                    });
                    interfaces.data = {
                        out_trade_no: data.out_trade_no,
                        package: result
                    };
                    interfaces.status = 1;
                    interfaces.msg = '成功';
                }
                break;
            case 'MICROPAY':
                /**
                 * 刷卡支付
                 */
                //删除trade_type键
                delete data.trade_type;
                result = await api.micropay(data);
                interfaces.data = {
                    out_trade_no: data.out_trade_no
                }
                interfaces.status = 0;
                interfaces.msg = '请以查单结果为准';
                break;
            case 'APP':
                result.return_code = "ERROR";
                result.return_msg = "暂未实现"
                break;
            case 'MWEB(H5)':
                result.return_code = "ERROR";
                result.return_msg = "暂未实现"
                break;
            default:
                result.return_code = "ERROR";
                result.return_msg = 'trade_type:' + data.trade_type + '类型错误'
                break;
        }
    }
    return interfaces;
}
module.exports = WeChatPay;