const express = require("express");
const cors = require("cors");
const path = require("path");
const Web3 = require("web3");
const contractABI = require("../build/contracts/Voting.json"); // Adjust path if needed
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "../public")));

// Connect to Ganache (ensure Ganache is running on port 7545)
const web3 = new Web3("HTTP://127.0.0.1:7545");

// Get contract address and admin account from environment variables (.env)
const contractAddress = process.env.CONTRACT_ADDRESS;
const adminAccount = process.env.ADMIN_ACCOUNT;

// Create contract instance
const votingContract = new web3.eth.Contract(contractABI.abi, contractAddress);

/**
 * Endpoint to add a candidate.
 */
app.post("/addCandidate", async (req, res) => {
  const { candidateName } = req.body;
  
  if (!candidateName) {
    return res.status(400).send({ success: false, message: "Candidate name is required." });
  }

  try {
    const gasEstimate = await votingContract.methods.addCandidate(candidateName)
      .estimateGas({ from: adminAccount });

    await votingContract.methods.addCandidate(candidateName)
      .send({ from: adminAccount, gas: gasEstimate + 10000 });

    res.send({ success: true, message: `Candidate "${candidateName}" added successfully!` });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

/**
 * Endpoint to remove a candidate.
 */
app.post("/removeCandidate", async (req, res) => {
  const { candidateId } = req.body;

  if (candidateId == null) {
    return res.status(400).send({ success: false, message: "Candidate ID is required." });
  }

  try {
    const gasEstimate = await votingContract.methods.removeCandidate(candidateId)
      .estimateGas({ from: adminAccount });

    await votingContract.methods.removeCandidate(candidateId)
      .send({ from: adminAccount, gas: gasEstimate + 10000 });

    res.send({ success: true, message: `Candidate with ID ${candidateId} removed successfully!` });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

/**
 * Endpoint to vote for a candidate.
 */
app.post("/vote", async (req, res) => {
  const { voterAddress, candidateId } = req.body;

  if (!voterAddress || candidateId == null) {
    return res.status(400).send({ success: false, message: "Voter address and candidate ID are required." });
  }

  try {
    const gasEstimate = await votingContract.methods.vote(candidateId)
      .estimateGas({ from: voterAddress });

    await votingContract.methods.vote(candidateId)
      .send({ from: voterAddress, gas: gasEstimate + 10000 });

    res.send({ success: true, message: "Vote cast successfully!" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

/**
 * Endpoint to fetch all candidates.
 */
app.get("/candidates", async (req, res) => {
  try {
    const count = await votingContract.methods.getTotalCandidates().call();
    let candidates = [];

    console.log(`Total Candidates in contract: ${count}`); // Debugging log

    for (let i = 1; i <= count; i++) {
      let candidate = await votingContract.methods.getCandidate(i).call();

      console.log(`Candidate ${i}:`, candidate); // Debugging log

      // Ensure only existing candidates are added
      if (candidate[3]) {
        candidates.push({
          id: candidate[0].toString(),   // Convert BN to string
          name: candidate[1],
          votes: candidate[2].toString() // Convert BN to string
        });
      }
    }

    res.json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ message: error.message });
  }
});

// Start the server on port 3000
app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000 and accessible on local network");
});
