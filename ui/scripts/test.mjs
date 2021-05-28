#!/usr/bin/env zx

await $`cd core`;
await $`yarn compile`;
await $`yarn test`;
