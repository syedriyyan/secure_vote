const hre = require("hardhat");

async function main() {
  console.log("Testing VotingSystem contract functions...");

  const [deployer, user1] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Deploy contract
  const VotingSystem = await hre.ethers.deployContract("VotingSystem");
  await VotingSystem.waitForDeployment();
  console.log("VotingSystem deployed to:", VotingSystem.target);

  // Test admin functionality
  console.log("\n--- Testing Admin Functions ---");

  // Create an election
  const currentTime = Math.floor(Date.now() / 1000);
  const startTime = currentTime + 300; // 5 minutes from now
  const endTime = startTime + 3600; // 1 hour election

  console.log("Creating election...");
  const tx1 = await VotingSystem.createElection(
    "General Election 2024",
    startTime,
    endTime
  );
  await tx1.wait();

  // Check elections count
  const electionsCount = await VotingSystem.electionsCount();
  console.log("Elections count:", electionsCount.toString());

  // Add candidates
  console.log("Adding candidates...");
  const tx2 = await VotingSystem.addCandidate(1, "Alice Johnson");
  await tx2.wait();

  const tx3 = await VotingSystem.addCandidate(1, "Bob Smith");
  await tx3.wait();

  console.log("✅ Election created and candidates added successfully!");

  // Test access control
  console.log("\n--- Testing Access Control ---");
  try {
    const votingSystemAsUser = VotingSystem.connect(user1);
    await votingSystemAsUser.createElection(
      "Unauthorized Election",
      startTime,
      endTime
    );
    console.log("❌ Should have failed - non-admin created election");
  } catch (error) {
    console.log(
      "✅ Access control working - non-admin cannot create elections"
    );
  }

  console.log("\n🎉 VotingSystem contract test completed successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
