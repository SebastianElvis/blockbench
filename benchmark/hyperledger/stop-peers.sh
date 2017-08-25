#!/bin/bash

cd `dirname ${BASH_SOURCE-$0}`
. env.sh

echo 'Stop peer/java/driver processes in HOSTS'
for peer in `cat $HOSTS`; do
  ssh -i ~/.ssh/mykey $peer sudo killall -KILL peer java driver
done

# stop clients
echo 'Stop peer/java/driver processes in CLIENTS'
for client in `cat $CLIENTS`; do
  ssh -i ~/.ssh/mykey $client sudo killall -KILL driver peer java
done
