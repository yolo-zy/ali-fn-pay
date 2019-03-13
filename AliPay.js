//https://github.com/Srar/AlipayF2F
var alipayf2f = require('alipay-ftof');

var path = require('path');

//生成二维码
//var qrImg = require(path.resolve("./qrImg"));

/**
 *统一处理所有支付
 *
 * @param {*} params
 * @returns
 */
async function AliPay(params) {
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
        var trade_type = data.trade_type;
        //实例化alipayf2f对象
        var alipay_f2f = new alipayf2f(config);
        switch (trade_type) {
            case 'qrcode':
                /**
                 * 二维码支付
                 */
                delete data.trade_type;
                await alipay_f2f.createQRPay(data).then(result => {
                    interfaces.data = {
                        tradeNo: data.tradeNo,
                        code_url: result.qr_code,
                        img_url: ''
                    };
                    interfaces.status = 1;
                    interfaces.msg = '成功';
                }).catch((error) => {
                    interfaces.status = 0;
                    interfaces.msg = error.message;
                    interfaces.data = error;
                });
                break;
            case 'scan_pay':
                //付款码付款
                delete data.trade_type;
                await alipay_f2f.createBarCodePay(data).then(result => {
                    interfaces.data = {
                        tradeNo: data.tradeNo
                    }
                    interfaces.status = 0;
                    interfaces.msg = '请以查单结果为准';
                }).catch((error) => {
                    interfaces.status = 0;
                    interfaces.msg = error.message;
                })
                break;
            default:
                interfaces.status = 0;
                interfaces.msg = 'trade_type:' + data.trade_type + '类型错误';
                interfaces.data = 'ERROR';
                break;
        }
    }
    return interfaces;
}
module.exports = AliPay;