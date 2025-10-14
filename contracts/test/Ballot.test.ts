import { expect } from "chai";
import { ethers } from "hardhat";

describe("Ballot", function () {
  it("allows only registered voters to vote and enforces single vote", async function () {
    const [admin, voter] = await ethers.getSigners();

    // Deploy registry and register voter
    const Registry = await ethers.deployContract("VoterRegistry", [admin.address]);
    await Registry.waitForDeployment();
    await Registry.registerVoter(voter.address);

    // Deploy ballot directly (simulate Election factory)
    const start = Math.floor(Date.now() / 1000) - 10;
    const end = start + 3600;
    const Ballot = await ethers.deployContract("Ballot", [await Registry.getAddress(), 1, "LocalBallot", start, end]);
    await Ballot.waitForDeployment();

    // Add candidate
    await Ballot.addCandidate("Candidate A");

    // Vote as registered voter
    const BallotVoter = Ballot.connect(voter);
    await BallotVoter.vote(1);
    expect(await Ballot.hasAddressVoted(voter.address)).to.equal(true);

    // second vote should revert
    await expect(BallotVoter.vote(1)).to.be.reverted;
  });
});