#!/usr/bin/env node

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

if (topicId == null || topicId == '') { console.log('EXIT'); process.exit(1) }
if (instanceName == null || instanceName == '') { console.log('EXIT'); process.exit(1) }
if (tableName == null || tableName == '') { console.log('EXIT'); process.exit(1) }

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
    (error) => { console.log('ERROR ' + JSON.stringify(error)) },
    (message) => {
      const contents64 = Buffer.from(message.contents, 'utf-8').toString()
      //            console.log("contents64" + contents64);
      const contentsj = Buffer.from(contents64, 'base64').toString()
      //            console.log("contentsj " + contentsj);
      const contents = JSON.parse(contentsj)
      const payload64 = contents.payload64
      const sequence_number = message.sequenceNumber.toString()

      const snc_msg = {
        contents64: contents64,
        contents: contents,
        sequence_number: sequence_number,
        number_of_chunks: message.chunks.length,
        payload64: payload64,
        payload: Buffer.from(payload64, 'base64').toString(),
        payload64_hash: contents.hash,
        instance: contents.instance,
        participant: contents.participant,
        state: 'pending',
        consensus_timestamp_sec: message.consensusTimestamp.seconds.toString(),
        consensus_timestamp_nano: message.consensusTimestamp.nanos.toString(),
        consensus_datetime: new Date(Math.abs(Number((message.consensusTimestamp.seconds) * 1000) + (Number(message.consensusTimestamp.nanos) / 1000000))).toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        topic_id: topicId,
        account_id: process.env.INSTANCE_ACCOUNT_ID,
        pubkey: contents.pubkey,
        signature: contents.signature,
        signature_verification: verify(contents.hash, contents.signature, contents.pubkey),
        running_hash: toHexString(message.runningHash),
        sys_id: contents.guid
      }

      axios
        .get('https://' + instanceName + '.service-now.com//api/now/table/' + tableName,
          {
            auth: { username: 'hedera', password: 'Hedera123' },
            params: { sequence_number: sequence_number }
          })
        .then(res => {
          if (res.data.result.length == 0) {
            console.log(Date() + 'Processing sequence number ' + sequence_number)

            axios
              .post('https://' + instanceName + '.service-now.com/api/now/table/' + tableName,
                snc_msg, { auth: { username: 'hedera', password: 'Hedera123' } })
              .then(res => {
                console.log(`statusCode: ${res.status}`)
              })
              .catch(error => {
                console.error('AXIOS POST ERROR ' + JSON.stringify(error))
              })
          } else {
            console.log(Date() + 'Skipping sequence number' + sequence_number)
          }
        })
    }
  )
}

function sleep (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function toHexString (byteArray) {
  let s = '0x'
  for (j = 0; j < byteArray.length; j++) {
    s += ('0' + (byteArray[j] & 0xFF).toString(16)).slice(-2)
  }
  return s
}

function verify (message, signature, public_key) {
  if (message && signature && public_key) {
    return PublicKey.fromString(public_key).verify(Uint8Array.from(message), Uint8Array.from(Buffer.from(signature, 'base64')))
  } else {
    console.log('Verify parameter not set')
    return 1
  }
}

main()
