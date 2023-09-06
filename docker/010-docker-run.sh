#!/bin/bash

docker run -ti --rm \
    -e NODE_ENV=development \
    -e NODE_MEMORY=2GB \
    --name node_logger_dev \
    --hostname node_logger_dev \
    -v $(pwd)/docker_out:/ext_src \
    -v $(pwd)/../node/:$(pwd)/../node/ \
    -v ~/.npmrc:/root/.npmrc \
    -v ~/.npmrc:/home/node/.npmrc \
    --workdir $(pwd)/../node/ \
    --user 1000:1000 \
    malkab/nodejs-dev:16.13.2
