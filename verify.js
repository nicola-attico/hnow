#!/usr/bin/env node

const {
  PublicKey
} = require('@hashgraph/sdk')

const args = process.argv.slice(2)
const message = args[0]
const signature = args[1]
const publicKey = args[2]

function main () {
  const x = PublicKey.fromString(publicKey).verify(Uint8Array.from(message), Uint8Array.from(Buffer.from(signature, 'base64')))
  process.stdout.write(x)
}

main()
