require('dotenv').config()

const {
    Client,
    PrivateKey,
    AccountId,
    TopicMessageSubmitTransaction,
} = require("@hashgraph/sdk");

let client;
const topicId = process.env.TOPIC_ID;

console.log(Date() + " *************** STARTUP ***************")

async function main() {

    try {
        client = Client.forTestnet().setOperator(
            AccountId.fromString(process.env.INSTANCE_ACCOUNT_ID),
            PrivateKey.fromString(process.env.INSTANCE_PRIVATE_KEY)
        );
    } catch {
        throw new Error(
            "Environment variables not set."
        );
    }

    while (true) {
        let receipt =  await (
            await new TopicMessageSubmitTransaction()
                .setTopicId(topicId)
                .setMessage("message")
                .execute(client)
        ).getReceipt(client);

        console.log(JSON.stringify(receipt));
        await sleep(1000);
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

main();
