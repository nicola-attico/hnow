#!/usr/bin/env node

require('dotenv').config()

const {
    Client,
    TopicCreateTransaction,
    TopicMessageSubmitTransaction,
    TokenAssociateTransaction,
    TokenCreateTransaction,
    PrivateKey,
    PublicKey,
    AccountId,
} = require("@hashgraph/sdk");

var argv = require('minimist')(process.argv.slice(2));
console.log(JSON.stringify(argv))

var tokenId = argv.tokenid;
var accountId = AccountId.fromString(argv.accountid);

async function main() {
    let client;

    try {
        client = Client.forTestnet().setOperator(
            AccountId.fromString(process.env.INSTANCE_ACCOUNT_ID),
            PrivateKey.fromString(process.env.INSTANCE_PRIVATE_KEY)
        );
    } catch {
        throw new Error(
            "Environment variables not set correctly."
        );
    }

    const resp = await (
            await new TokenAssociateTransaction()
//                .setNodeAccountIds([resp.nodeId])
                .setAccountId(accountId)
                .setTokenIds([tokenId])
                .freezeWith(client)
                .sign(accountId.privateKey)
        ).execute(client);

    const receipt = await resp.getReceipt(client);

    process.stdout.write(receipt.toString());
}

void main();

