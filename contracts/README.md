```markdown
# secure_vote/contracts — Blockchain workspace

This folder contains smart contracts, scripts and tests for the SecureVote blockchain layer.

Quick start (inside contracts/):

1. Copy .env.example -> .env and fill RPC_URL and PRIVATE_KEY.
2. Install dependencies:
   bun install
   or
   npm install

3. Compile:
   npm run compile

4. Run local node:
   npm run node
   (in another terminal) npm run deploy:local

5. Deploy to Sepolia:
   npm run compile
   npm run deploy:sepolia

6. Run tests:
   npm run test

Outputs:
- artifacts/ — compiled artifacts
- typechain-types/ — TypeScript bindings for contracts

Notes:
- Contracts:
  - VoterRegistry.sol — admin-managed registry of voters
  - Ballot.sol — per-election ballot contract, enforces single vote and uses registry for permission
  - Election.sol — manager that deploys Ballot contracts and tracks elections
- Cryptography.sol is a placeholder for future zk work; real zk-verifier contracts are generated off-chain.
```