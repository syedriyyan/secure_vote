const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting Contract", function () {
  let Voting, voting, owner, addr1, addr2;

  beforeEach(async function () {
    Voting = await ethers.getContractFactory("Voting");
    [owner, addr1, addr2] = await ethers.getSigners();
    voting = await Voting.deploy();
    await voting.waitForDeployment();
  });

  it("Should deploy successfully", async function () {
    expect(await voting.getAddress()).to.properAddress;
  });

  it("Should create a new election", async function () {
    const now = Math.floor(Date.now() / 1000);
    const startTime = now;
    const endTime = now + 3600; // 1 hour from now

    await voting.createElection(
      "Presidential Election",
      "Test election",
      startTime,
      endTime
    );

    // Check election count increased
    expect(await voting.electionCount()).to.equal(1);
  });

  it("Should allow admin to add candidates", async function () {
    const now = Math.floor(Date.now() / 1000);
    await voting.createElection("Election", "Test", now, now + 3600);

    await voting.addCandidate(1, "Alice");
    await voting.addCandidate(1, "Bob");

    const aliceInfo = await voting.getCandidate(1, 1);
    expect(aliceInfo[0]).to.equal("Alice"); // name
    expect(aliceInfo[1]).to.equal(0n); // initial vote count
  });

  it("Should allow a user to vote", async function () {
    const now = Math.floor(Date.now() / 1000);
    await voting.createElection("Election", "Test", now, now + 3600);
    await voting.addCandidate(1, "Alice");
    await voting.addCandidate(1, "Bob");

    await voting.vote(1, 1); // vote for Alice (candidate 1)

    const aliceInfo = await voting.getCandidate(1, 1);
    expect(aliceInfo[1]).to.equal(1n); // vote count should be 1
  });

  it("Should not allow double voting", async function () {
    const now = Math.floor(Date.now() / 1000);
    await voting.createElection("Election", "Test", now, now + 3600);
    await voting.addCandidate(1, "Alice");
    await voting.addCandidate(1, "Bob");

    await voting.vote(1, 1); // first vote
    await expect(voting.vote(1, 2)).to.be.revertedWith("Already voted");
  });

  it("Should not allow voting on invalid election", async function () {
    await expect(voting.vote(999, 1)).to.be.revertedWith("Invalid election");
  });

  it("Should not allow voting on invalid candidate", async function () {
    const now = Math.floor(Date.now() / 1000);
    await voting.createElection("Election", "Test", now, now + 3600);
    await voting.addCandidate(1, "Alice");

    await expect(voting.vote(1, 999)).to.be.revertedWith("Invalid candidate");
  });

  it("Should not allow voting outside time window", async function () {
    const now = Math.floor(Date.now() / 1000);
    const pastTime = now - 3600; // 1 hour ago
    await voting.createElection("Election", "Test", pastTime, pastTime + 1800); // ended 30 min ago
    await voting.addCandidate(1, "Alice");

    await expect(voting.vote(1, 1)).to.be.revertedWith("Voting not active");
  });

  it("Should only allow admin to add candidates", async function () {
    const now = Math.floor(Date.now() / 1000);
    await voting.createElection("Election", "Test", now, now + 3600);

    // Try to add candidate from different address (not admin)
    await expect(
      voting.connect(addr1).addCandidate(1, "Alice")
    ).to.be.revertedWith("Not admin");
  });
});
