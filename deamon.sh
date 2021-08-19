#!/bin/bash

while true; do

echo "=== New Iteration ==="
date

echo "start"

node listen.js $1 $2 $3 $4 $5 >> logs/listen_$1.log 2>&1 &

pid=$!

echo $pid

ps -ef | grep listen.js | grep -v grep

sleep 60

date
echo "kill"

kill -9 $pid

ps -ef | grep listen.js | grep -v grep

done

