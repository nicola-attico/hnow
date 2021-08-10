const {
    Client,
    TopicCreateTransaction,
    TopicMessageSubmitTransaction,
    PrivateKey,
    AccountId,
} = require("@hashgraph/sdk");

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

    // create topic
    const createResponse = await new TopicCreateTransaction().execute(client);
    const createReceipt = await createResponse.getReceipt(client);

    process.stdout.write(createReceipt.topicId.toString());
}

void main();
