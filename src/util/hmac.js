import cryptoJs from 'crypto-js'

export function getJsApiSingnature(ticket, nonce, timeStamp, url) {
    let plainTex = "jsapi_ticket=" + ticket + "&noncestr=" + nonce + "&timestamp=" + timeStamp + "&url=" + url;
    let signature = cryptoJs.SHA1(plainTex).toString();

    return signature;
}
