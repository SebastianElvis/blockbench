#!/bin/bash
#args: nnodes

#cd `dirname ${BASH_SOURCE-$0}`

source /users/hanrc/blockbench/benchmark/hyperledger/env.sh

CONFIG=hl_consensus_$1".yaml"
for peer in `cat $HOSTS`; do
  echo "Copying peers info to config.yaml..."
  scp -i ~/.ssh/mykey $CONFIG $peer:$HL_SOURCE/consensus/pbft/config.yaml
done

i=0
for peer in `cat $HOSTS`; do
  echo "SSH to peer " $peer
  if [[ $i -eq 0 ]]; then
    echo "Start root..."
    ssh -i ~/.ssh/mykey $peer . $HL_HOME/start-root.sh
    bpeer=$peer
  elif [[ $i -lt $1 ]]; then
    echo "Start slave..."
    ssh -i ~/.ssh/mykey $peer . $HL_HOME/start-slave.sh $bpeer $i
  fi
  let i=$i+1
done
echo bpeer = $bpeer
