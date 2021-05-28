#!/bin/bash

set -e

./scripts/ensure-docker-logged-in.sh

# If CI don't use tty - this is so we can use Ctrl C to cancel the stack script localy
[ -t 1 ] && IT="-it"

# get latest image name from latest file
IMAGE_NAME=$(cat ./scripts/latest)

# kill all other docker processes
[[ ! -z "$(docker ps -qaf name=sif-ui-stack)" ]] && docker stop sif-ui-stack && docker rm sif-ui-stack

# this runs a docker image built by the build command
docker create $IT \
  -p 1317:1317 \
  -p 7545:7545 \
  -p 26656:26656 \
  -p 26657:26657 \
  --name sif-ui-stack \
  --platform linux/amd64 \
  $IMAGE_NAME

# Need to copy abi dependencies for frontend
mkdir -p ../smart-contracts/build/contracts
docker cp sif-ui-stack:/sif/smart-contracts/build/contracts/BridgeBank.json ../smart-contracts/build/contracts/

docker start -ai sif-ui-stack