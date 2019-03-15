/**
 * 微信支付-生成支付链接
 */
var getRawBody = require('raw-body');
var getFormBody = require("body/form");
var md5 = require('md5');
var path = require('path');
//公共参数处理
var parse_signed_req = require(path.resolve("./plugins/parse_signed_req"));

//微信支付
var WeChatPay = require(path.resolve("./WeChart/WeChatPay"));
//微信查单
var WeChatOrder = require(path.resolve("./WeChart/WeChatOrder"));
//支付宝支付
var AliPay = require(path.resolve("./Ali/AliPay"));
//支付宝查单
var AliPayOrder = require(path.resolve("./Ali/AliPayOrder"));

//返回结果
var result = {};

module.exports.handler = async function (req, resp, context) {

    //生成随机时间用作订单号
    // var out_trade_no = new Date().getTime();

    getFormBody(req, async function (err, formBody) {

        //解析post提交的参数
        var params = parse_signed_req(req, formBody, resp);
        var action = req.queries.action;

        /**
         * get:action参数值
         * wechatpay:微信支付，alipay：支付宝支付，query_wechatpay:微信查单，query_alipay：支付宝查单，cancle_pay:取消支付
         */
        try {
            switch (action) {
                case 'wechatpay':
                    result = await WeChatPay(params);
                    break;
                case 'alipay':
                    result = await AliPay(params);
                    break;
                case 'query_wechatpay':
                    result = await WeChatOrder(params);
                    break;
                case 'query_alipay':
                    result = await AliPayOrder(params);
                    break;
                case 'cancle_pay':
                    result.data = '';
                    result.status = 0;
                    result.msg = '暂未实现';
                    break;
                default:
                    result.data = '';
                    result.status = 0;
                    result.msg = 'action错误';
            }
        } catch (e) {
            resp.send(e.message);
        }
        resp.send(JSON.stringify(result));
    })
}