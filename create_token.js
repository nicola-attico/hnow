#!/usr/bin/env node

require('dotenv').config()

const {
    Client,
    TopicCreateTransaction,
    TopicMessageSubmitTransaction,
    TokenCreateTransaction,
    PrivateKey,
    PublicKey,
    AccountId,
} = require("@hashgraph/sdk");

var argv = require('minimist')(process.argv.slice(2));
console.log(JSON.stringify(argv))

var tokenSymbol = argv.symbol;
var tokenName = argv.name;
var tokenDecimals = argv.decimals;
var tokenInitialSupply = argv.supply;
var tokenTreasuryAccountId = AccountId.fromString(argv.treasury_account);
var tokenAdminKey = PublicKey.fromString(argv.admin_key);

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

    // create token
    resp = await new TokenCreateTransaction()
//        .setNodeAccountIds([resp.nodeId])
        .setTokenName(tokenName)
        .setTokenSymbol(tokenSymbol)
        .setDecimals(tokenDecimals)
        .setInitialSupply(tokenInitialSupply)
        .setTreasuryAccountId(tokenTreasuryAccountId)
        .setAdminKey(tokenAdminKey)
//        .setFreezeKey(tokenFreezeKey)
//        .setWipeKey(tokenWipeKey)
//        .setKycKey(tokenKycKey)
//        .setSupplyKey(tokenSupplyKey)
        .setFreezeDefault(false)
        .execute(client);

    const tokenId = (await resp.getReceipt(client)).tokenId;

    process.stdout.write(tokenId.toString());
}

void main();
