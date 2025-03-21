# DCP Migration Account Tracer

This set of tools helps you trace the four test accounts through the migration process from Tezos to Base L3, tracking their MongoDB entries, assigned ETH addresses, and final token balances.

## Test Accounts

| Name | Tezos Address | Internal Balance | External Balance | Reputation |
|------|---------------|------------------|------------------|------------|
| Kanley Stubrick | tz1XTbJrMGHan4vEYmE7xpCKExBi3oDYYmPI3 | 55.88 | 684.61 | 40.4 |
| Herner werzog | tz2HYEVENZnJxtzXChvZxSwQaSVnJDSN | 0.98 | 6.06 | 0 |
| TwitterProd | tz2GYLLxLJQqyaYmE1qVkLppEKfKRK4q52gf | 2.39 | 0 | 0 |
| Keith Fellini | tz1YX9mD4pdrz4vYpyE9dMMkJJaWFX6qa9Qs | 3080.69 | 194.9 | 0 |

## Tools Included

This package contains three main tools:

1. **account-migration-tracer.sh**: Bash script that checks MongoDB records, EVM addresses, and on-chain balances
2. **account-migration-mongo-queries.js**: MongoDB script for detailed querying of migration records
3. **check-talnt-balances.js**: Node.js script to check TALNT token balances on Base L3

## Prerequisites

- MongoDB CLI tools (`mongosh`)
- Foundry tools (`cast`) for blockchain interaction
- Node.js and npm (for the token balance checker)
- Access to MongoDB with migration data
- `.env` file with connection details (see below)

## Setup

1. Create a `.env` file with the following variables:

```bash
# MongoDB connection settings
DB_CONN_STRING="mongodb://dcp:dcp@localhost:27017/?authMechanism=DEFAULT"

# Contract addresses (after deployment)
EVM_FILM_LEDGER_ADDRESS="0x..." # The TALNT token contract address

# AppChain connection URL
APPCHAIN_RPC="https://talntnet-auth-rpc-testnet.appchain.base.org/9nc0Apdn7t9DpsgQfglk3Go2"
```

2. Install Node.js dependencies for the token balance checker:

```bash
npm install web3 dotenv
```

3. Make the bash script executable:

```bash
chmod +x account-migration-tracer.sh
```

## Usage

### 1. Full Migration Trace Using the Bash Script

Run the main tracing script:

```bash
./account-migration-tracer.sh
```

This script will:
- Check MongoDB for each test account's record
- Extract EVM addresses and confirm balances in the database
- Check on-chain balances using the `cast` command
- Generate a summary report in the `migration_results` directory

### 2. MongoDB Detailed Queries

Run the MongoDB query script:

```bash
mongosh mongodb://dcp:dcp@localhost:27017/dcp account-migration-mongo-queries.js
```

This script provides a detailed analysis of each account in MongoDB, including:
- Verification of existence in the database
- Balance and reputation checks against expected values
- Migration status summary
- List of EVM addresses for blockchain verification

### 3. TALNT Token Balance Check

If you know the EVM addresses of the migrated accounts, run:

```bash
node check-talnt-balances.js 0xAddress1 0xAddress2 0xAddress3 0xAddress4
```

Or, if you've already run the migration tracer script which generated MongoDB result files:

```bash
node check-talnt-balances.js
```

The script will:
- Connect to the Base L3 blockchain
- Check the TALNT token balance for each address
- Compare with expected values
- Generate a verification report

## Sample MongoDB Queries

```javascript
// Find a specific account by Tezos address
db.user_migrations.find({tezosAddress: "tz1XTbJrMGHan4vEYmE7xpCKExBi3oDYYmPI3"}).pretty()

// Find a specific account by EVM address
db.user_migrations.find({evmAddress: "0x..."}).pretty()

// Count all migrated accounts
db.user_migrations.countDocuments({evmAddress: {$exists: true, $ne: null}})

// Find accounts with verification issues
db.user_migrations.find({$or: [{internalBalance: null}, {externalBalance: null}, {reputation: null}]}).pretty()
```

## Sample Blockchain Queries

```bash
# Check ETH balance
cast balance 0x... --rpc-url https://talntnet-auth-rpc-testnet.appchain.base.org/9nc0Apdn7t9DpsgQfglk3Go2

# Check TALNT token balance
cast call $EVM_FILM_LEDGER_ADDRESS "balanceOf(address)" 0x... --rpc-url $APPCHAIN_RPC
```

## Understanding the Results

### Migration Status

The tools provide several indicators of migration status:

- **Record Found**: The account exists in MongoDB
- **EVM Address Assigned**: An Ethereum address has been assigned to the account
- **Balance Match**: The balances in MongoDB match expected values
- **On-Chain Verification**: The tokens are confirmed on the blockchain

### Expected Values

The expected values for each account are:

- **Kanley Stubrick**: 
  - Combined balance: 740.49 TALNT (55.88 internal + 684.61 external)
  - Reputation: 40.4

- **Herner werzog**: 
  - Combined balance: 7.04 TALNT (0.98 internal + 6.06 external)
  - Reputation: 0

- **TwitterProd**: 
  - Combined balance: 2.39 TALNT (2.39 internal + 0 external)
  - Reputation:.0

- **Keith Fellini**: 
  - Combined balance: 3275.59 TALNT (3080.69 internal + 194.9 external)
  - Reputation: 0

## Troubleshooting

### MongoDB Connection Issues

- Verify MongoDB is running: `sudo systemctl status mongod`
- Check connection string in .env file
- Ensure the `dcp` database exists with `user_migrations` collection

### Contract Interaction Errors

- Verify RPC URL is accessible
- Check that the Film Ledger contract address is correct
- Ensure Foundry's `cast` command is installed and working

### Missing EVM Addresses

If accounts don't have EVM addresses assigned:
- Migration may not be complete
- Check migration logs for errors
- Verify that contracts have been deployed

## More Information

For detailed information about the migration process, see the [setup guide](setup-guide.html). 