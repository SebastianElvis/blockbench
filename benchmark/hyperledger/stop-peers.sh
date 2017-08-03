#!/bin/bash

cd `dirname ${BASH_SOURCE-$0}`
. env.sh

for peer in `cat $HOSTS`; do
  ssh -i ~/.ssh/mykey $peer killall -KILL peer java driver
done

# stop clients
for client in `cat $CLIENTS`; do
  ssh -i ~/.ssh/mykey $client killall -KILL driver peer java
done
