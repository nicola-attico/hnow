const {
    PublicKey,
} = require("@hashgraph/sdk");

var args = process.argv.slice(2);
let message = args[0];
let signature = args[1]
let public_key = args[2];

function main() {
     let x = PublicKey.fromString(public_key).verify(Uint8Array.from(message), Uint8Array.from(Buffer.from(signature, 'base64')))
     process.stdout.write((x);
}

main();
