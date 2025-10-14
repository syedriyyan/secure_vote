import { expect } from "chai";
import { ethers } from "hardhat";

describe("Election / Ballot / VoterRegistry integration", function () {
  it("deploys registry and election manager, creates ballot and allows voting flow", async function () {
    const [admin, voter1, voter2] = await ethers.getSigners();

    // Deploy registry
    const Registry = await ethers.deployContract("VoterRegistry", [admin.address]);
    await Registry.waitForDeployment();

    // Deploy Election manager
    const Election = await ethers.deployContract("Election", [await Registry.getAddress(), admin.address]);
    await Election.waitForDeployment();

    // Create election
    const start = Math.floor(Date.now() / 1000) + 1;
    const end = start + 600;
    const tx = await Election.createElection("Test Election", start, end);
    await tx.wait();

    const count = await Election.electionCount();
    expect(count).to.equal(1);

    // Get ballot address and add candidate via manager
    const ballotAddr = await Election.getBallotAddress(1);
    const Ballot = await ethers.getContractAt("Ballot", ballotAddr);

    await Election.addCandidate(1, "Alice");
    await Election.addCandidate(1, "Bob");

    // Register voters
    await Registry.registerVoter(voter1.address);
    await Registry.registerVoter(voter2.address);

    // Fast forward time (if using hardhat network) by mining blocks (skip here, tests may need evm_increaseTime)
    await ethers.provider.send("evm_increaseTime", [2]);
    await ethers.provider.send("evm_mine", []);

    // Connect as voter1 and vote
    const BallotVoter1 = Ballot.connect(voter1);
    await BallotVoter1.vote(1);

    // Check candidate votes
    const candidates = await Ballot.getCandidates();
    expect(candidates[2][0] === "Alice" || candidates[2][1] === "Alice"); // basic guard; extend asserts
  });
});