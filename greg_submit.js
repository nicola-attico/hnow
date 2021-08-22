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

    let counter = 0

    // should check constants are set here
    // loop for ever
    while (true) {
        try {
            client = Client.forTestnet().setOperator(
                AccountId.fromString(accountId),
                PrivateKey.fromString(privateKey)
            );

            while (true) {

    counter = counter + 1
    console.log("counter " + counter)

                let receipt = await (
                    await new TopicMessageSubmitTransaction()
                        .setTopicId(topicId)
                        .setMessage("message " + counter)
                        .execute(client)
                ).getReceipt(client);


                console.log(JSON.stringify(receipt));
                //sleep between submits
                await sleep(250000);
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
    console.log("Sleeping " + ms + " ms...")
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

main();
