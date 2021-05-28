#!/bin/bash

set -e

if  [[ ! -f  ~/.docker/config.json || $(cat ~/.docker/config.json  | jq '.auths["ghcr.io"].auth') == 'null' ]]; then
  echo "In order to run this script and push a new container to the github registry you need to create a personal access token and use it to login to ghcr with docker"
  echo ""
  echo "  echo \$MY_PAT | docker login ghcr.io -u USERNAME --password-stdin"
  echo ""
  echo "For more information see https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-to-the-container-registry"
  echo ""
  echo "Create a personal access token and log into docker using the above link then try running this script again."
  exit 1
fi

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