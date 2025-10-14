import { expect } from "chai";
import { ethers } from "hardhat";

describe("VoterRegistry", function () {
  it("registers and deregisters voters correctly", async function () {
    const [admin, user] = await ethers.getSigners();
    const Registry = await ethers.deployContract("VoterRegistry", [admin.address]);
    await Registry.waitForDeployment();

    await Registry.registerVoter(user.address);
    expect(await Registry.isRegistered(user.address)).to.equal(true);

    await Registry.deregisterVoter(user.address);
    expect(await Registry.isRegistered(user.address)).to.equal(false);
  });
});