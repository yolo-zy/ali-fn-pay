/**
 * 生成支付二维码
 */
var qr = require('qr-image');
// var fs = require('fs');
async function qrImg(params) {
    try {
        var img = qr.image(params.code_url,{size :params.size});
        //保存二维码图片在本地
        // img.pipe(fs.createWriteStream('./qr.png').on('finish', function () {
        //     console.log('seccuss')
        // }))
        return img;
    } catch (e) {
        return e;
    }
}
module.exports = qrImg;