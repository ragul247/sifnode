#!/usr/bin/env zx

import arg from "arg";
import { lint, lintQuick } from "./lib.mjs";

const args = arg({ "--quick": Boolean, "-q": "--quick" });
const isQuickMode = args["--quick"];

if (isQuickMode) {
  await lintQuick();
} else {
  await lint();
}
