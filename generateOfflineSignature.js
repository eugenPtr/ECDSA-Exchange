const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const SHA256 = require('crypto-js/sha256');

// const args = process.argv.slice(2);
// console.log(args);

// TODO: fill in your hex private key
const privateKey = "30f7b39d20f8b64f884b7fd991b2d6dbe47abaaac8609c451af4d80f9e6c1dd5";
// TODO: change this message to whatever you would like to sign
const message = {"sender":"042a1efdfe871b7f08548f9d406e61d3b4f32352373d8444d894747b6d8bbb3c56c9415eb2eef856cad3973903afb7a20b3a91dc0c2eb47fcff3fc9c6d24468bf6","amount":"10","recipient":"04e531da655d3b1bb3f91e09b18207ea47222a1486dc87915b26bd5c5bad5221591753731168c288d07a41ad430c5705af355ee310bcdf33774239bb87d8c70dce"}
const msgHash = SHA256(message);

const key = ec.keyFromPrivate(privateKey); 

const signature = key.sign(msgHash.toString());

console.log({
    message: message,
    messageHash: msgHash.toString(),
    signature: {
        r: signature.r.toString(16),
        s: signature.s.toString(16)
    }
});

console.log(JSON.stringify({
    r: signature.r.toString('hex'),
    s: signature.s.toString('hex')
}))