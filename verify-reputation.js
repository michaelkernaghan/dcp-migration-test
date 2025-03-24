// Node.js script to directly verify Kanley's reputation on Base L3
// This performs independent verification by querying the blockchain directly

// Install dependencies before running:
// npm install web3 ethers

const Web3 = require('web3');
const ethers = require('ethers');

// Contract addresses
const FILM_LEDGER_ADDRESS = '0xf31b1860d20Bc1CaBCB16B9F08F8783B0eb4a59d';
const EXTERNAL_BALANCE_ADDRESS = '0xE4D297078f8678b6C9c746A3485409F2c011c156';
const FILM_CREW_NFTS_ADDRESS = '0xdC3E83b88762B6FF14f4a938052652FDCa8eBeB0';
const RPC_URL = 'https://talntnet-auth-rpc-testnet.appchain.base.org/9nc0Apdn7t9DpsgQfglk3Go2';

// Kanley's addresses
const KANLEY_TEZOS_ADDRESS = 'tz1XTbJrMGHan4vEYmE7xpCKExBi3oDYYmPI3';
const KANLEY_BASE_ADDRESS = '0x7A23608a8eBe71868013BDA0d900351A83bb4Dc2';
const EXPECTED_REPUTATION = 40.4;

// ABI fragments for the functions we need
const filmLedgerABI = [
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "isRegistered",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "getReputation",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const externalBalanceABI = [
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "getClaimableBalance",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const filmCrewNFTsABI = [
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

async function verifyReputation() {
  console.log('\nIndependent Verification of Kanley\'s Reputation Migration\n');
  console.log('===========================================================');
  console.log('This script directly queries the Base L3 blockchain contracts');
  console.log('to independently verify Kanley\'s reputation score migration.\n');

  console.log('Contract Addresses:');
  console.log(`- Film Ledger: ${FILM_LEDGER_ADDRESS}`);
  console.log(`- External Balance Cutover: ${EXTERNAL_BALANCE_ADDRESS}`);
  console.log(`- Film Crew NFTs: ${FILM_CREW_NFTS_ADDRESS}`);
  console.log(`- RPC URL: ${RPC_URL}\n`);

  console.log('Kanley Account Details:');
  console.log(`- Tezos Address: ${KANLEY_TEZOS_ADDRESS}`);
  console.log(`- Base Address: ${KANLEY_BASE_ADDRESS}`);
  console.log(`- Expected Reputation: ${EXPECTED_REPUTATION}\n`);

  try {
    // Initialize web3 with the specified RPC URL
    const web3 = new Web3(RPC_URL);
    
    // Initialize contract instances
    const filmLedger = new web3.eth.Contract(filmLedgerABI, FILM_LEDGER_ADDRESS);
    const externalBalance = new web3.eth.Contract(externalBalanceABI, EXTERNAL_BALANCE_ADDRESS);
    const filmCrewNFTs = new web3.eth.Contract(filmCrewNFTsABI, FILM_CREW_NFTS_ADDRESS);
    
    console.log('Verification Results:');
    console.log('===========================================================');
    
    // 1. Check if Kanley's address is registered
    console.log('1. Checking if Kanley\'s address is registered in the FilmLedger contract...');
    let isRegistered = false;
    try {
      isRegistered = await filmLedger.methods.isRegistered(KANLEY_BASE_ADDRESS).call();
      console.log(`   ${isRegistered ? '✓' : '✗'} Address is ${isRegistered ? '' : 'NOT '}registered: ${isRegistered}`);
    } catch (error) {
      console.log(`   ✗ Error querying isRegistered: ${error.message}`);
    }
    
    // 2. Query Kanley's reputation
    console.log('\n2. Querying Kanley\'s reputation directly from the contract...');
    let reputationMatch = false;
    try {
      const reputation = await filmLedger.methods.getReputation(KANLEY_BASE_ADDRESS).call();
      // Convert to a float with 1 decimal place (assuming reputation is stored as integer * 10)
      const reputationFloat = parseFloat(reputation) / 10;
      reputationMatch = reputationFloat === EXPECTED_REPUTATION;
      console.log(`   ${reputationMatch ? '✓' : '✗'} Reputation ${reputationMatch ? 'matches' : 'does NOT match'}: ${reputationFloat} (Expected: ${EXPECTED_REPUTATION})`);
      console.log(`   Raw value: ${reputation}`);
      console.log(`   Hex value: 0x${Number(reputation).toString(16).padStart(64, '0')}`);
    } catch (error) {
      console.log(`   ✗ Error querying reputation: ${error.message}`);
    }
    
    // 3. Check Kanley's token balance
    console.log('\n3. Checking Kanley\'s token balance for verification...');
    try {
      const balance = await filmLedger.methods.balanceOf(KANLEY_BASE_ADDRESS).call();
      const balanceEth = web3.utils.fromWei(balance, 'ether');
      console.log(`   TALNT Token Balance: ${balanceEth}`);
      console.log(`   Raw value: ${balance}`);
      console.log(`   Hex value: 0x${Number(balance).toString(16).padStart(64, '0')}`);
    } catch (error) {
      console.log(`   ✗ Error querying balance: ${error.message}`);
    }
    
    // 4. Check external balance
    console.log('\n4. Checking external balance migration status...');
    try {
      const extBalance = await externalBalance.methods.getClaimableBalance(KANLEY_BASE_ADDRESS).call();
      console.log(`   External Balance Info: ${extBalance}`);
    } catch (error) {
      console.log(`   ✗ Error querying external balance: ${error.message}`);
    }
    
    // 5. Check Film Crew NFTs
    console.log('\n5. Checking if Kanley has any Film Crew NFTs (moderator credentials)...');
    try {
      const nftBalance = await filmCrewNFTs.methods.balanceOf(KANLEY_BASE_ADDRESS).call();
      console.log(`   ${parseInt(nftBalance) > 0 ? '✓' : ''} Moderator NFTs: ${nftBalance}`);
    } catch (error) {
      console.log(`   ✗ Error querying NFT balance: ${error.message}`);
    }
    
    // Overall verification summary
    console.log('\nVerification Summary:');
    console.log('===========================================================');
    if (isRegistered && reputationMatch) {
      console.log('✓ VERIFICATION SUCCESSFUL');
      console.log(`Kanley\'s reputation score of ${EXPECTED_REPUTATION} has been independently verified`);
      console.log('on the Base L3 blockchain without relying on dashboard data.');
    } else {
      console.log('✗ VERIFICATION FAILED');
      console.log('One or more checks failed during independent verification.');
    }
    
  } catch (error) {
    console.error(`Failed to connect to blockchain: ${error.message}`);
    console.log('\nIf you\'re seeing connection issues, you can try these direct JSON-RPC calls:');
    
    // Provide curl examples for manual verification
    console.log('\nUsing curl for direct verification:');
    console.log('===========================================================');
    
    const isRegisteredData = {
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [{
        to: FILM_LEDGER_ADDRESS,
        data: `0x${getMethodSignature('isRegistered(address)')}${KANLEY_BASE_ADDRESS.substring(2).padStart(64, '0')}`
      }, 'latest'],
      id: 1
    };
    
    const getReputationData = {
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [{
        to: FILM_LEDGER_ADDRESS,
        data: `0x${getMethodSignature('getReputation(address)')}${KANLEY_BASE_ADDRESS.substring(2).padStart(64, '0')}`
      }, 'latest'],
      id: 2
    };
    
    console.log('1. Check if registered:');
    console.log(`curl -X POST -H "Content-Type: application/json" --data '${JSON.stringify(isRegisteredData)}' ${RPC_URL}`);
    
    console.log('\n2. Get reputation:');
    console.log(`curl -X POST -H "Content-Type: application/json" --data '${JSON.stringify(getReputationData)}' ${RPC_URL}`);
    
    console.log('\nHow to interpret results:');
    console.log('- For isRegistered: 0x0000000000000000000000000000000000000000000000000000000000000001 means true');
    console.log('- For reputation: Convert hex to decimal and divide by 10 to get 40.4');
  }
}

// Helper function to get method signature
function getMethodSignature(methodSignature) {
  return ethers.utils.id(methodSignature).substring(0, 10).substring(2);
}

// Run the verification
verifyReputation().catch(console.error); 