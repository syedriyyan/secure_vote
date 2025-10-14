const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // your deployed address
  const Voting = await ethers.getContractFactory("Voting");
  const voting = Voting.attach(contractAddress);

  console.log("✅ Connected to contract at:", contractAddress);

  // 1️⃣ Create election (title, description, startTime, endTime)
  const now = Math.floor(Date.now() / 1000);
  const startTime = now;
  const endTime = now + 3600; // 1 hour from now

  const createTx = await voting.createElection(
    "Test Election",
    "A test election",
    startTime,
    endTime
  );
  await createTx.wait();
  console.log("🗳️ Election created successfully.");

  // 2️⃣ Add candidates
  const addAliceTx = await voting.addCandidate(1, "Alice");
  await addAliceTx.wait();
  console.log("👤 Added candidate: Alice");

  const addBobTx = await voting.addCandidate(1, "Bob");
  await addBobTx.wait();
  console.log("� Added candidate: Bob");

  // 3️⃣ Get candidate info
  const aliceInfo = await voting.getCandidate(1, 1);
  console.log("📋 Alice info:", {
    name: aliceInfo[0],
    votes: aliceInfo[1].toString(),
  });

  // 4️⃣ Cast a vote for candidate 1 (Alice)
  const voteTx = await voting.vote(1, 1);
  await voteTx.wait();
  console.log("🗳️ Vote casted for Alice!");

  // 5️⃣ Check updated votes for Alice
  const updatedAliceInfo = await voting.getCandidate(1, 1);
  console.log("📊 Updated Alice votes:", updatedAliceInfo[1].toString());
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
