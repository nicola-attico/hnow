echo "*** PRE ***"
./ps_loader.sh

echo "*** KILL ***"
children=$(ps -o pid= --ppid $1)
echo $children
kill -9 $1
kill -9 $children

echo "*** POST ***"
./ps_loader.sh
