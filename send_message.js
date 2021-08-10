const {
    Client,
    PrivateKey,
    AccountId,
    TopicMessageQuery,
    TopicCreateTransaction,
    TopicMessageSubmitTransaction,
} = require("@hashgraph/sdk");

var args = process.argv.slice(2);
let topicId = args[0]
let message = args[1];

async function main() {
    let client;

    try {
        client = Client.forTestnet().setOperator(
            AccountId.fromString("0.0.501886"),
            PrivateKey.fromString("302e020100300506032b6570042204200ade448a3fe4d9861b192feee2ddf4d476a2d6ad8dbdd436f24d5853889cafa6")
        );
    } catch {
        throw new Error(
            "Environment variables HEDERA_NETWORK, OPERATOR_ID, and OPERATOR_KEY are required."
        );
    }

        // eslint-disable-next-line no-await-in-loop
     let receipt =  await (
            await new TopicMessageSubmitTransaction()
                .setTopicId(topicId)
                .setMessage(message)
                .execute(client)
        ).getReceipt(client);

     console.log(JSON.stringify(receipt));
}

main();
