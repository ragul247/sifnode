// Making this mjs file to incorporate zx as this will be handy here when

import helpers from "@openzeppelin/test-helpers";
import configure from "@openzeppelin/test-helpers/configure.js";
import Web3 from "web3";

const { time } = helpers;

const provider = new Web3.providers.HttpProvider("http://localhost:7545");

const web3 = new Web3(provider);

async function advanceBlock(count) {
  configure({ provider });

  console.log("Advancing time by " + count + " blocks");
  console.log(`current block number is ${await web3.eth.getBlockNumber()}`);

  for (let i = 0; i < count; i++) {
    await time.advanceBlock();
  }

  console.log(`new block number is ${await web3.eth.getBlockNumber()}`);
  console.log("Finished advancing time.");
}

const [count] = process.argv.slice(-1);

advanceBlock(count).then(() => {
  console.log("Done.");
});
