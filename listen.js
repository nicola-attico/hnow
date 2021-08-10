const {
    Client,
    PrivateKey,
    PublicKey,
    AccountId,
    TopicId,
    TopicMessageQuery,
    TopicCreateTransaction,
    TopicMessageSubmitTransaction,
} = require("@hashgraph/sdk");

const axios = require('axios');

var args = process.argv.slice(2);
let topicId = args[0];
let startTime = args[1];
let instanceName = args[2];
let tableName = args[3];

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

    console.log("here");

    new TopicMessageQuery()
        .setTopicId(TopicId.fromString(topicId))
        .setStartTime(startTime)
        .subscribe(client, (message) => {
            let contentsj = Buffer.from(message.contents, "utf8").toString();
            let contents = JSON.parse(contentsj);
            let payload64 = contents.payload64;
            let sequence_number = message.sequenceNumber.toString();

            console.log("hash " + contents.hash);
            console.log("sig " + contents.signature);
            console.log("pk " + contents.pubkey);

            console.log(JSON.stringify(contents))

            let snc_msg = {
               contents: contents,
               sequence_number: sequence_number,
               number_of_chunks: message.chunks.length,
               payload64: payload64,
               payload: Buffer.from(payload64, 'base64').toString(), 
               payload64_hash: contents.hash, 
               instance: contents.instance,
               state: 'pending',
               //consensus_timestamp: message.consensusTimestamp.second *  1000000000 + message.consensusTimestamp.nanos,
               consensus_timestamp_zulu: message.consensusTimestamp.toDate().toString(),
               consensus_timestamp_sec: message.consensusTimestamp.seconds.toString(),
               consensus_timestamp_nano: message.consensusTimestamp.nanos.toString(), 
               consensus_datetime: new Date(Math.abs(Number((message.consensusTimestamp.seconds) * 1000) + (Number(message.consensusTimestamp.nanos) / 1000000))).toISOString().replace(/T/, ' ').replace(/\..+/, ''),
               topic_id: topicId,
               pubkey: contents.pubkey,
               signature: contents.signature,
               signature_verification: verify(contents.hash, contents.signature, contents.pubkey), 
               running_hash: toHexString(message.runningHash),
               sys_id: contents.guid
               }

            console.log("here3" + snc_msg);

            axios.get("https://" + instanceName + ".service-now.com//api/now/table/" + tableName,{ auth: { username: 'hedera', password: 'hedera'},params: { 'sequence_number': sequence_number }} ).then(res => {if (res.data.result.length == 0 ) {console.log("Processing sequence number " + sequence_number)

            axios
              .post('https://' + instanceName + '.service-now.com/api/now/table/' + tableName, 
               snc_msg, { auth: { username: 'hedera', password: 'hedera'} })
              .then(res => {
              console.log(`statusCode: ${res.status}`)
              //console.log(res)
              })
             .catch(error => {
                console.error("error")
             })


} else {console.log("Skipping sequence number" + sequence_number)}})

          }
        ); 

}

        function toHexString(byteArray) {
            var s = '0x';
            for (j = 0; j < byteArray.length; j++) {
                s += ('0' + (byteArray[j] & 0xFF).toString(16)).slice(-2);
            }
            return s;
        }

function verify(message, signature, public_key) {
     let result = PublicKey.fromString(public_key).verify(Uint8Array.from(message), Uint8Array.from(Buffer.from(signature, 'base64')))
     return result;
}

main();

