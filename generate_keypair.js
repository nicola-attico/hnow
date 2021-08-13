require('dotenv').config()

const {
    PrivateKey
} = require("@hashgraph/sdk");

async function main() {
//  let keyPair = PrivateKey.generate();
//  let public_key = keyPair._keyPair.publicKey;
//  let private_key = keyPair._keyPair.secretKey;
//  let output = { privateKey: Buffer.from(private_key).toString('hex'),
//                 publicKey: Buffer.from(public_key).toString('hex') }
//  process.stdout.write(JSON.stringify(output));

const privateKey = await PrivateKey.generate();
const publicKey = privateKey.publicKey;

const output = { privateKey: privateKey.toString(),
                 publicKey: publicKey.toString() }

process.stdout.write(JSON.stringify(output));
}

void main();
