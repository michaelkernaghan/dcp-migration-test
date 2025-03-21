// MongoDB query script for DCP migration testing
// Usage: mongosh mongodb://dcp:dcp@localhost:27017/dcp account-migration-mongo-queries.js

// Connect to the appropriate database
db = db.getSiblingDB('dcp');

// Define test accounts Tezos addresses
const testAccounts = [
  {
    name: "Kanley Stubrick",
    tezosAddress: "tz1XTbJrMGHan4vEYmE7xpCKExBi3oDYYmPI3",
    expectedInternalBalance: 55.88,
    expectedExternalBalance: 684.61,
    expectedReputation: 40.4
  },
  {
    name: "Herner werzog",
    tezosAddress: "tz2HYEVENZnJxtzXChvZxSwQaSVnJDSN",
    expectedInternalBalance: 0.98,
    expectedExternalBalance: 6.06,
    expectedReputation: 0
  },
  {
    name: "TwitterProd",
    tezosAddress: "tz2GYLLxLJQqyaYmE1qVkLppEKfKRK4q52gf",
    expectedInternalBalance: 2.39,
    expectedExternalBalance: 0,
    expectedReputation: 0
  },
  {
    name: "Keith Fellini",
    tezosAddress: "tz1YX9mD4pdrz4vYpyE9dMMkJJaWFX6qa9Qs", 
    expectedInternalBalance: 3080.69,
    expectedExternalBalance: 194.9,
    expectedReputation: 0
  }
];

// Function to format values nicely
function formatValue(value) {
  return typeof value === 'number' ? value.toFixed(2) : value || 'null';
}

// Function to determine if a value matches expectations (with tolerance for floating point)
function matchesExpected(actual, expected) {
  if (actual === null || expected === null) return false;
  if (typeof actual === 'number' && typeof expected === 'number') {
    // Use a small tolerance for floating point comparison
    return Math.abs(actual - expected) < 0.001;
  }
  return actual === expected;
}

// Print header
print("\n=================================================================");
print("DCP MIGRATION ACCOUNT TRACKER");
print("=================================================================");
print(`Query time: ${new Date().toISOString()}`);
print("=================================================================\n");

// Process each account
let migrationStatus = [];

testAccounts.forEach(account => {
  print(`\n>> Checking account: ${account.name} (${account.tezosAddress})`);
  print("------------------------------------------------------------------");
  
  // Query MongoDB for this account
  const result = db.user_migrations.findOne({ tezosAddress: account.tezosAddress });
  
  if (!result) {
    print(`❌ NO RECORD FOUND for ${account.name}`);
    migrationStatus.push({
      name: account.name,
      status: "NOT_FOUND",
      verified: false
    });
    return;
  }
  
  // Output account details
  print(`📝 MongoDB ID: ${result._id}`);
  print(`🔑 Tezos Address: ${result.tezosAddress}`);
  print(`🔑 EVM Address: ${result.evmAddress || 'Not assigned'}`);
  
  // Check balances
  print(`\n📊 Balance Verification:`);
  
  const internalMatch = matchesExpected(result.internalBalance, account.expectedInternalBalance);
  print(`   Internal Balance: ${formatValue(result.internalBalance)} ${internalMatch ? '✅' : '❌'} (Expected: ${formatValue(account.expectedInternalBalance)})`);
  
  const externalMatch = matchesExpected(result.externalBalance, account.expectedExternalBalance);
  print(`   External Balance: ${formatValue(result.externalBalance)} ${externalMatch ? '✅' : '❌'} (Expected: ${formatValue(account.expectedExternalBalance)})`);
  
  const reputationMatch = matchesExpected(result.reputation, account.expectedReputation);
  print(`   Reputation: ${formatValue(result.reputation)} ${reputationMatch ? '✅' : '❌'} (Expected: ${formatValue(account.expectedReputation)})`);
  
  // Check migration status
  print(`\n🚀 Migration Status:`);
  
  const hasEvmAddress = result.evmAddress && result.evmAddress !== 'To be assigned';
  print(`   EVM Address Assigned: ${hasEvmAddress ? '✅ Yes' : '❌ No'}`);
  
  const isVerified = internalMatch && externalMatch && reputationMatch && hasEvmAddress;
  print(`   Overall Verification: ${isVerified ? '✅ PASSED' : '❌ FAILED'}`);
  
  migrationStatus.push({
    name: account.name,
    status: hasEvmAddress ? "MIGRATED" : "PENDING",
    verified: isVerified,
    evmAddress: result.evmAddress
  });
});

// Print summary
print("\n=================================================================");
print("MIGRATION SUMMARY");
print("=================================================================");

let totalSuccess = 0;

migrationStatus.forEach(status => {
  if (status.verified) totalSuccess++;
  print(`${status.name}: ${status.status} - ${status.verified ? '✅ VERIFIED' : '❌ VERIFICATION FAILED'}`);
});

const successRate = (totalSuccess / migrationStatus.length) * 100;
print(`\nOverall Migration Progress: ${successRate.toFixed(2)}% (${totalSuccess}/${migrationStatus.length} accounts verified)\n`);

// Export EVM addresses for the blockchain verification script
print("\n=================================================================");
print("EVM ADDRESSES FOR BLOCKCHAIN VERIFICATION");
print("=================================================================");
print("Copy these addresses to check token balances on the blockchain:\n");

migrationStatus.forEach(status => {
  if (status.evmAddress) {
    print(`${status.name}: ${status.evmAddress}`);
  }
});

print("\n=================================================================");
print("HELPFUL QUERIES");
print("=================================================================");
print("To check all migrations:");
print("db.user_migrations.find({}).pretty()\n");

print("To check specific Tezos address:");
print("db.user_migrations.find({tezosAddress: \"tz1XTbJrMGHan4vEYmE7xpCKExBi3oDYYmPI3\"}).pretty()\n");

print("To check specific EVM address:");
print("db.user_migrations.find({evmAddress: \"0x...\"}).pretty()\n");

print("To count total migrated accounts:");
print("db.user_migrations.countDocuments({evmAddress: {$exists: true, $ne: null}})\n");

print("To find accounts with verification issues:");
print("db.user_migrations.find({$or: [{internalBalance: null}, {externalBalance: null}, {reputation: null}]}).pretty()\n"); 