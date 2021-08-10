const {
    PrivateKey,
} = require("@hashgraph/sdk");

var args = process.argv.slice(2);
let message = args[0]
let private_key = args[1];

function main() {
     let x = PrivateKey.fromString(private_key).sign(Uint8Array.from(message))
     process.stdout.write(Buffer.from(x).toString('base64'));
}

main();
