#!/usr/bin/env zx

await Promise.all([$`cd ./app && yarn serve`, $`cd ./core && yarn watch`]);
