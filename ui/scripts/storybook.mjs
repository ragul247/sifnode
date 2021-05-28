#!/usr/bin/env zx

import arg from "arg";

const args = arg({ "--build": Boolean, "-b": "--build" });
const isBuildRequested = args["--build"];

if (isBuildRequested) {
  await $`build-storybook`;
} else {
  await $`start-storybook -p 6006`;
}
