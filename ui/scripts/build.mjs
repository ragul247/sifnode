#!/usr/bin/env zx

import { lint } from "./lib.mjs";

await lint();
await $`cd ./core && yarn build`;
await $`cd ./app && yarn build`;
