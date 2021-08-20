require('dotenv').config()

const {
  Client,
  PrivateKey,
  PublicKey,
  AccountId,
  Timestamp,
  TopicId,
  TopicMessageQuery
} = require('@hashgraph/sdk')

const axios = require('axios')

const args = process.argv.slice(2)
const topicId = args[0]
const startTimeSec = args[1]
const startTimeNano = args[2]
const instanceName = args[3]
const tableName = args[4]

console.log(Date() + ' *************** STARTUP ***************')

const startTime = new Timestamp(startTimeSec, startTimeNano)

if (topicId === null || topicId === '') {
  process.exit(1)
}
if (instanceName === null || instanceName === '') {
  process.exit(1)
}
if (tableName === null || tableName === '') {
  process.exit(1)
}

async function main () {
  let client

  try {
    client = Client.forTestnet().setOperator(
      AccountId.fromString(process.env.INSTANCE_ACCOUNT_ID),
      PrivateKey.fromString(process.env.INSTANCE_PRIVATE_KEY)
    )
  } catch {
    throw new Error(
      'Environment variables not set.'
    )
  }

  const topicMessageQuery = new TopicMessageQuery()
    .setTopicId(TopicId.fromString(topicId))
    .setStartTime(startTime)

  topicMessageQuery.subscribe(client,
    (error) => {
      console.log('Subscribe error ' + JSON.stringify(error))
      throw error
    },
    (message) => {

      const contentsj = Buffer.from(message.contents, 'utf8').toString()
      const contents = JSON.parse(contentsj)
      const payload64 = contents.payload64
      const sequenceNumber = message.sequenceNumber.toString()

      const sncMsg = {
        contents: contents,
        sequence_number: sequenceNumber,
        number_of_chunks: message.chunks.length,
        consensus_timestamp_sec: message.consensusTimestamp.seconds.toString(),
        consensus_timestamp_nano: message.consensusTimestamp.nanos.toString(),
        consensus_datetime: new Date(
Math.abs(Number((message.consensusTimestamp.seconds) * 1000) + 
(Number(message.consen>
          .toISOString()
          .replace(/T/, ' ')
          .replace(/\..+/, ''),
        running_hash: toHexString(message.runningHash),
        topic_id: topicId,

        payload64: payload64,
        payload: Buffer.from(payload64, 'base64').toString(),
        payload64_hash: contents.hash,
        instance: contents.instance,
        participant: contents.participant,
        state: 'pending',
        pubkey: contents.pubkey,
        signature: contents.signature,
        signature_verification: verify(contents.hash, contents.signature, contents.pubkey),
        sys_id: contents.guid
      }

      axios
        .get('https://' + instanceName + '.service-now.com//api/now/table/' + tableName,
          {
            auth: {
              username: 'hedera',
              password: 'Hedera123'
            },
            params: { sequence_number: sequenceNumber }
          })
        .then((res) => {
          if (res.data.result.length === 0) {
            console.log(Date() + 'Processing sequence number ' + sequenceNumber)

            axios
              .post('https://' + instanceName + '.service-now.com/api/now/table/' + tableName,
                sncMsg, {
                  auth: {
                    username: 'hedera',
                    password: 'Hedera123'
                  }
                })
              .then((res) => {
                console.log('statusCode: ' + res.status)
              })
              .catch((error) => {
                console.log('Unable to execute REST')
                throw error
              })
          } else {
            console.log(Date() + 'Skipping sequence number' + sequenceNumber)
          }
        })
    }
  )
}

function toHexString (byteArray) {
  let s = '0x'
  for (let j = 0; j < byteArray.length; j++) {
    s += ('0' + (byteArray[j] & 0xFF).toString(16)).slice(-2)
  }
  return s
}

function verify (message, signature, publicKey) {
  if (message && signature && publicKey) {
    return PublicKey.fromString(publicKey).verify(Uint8Array.from(message), Uint8Array.from(Buffer.from(signature, 'base64')))
  } else {
    console.log('Verify parameter not set')
    return 1
  }
}

main()
