#!/usr/bin/env node

require('dotenv').config()

const {
    PrivateKey
} = require("@hashgraph/sdk");

async function main() {

const privateKey = await PrivateKey.generate();
const publicKey = privateKey.publicKey;

const output = { privateKey: privateKey.toString(),
                 publicKey: publicKey.toString() }

process.stdout.write(JSON.stringify(output));
}

void main();
