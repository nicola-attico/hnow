require('dotenv').config()

const {
    Client,
    PrivateKey,
    AccountId,
    TopicId,
    TopicMessageQuery,
} = require("@hashgraph/sdk");

console.log(Date() + " *************** STARTUP ***************")

let startTime = 0;
const topicId = process.env.TOPIC_ID;
let client;

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
    subscribe();
}

function subscribe() {
    let topicMessageQuery = new TopicMessageQuery()
        .setTopicId(TopicId.fromString(topicId))
        .setStartTime(startTime);

    topicMessageQuery.subscribe(client,
        (error) => {
            console.log("ERROR " + JSON.stringify(error))
            // start a new subscription in 5 seconds
            setTimeout(subscribe(subscribeTime, topicId), 5000);
        },
        (message) => {
            // handle message here
            let sequence_number = message.sequenceNumber.toString();
            startTime = message.consensusTimestamp.plusNanos(1);
            console.log(sequence_number);
        });
}

main();
