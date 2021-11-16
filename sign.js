#!/usr/bin/env node

const {
  PrivateKey
} = require('@hashgraph/sdk')

const args = process.argv.slice(2)
const message = args[0]
const privateKey = args[1]

function main () {
  const x = PrivateKey.fromString(privateKey).sign(Uint8Array.from(message))
  process.stdout.write(Buffer.from(x).toString('base64'))
}

main()
