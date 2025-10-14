/**
 * Etherscan verification helper (example).
 * Hardhat's builtin verify can be used: `npx hardhat verify --network sepolia <address> <constructor args...>`
 * This script demonstrates how to call that programmatically if needed.
 */
import { run } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const deployInfoPath = path.join(__dirname, "..", "deploy-info.json");
  if (!fs.existsSync(deployInfoPath)) {
    throw new Error("deploy-info.json not found. Deploy first.");
  }
  const data = JSON.parse(fs.readFileSync(deployInfoPath, "utf8"));
  const network = data.network || "sepolia";
  const electionAddr = data.Election;

  console.log("Verifying Election at", electionAddr, "on", network);
  await run("verify:verify", {
    address: electionAddr,
    constructorArguments: [data.VoterRegistry, data.deployer]
  });
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});