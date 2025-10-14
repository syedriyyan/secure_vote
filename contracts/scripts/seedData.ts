import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * Example seed script:
 * - Reads deploy-info.json
 * - Creates an election and adds candidates using the Election manager
 */
async function main() {
  const deployInfoPath = path.join(__dirname, "..", "deploy-info.json");
  if (!fs.existsSync(deployInfoPath)) {
    throw new Error("deploy-info.json not found. Deploy first.");
  }
  const data = JSON.parse(fs.readFileSync(deployInfoPath, "utf8"));
  const electionAddr = data.Election;

  const Election = await ethers.getContractAt("Election", electionAddr);
  const tx = await Election.createElection("General Election", Math.floor(Date.now() / 1000) + 60, Math.floor(Date.now() / 1000) + 3600);
  await tx.wait();
  console.log("Created election, tx:", tx.hash);

  // Get the newly created election id (electionCount)
  const count = await Election.electionCount();
  const info = await Election.getElectionInfo(count);
  console.log("Election info:", info);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});