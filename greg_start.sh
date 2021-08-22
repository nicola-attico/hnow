echo "*** RESTART ***" > greg_subscribe.log
echo "*** RESTART ***" > greg_submit.log

nohup node greg_subscribe.js >> greg_subscribe.log 2>&1 &
nohup node greg_submit.js >> greg_submit.log 2>&1 &
