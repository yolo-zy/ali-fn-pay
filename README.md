## ali-fn-pay
阿里云函数计算聚合微信支付宝支付

## 项目介绍
  阿里云函数计算聚合微信支付宝支付


## 项目地址
github:[https://github.com/GreatGod-zy/ali-fn-pay](https://github.com/GreatGod-zy/ali-fn-pay)
### 使用库

* [AlipayF2F](https://github.com/Srar/AlipayF2F) - 支付宝
* [node-tenpay](https://github.com/befinal/node-tenpay) - 微信支付

### 功能
* 微信二维码支付
* 微信刷卡支付
* 微信统一下单
* 支付宝二维码支付
* 支付宝付款码付款
* 微信支付宝查单


   
## 代码说明

### 目录结构
![avatar](http://img.precip.cn/list.png)

* AliPay: 支付宝支付实现
* AliPayOrder: 支付宝查单实现
* qrImg: 链接转二维码
* signature：签名
* parse_signed_req: 参数处理
* WeChatPay: 微信支付实现
* WeChatOrder: 微信查单实现
* index: 入口

### 核心代码

index.js

请求Http触发器 传参action分发执行具体功能
* https://******/WeChatPay/?action=wechatpay
```javascript
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
```
## 参数配置
参数不明确的或者详细参数可参考相应使用库
### 微信支付参数
```javascript
//配置参数
const config = {
  appid: '公众号ID',
  mchid: '微信商户号',
  partnerKey: '微信支付安全密钥',
  pfx: require('fs').readFileSync('证书文件路径'),
  notify_url: '支付回调网址',
  spbill_create_ip: 'IP地址'
};

//数据参数
const data={
  out_trade_no: '商户内部订单号',
  body: '商品简单描述',
  total_fee: '订单金额(分)',
  openid: '用户openid',
  trade_type: 'NATIVE',//NATIVE:微信统一支付接口，JSAPI：获取微信JSSDK支付参数(自动下单, 兼容小程序)，MICROPAY：刷卡支付，APP：暂未实现，MWEB(H5)：暂未实现
  product_id: '商品id'，
  //auth_code: '授权码'//支付授权码,当trade_type为MICROPAY时启用
}
```
### 微信查单参数
```javascript
const data={
  out_trade_no: '商户内部订单号'
}
```

### 支付宝支付参数
```javascript
//配置参数
const config={
    /* 以下信息可以在https://openhome.alipay.com/platform/appManage.htm查到, 不过merchantPrivateKey需要您自己生成 */
    /* 应用AppID */
    "appid": "",
    /* 通知URL 接受支付宝异步通知需要用到  */
    "notifyUrl": "",
    /* 公钥 和 私钥 的填写方式 */
    "testPrivateKey": "-----BEGIN RSA PRIVATE KEY-----\n" +
                    "公钥或私钥内容..." +
                    "\n-----END RSA PRIVATE KEY-----",
    /* 应用RSA私钥 请勿忘记 -----BEGIN RSA PRIVATE KEY----- 与 -----END RSA PRIVATE KEY-----  */
    "merchantPrivateKey": "",
    /* 支付宝公钥 如果为注释掉会使用沙盒公钥 请勿忘记 -----BEGIN PUBLIC KEY----- 与 -----END PUBLIC KEY----- */
    "alipayPublicKey": "",
    /* 支付宝支付网关 如果为注释掉会使用沙盒网关 */
    "gatewayUrl": "",
}

//数据参数
const data={
    tradeNo: "123",      // 必填 商户订单主键, 就是你要生成的
    subject: "商品",      // 必填 商品概要
    totalAmount: 0.5,    // 必填 多少钱
    body: "内容", // 可选 订单描述, 可以对交易或商品进行一个详细地描述
    trade_type: 'qrcode',//qrcode:二维码支付，scan_pay：付款码支付
    //authCode: "",// 支付授权码，当trade_type为scan_pay时启用
    timeExpress: 5       // 可选 支付超时, 默认为5分钟
}
```
 
    
## 项目运行
    git clone https://github.com/GreatGod-zy/ali-fn-pay.git
    cd ali-fn-pay
    npm install 或 cnpm install

    
登录阿里云选择函数计算创建函数，选择文件上传，将你的项目文件夹上传到刚创建的函数里
    
创建http触发器，请求触发器

![avatar](http://img.precip.cn/ali1.png)

请求http触发器https://******/WeChatPay/?action=wechatpay

```javascript
// key和签名方式克隆后修改
let key="as478w4aDF54WDFSf54f123fdSD56feFD";
let config=Base44.encode(JSON.stringify(config));
let data=Base44.encode(JSON.stringify(data));
let sign=md5(key+config+data);

$.ajax({
    url:'https://******/WeChatPay/?action=wechatpay',//地址
    type:'post',
    data:{
        config:config,
        data:data,
        sign:sign
    }
    success:function(res){
        console.log(res)
    },
    error:function(err){
        console.log(err)
    }
})

```

    

## 待解决问题



## 后续功能



## 最后


