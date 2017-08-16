#!/bin/bash
#args: nnodes

cd `dirname ${BASH_SOURCE-$0}`

source ./env.sh

CONFIG=hl_consensus_$1".yaml"
for peer in `cat $HOSTS`; do
  echo "Copying peers info to config.yaml..."
  scp -i ~/.ssh/mykey $CONFIG $peer:$HL_SOURCE/consensus/pbft/config.yaml
done

i=0
for peer in `cat $HOSTS`; do
  #echo "SSH to peer " $peer
  if [[ $i -eq 0 ]]; then
    echo "Start root..." $peer
    ssh -i ~/.ssh/mykey $peer bash $HL_HOME/start-root.sh
    orderer=$peer
    echo "The orderer is " $orderer
  elif [[ $i -lt $1 ]]; then
    echo "Start slave..." $peer
    ssh -i ~/.ssh/mykey $peer bash $HL_HOME/start-slave.sh $orderer $i
  fi
  let i=$i+1
done
