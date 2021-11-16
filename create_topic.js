#!/usr/bin/env node

require('dotenv').config()

const {
  Client,
  TopicCreateTransaction,
  PrivateKey,
  AccountId
} = require('@hashgraph/sdk')

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

  // create topic
  const createResponse = await new TopicCreateTransaction().execute(client)
  const createReceipt = await createResponse.getReceipt(client)

  process.stdout.write(createReceipt.topicId.toString())
}

main()
