#!/usr/bin/env zx

import arg from "arg";
import { e2eTest, e2eTestDebug, serveBuiltApp, waitOn } from "./lib.mjs";

const args = arg({ "--debug": Boolean });
const isDebug = args["--debug"];

// Only run test script
if (isDebug) {
  await e2eTestDebug();
  process.exit(0);
}

// Run server and test script concurrently
await Promise.race([
  serveBuiltApp(),
  waitOn("http://localhost:5000").then(() => {
    process.env.PORT = "5000";
    return e2eTest();
  }),
]);
