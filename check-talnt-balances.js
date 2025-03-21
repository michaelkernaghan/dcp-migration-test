/**
 * DCP Migration - TALNT Token Balance Checker
 * This script verifies token balances for migrated accounts on Base L3
 * 
 * Usage: 
 * 1. Install dependencies: npm install web3 dotenv
 * 2. Create .env file with APPCHAIN_RPC and EVM_FILM_LEDGER_ADDRESS
 * 3. Run: node check-talnt-balances.js [addresses...]
 */

// Import dependencies
const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Minimal ERC20 ABI - just what we need for balanceOf
const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "name": "", "type": "uint8" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{ "name": "", "type": "string" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "name": "", "type": "string" }],
    "type": "function"
  }
];

// Retrieve environment variables
const APPCHAIN_RPC = process.env.APPCHAIN_RPC || "https://talntnet-auth-rpc-testnet.appchain.base.org/9nc0Apdn7t9DpsgQfglk3Go2";
const TOKEN_ADDRESS = process.env.EVM_FILM_LEDGER_ADDRESS;

// Test accounts with expected balances
const testAccounts = [
  {
    name: "Kanley Stubrick",
    tezosAddress: "tz1XTbJrMGHan4vEYmE7xpCKExBi3oDYYmPI3",
    expectedTotal: 740.49,  // Internal + External balance
    evmAddress: null  // Will be populated from command line or mongodb results
  },
  {
    name: "Herner werzog",
    tezosAddress: "tz2HYEVENZnJxtzXChvZxSwQaSVnJDSN",
    expectedTotal: 7.04,  // Internal + External balance
    evmAddress: null
  },
  {
    name: "TwitterProd",
    tezosAddress: "tz2GYLLxLJQqyaYmE1qVkLppEKfKRK4q52gf",
    expectedTotal: 2.39,  // Internal + External balance
    evmAddress: null
  },
  {
    name: "Keith Fellini",
    tezosAddress: "tz1YX9mD4pdrz4vYpyE9dMMkJJaWFX6qa9Qs",
    expectedTotal: 3275.59,  // Internal + External balance
    evmAddress: null
  }
];

// Initialize Web3
const web3 = new Web3(new Web3.providers.HttpProvider(APPCHAIN_RPC));

// Read EVM addresses from command line
const addressArgs = process.argv.slice(2);

// Results directory
const RESULTS_DIR = path.join(__dirname, "migration_results");
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR);
}

const logFile = path.join(RESULTS_DIR, "talnt_balance_check.log");
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Helper to log to console and file
function log(message) {
  console.log(message);
  logStream.write(message + '\n');
}

// Check if we have the contract address
if (!TOKEN_ADDRESS) {
  log("Error: EVM_FILM_LEDGER_ADDRESS environment variable not set.");
  log("Please set the TALNT token contract address in your .env file.");
  log("Example: EVM_FILM_LEDGER_ADDRESS=0x123...");
  process.exit(1);
}

async function checkTokenBalance(tokenContract, address, name, expectedTotal) {
  try {
    // Get token metadata
    const tokenSymbol = await tokenContract.methods.symbol().call();
    const tokenDecimals = parseInt(await tokenContract.methods.decimals().call());
    
    // Get balance - this might fail if the address doesn't exist on chain
    const balanceWei = await tokenContract.methods.balanceOf(address).call();
    
    // Convert from token units to decimal representation
    const balance = balanceWei / Math.pow(10, tokenDecimals);
    
    // Check if it matches expected amount
    const isMatch = Math.abs(balance - expectedTotal) < 0.01; // 0.01 tolerance
    
    // Format output
    const statusSymbol = isMatch ? '✅' : '❌';
    log(`${name} (${address}): ${balance.toFixed(2)} ${tokenSymbol} ${statusSymbol} (Expected: ${expectedTotal.toFixed(2)})`);
    
    return { address, name, balance, expected: expectedTotal, isMatch };
  } catch (error) {
    log(`Error checking balance for ${name} (${address}): ${error.message}`);
    return { address, name, balance: null, expected: expectedTotal, isMatch: false, error: error.message };
  }
}

async function main() {
  log("\n==============================================================");
  log(`TALNT TOKEN BALANCE CHECK - ${new Date().toISOString()}`);
  log("==============================================================");
  log(`Using RPC: ${APPCHAIN_RPC}`);
  log(`Token Contract: ${TOKEN_ADDRESS}`);
  log("==============================================================\n");
  
  // Assign addresses from command line if provided
  if (addressArgs.length >= 1) {
    addressArgs.forEach((addr, index) => {
      if (index < testAccounts.length) {
        testAccounts[index].evmAddress = addr;
      }
    });
  }
  
  // Try to load from MongoDB result file if addresses not provided
  if (addressArgs.length === 0) {
    log("No addresses provided via command line, checking MongoDB result files...\n");
    
    testAccounts.forEach(account => {
      const mongoFile = path.join(RESULTS_DIR, `${account.name.replace(/ /g, '_')}_mongo.json`);
      try {
        if (fs.existsSync(mongoFile)) {
          const content = fs.readFileSync(mongoFile, 'utf8');
          const evmMatch = content.match(/"evmAddress"\s*:\s*"(0x[a-fA-F0-9]+)"/);
          if (evmMatch && evmMatch[1]) {
            account.evmAddress = evmMatch[1];
            log(`Loaded address for ${account.name}: ${account.evmAddress}`);
          }
        }
      } catch (err) {
        log(`Could not load address for ${account.name} from MongoDB results`);
      }
    });
  }
  
  // Initialize token contract
  const tokenContract = new web3.eth.Contract(ERC20_ABI, TOKEN_ADDRESS);
  
  log("\nChecking TALNT token balances...");
  log("--------------------------------------------------------------");
  
  const results = [];
  
  // Check each account with a known address
  for (const account of testAccounts) {
    if (account.evmAddress) {
      const result = await checkTokenBalance(
        tokenContract, 
        account.evmAddress, 
        account.name, 
        account.expectedTotal
      );
      results.push(result);
    } else {
      log(`${account.name}: No EVM address available`);
      results.push({ 
        address: null, 
        name: account.name, 
        balance: null, 
        expected: account.expectedTotal, 
        isMatch: false, 
        error: "No EVM address" 
      });
    }
  }
  
  // Summary
  log("\n==============================================================");
  log("BALANCE CHECK SUMMARY");
  log("==============================================================");
  
  const successCount = results.filter(r => r.isMatch).length;
  const total = results.length;
  const successRate = (successCount / total) * 100;
  
  log(`Accounts verified: ${successCount}/${total} (${successRate.toFixed(2)}%)`);
  log(`Verification completed at: ${new Date().toISOString()}`);
  log("==============================================================\n");
  
  // Close log file
  logStream.end();
}

// Run the main function
main().catch(error => {
  log(`\nFatal error: ${error.message}`);
  logStream.end();
  process.exit(1);
}); 