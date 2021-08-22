require('dotenv').config()

const {
    Client,
    PrivateKey,
    AccountId,
    TopicId,
    TopicMessageQuery,
    Timestamp
} = require("@hashgraph/sdk");

console.log(Date() + " *************** STARTUP ***************")

let startTime = new Timestamp(0);
const topicId = process.env.TOPIC_ID;
const accountId = process.env.INSTANCE_ACCOUNT_ID;
const privateKey = process.env.INSTANCE_PRIVATE_KEY;

let client;

async function main() {
    await subscribe();
    console.log("ending main");
}

async function subscribe() {
    try {
        client = Client.forTestnet().setOperator(
            AccountId.fromString(accountId),
            PrivateKey.fromString(privateKey)
        );
        console.log("Subscribing");
        // add 1 nano second to start time to avoid receiving duplicates
        startTime = startTime.plusNanos(1);
        let topicMessageQuery = new TopicMessageQuery()
            .setTopicId(TopicId.fromString(topicId))
            .setStartTime(startTime);

        topicMessageQuery.subscribe(client,
            (error) => {
                console.error("ERROR " + JSON.stringify(error))
                // start a new subscription in 5 seconds
                setTimeout(subscribe, 5000);
            },
            (message) => {
                // handle message here
                let sequence_number = message.sequenceNumber.toString();
                startTime = message.consensusTimestamp;
                console.log("message " + sequence_number + " : " + message.contents);
            });
    } catch (error) {
        try {
            client.close();
        } catch(closeError) {
            console.error(closeError);
        }
        // log error, wait 5s and restart
        console.error(error);
        setTimeout(subscribe, 5000);
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

main();
