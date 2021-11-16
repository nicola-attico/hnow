#!/usr/bin/env node

require('dotenv').config()

const {
  Client,
  PrivateKey,
  AccountId,
  TopicMessageSubmitTransaction
} = require('@hashgraph/sdk')

const args = process.argv.slice(2)
const topicId = args[0]
const message = args[1]

async function main () {
  let client

  try {
    client = Client.forTestnet().setOperator(
      AccountId.fromString(process.env.INSTANCE_ACCOUNT_ID),
      PrivateKey.fromString(process.env.INSTANCE_PRIVATE_KEY)
    )
  } catch {
    throw new Error(
      'Environment variables HEDERA_NETWORK, OPERATOR_ID, and OPERATOR_KEY are required.'
    )
  }

  // eslint-disable-next-line no-await-in-loop
  const receipt = await (
    await new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(message)
      .execute(client)
  ).getReceipt(client)

  console.log(JSON.stringify(receipt))
}

main()
