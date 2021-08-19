#!/bin/bash

while true; do

node listen.js $1 $2 $3 $4 $5 >> logs/listen_$1.log 2>&1 &

pid=$!

echo $pid >> logs/listen_$1.log

sleep 30

kill $pid

done

