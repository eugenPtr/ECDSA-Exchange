const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const SHA256 = require('crypto-js/sha256');

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

let balances = {};
let privateKeys = {};

// Generate some addresses (public keys) with corresponding private keys and drop them some tokens
for (let i=1; i<=3; i++) {
  const key = ec.genKeyPair();
  const publicKey = key.getPublic().encode('hex');
  balances[publicKey] = 100;
  privateKeys[publicKey] = key.getPrivate().toString('hex');
}

// Below are some hard coded public - private keys for testing

// balances =  {
//   '042a1efdfe871b7f08548f9d406e61d3b4f32352373d8444d894747b6d8bbb3c56c9415eb2eef856cad3973903afb7a20b3a91dc0c2eb47fcff3fc9c6d24468bf6': 100,
//   '04e531da655d3b1bb3f91e09b18207ea47222a1486dc87915b26bd5c5bad5221591753731168c288d07a41ad430c5705af355ee310bcdf33774239bb87d8c70dce': 100,
//   '04fe35eb8f784961d8c28361343ddca2886177a81c97c551c7010a35b406e61f71181fb2c476636738455dba6519bf35cc8661ff39ffcc2c83fbde6e1b2e39ed94': 100
// }

// privateKeys = {
//   '042a1efdfe871b7f08548f9d406e61d3b4f32352373d8444d894747b6d8bbb3c56c9415eb2eef856cad3973903afb7a20b3a91dc0c2eb47fcff3fc9c6d24468bf6': '30f7b39d20f8b64f884b7fd991b2d6dbe47abaaac8609c451af4d80f9e6c1dd5',
//   '04e531da655d3b1bb3f91e09b18207ea47222a1486dc87915b26bd5c5bad5221591753731168c288d07a41ad430c5705af355ee310bcdf33774239bb87d8c70dce': '54374448f2347c4d6c95a265d17b6658fb7161e8e36cf5d2ce3ec676eb6c6c29',
//   '04fe35eb8f784961d8c28361343ddca2886177a81c97c551c7010a35b406e61f71181fb2c476636738455dba6519bf35cc8661ff39ffcc2c83fbde6e1b2e39ed94': '881189acebe9803141dfe08433fb1e36fce6a2786e28caf5f076b771a69502be'
// }

const verifySignature = (payload, signature) => {

  
  const publcKey = payload.sender;
  const key = ec.keyFromPublic(publcKey, 'hex');
  const payloadHash = SHA256(payload).toString();
  
  return key.verify(payloadHash, signature);
}

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address.toLowerCase()] || 0;
  console.log(balance);
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {payload, signature} = req.body;
  
  console.log(payload, payload.amount);

  if (verifySignature(payload, signature) && balances[payload.sender] >= payload.amount) {
    balances[payload.sender] -= payload.amount;
    balances[payload.recipient] = (balances[payload.recipient] || 0) + +payload.amount;
    res.send({ balance: balances[payload.sender], error: null });
  } else {
    res.send({ balance: balances[payload.sender], error: "Transaction failed"});
  }
  
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
  console.log("Available accounts \n ==================", balances);
  console.log("Private Keys\n======================", privateKeys);
});
