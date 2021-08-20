require('dotenv').config()

const {
    Client,
    PrivateKey,
    AccountId,
    TopicMessageSubmitTransaction,
} = require("@hashgraph/sdk");

let client;
const topicId = process.env.TOPIC_ID;
const accountId = process.env.INSTANCE_ACCOUNT_ID;
const privateKey = process.env.INSTANCE_PRIVATE_KEY;


async function main() {
    console.log(Date() + " *************** STARTUP ***************")

    // should check constants are set here
    // loop for ever
    while (true) {
        try {
            client = Client.forTestnet().setOperator(
                AccountId.fromString(accountId),
                PrivateKey.fromString(privateKey)
            );
            while (true) {
                let receipt = await (
                    await new TopicMessageSubmitTransaction()
                        .setTopicId(topicId)
                        .setMessage("message")
                        .execute(client)
                ).getReceipt(client);

                console.log(JSON.stringify(receipt));
                await sleep(10000);
            }
        } catch (error) {
            try {
                client.close();
            } catch (closeError) {
                console.error(closeError);
            }
            // display error and restart after waiting 5s
            console.error(error);
            await sleep(5000);
        }
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

main();
