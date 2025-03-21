#!/bin/bash
# DCP Migration Account Tracer Script
# This script helps trace test accounts from Tezos to Base L3 through the migration process

# Text formatting
BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Load environment variables from .env file if present
if [ -f .env ]; then
    echo -e "${BLUE}Loading environment variables from .env file...${NC}"
    export $(grep -v '^#' .env | xargs)
else
    echo -e "${RED}Warning: .env file not found. Please set required environment variables manually.${NC}"
    echo "Required variables: DB_CONN_STRING, EVM_FILM_LEDGER_ADDRESS, APPCHAIN_RPC"
    exit 1
fi

# Default values if not set in .env
MONGODB_URI=${DB_CONN_STRING:-"mongodb://dcp:dcp@localhost:27017/dcp?authMechanism=DEFAULT"}
FILM_LEDGER_ADDRESS=${EVM_FILM_LEDGER_ADDRESS}
RPC_URL=${APPCHAIN_RPC:-"https://talntnet-auth-rpc-testnet.appchain.base.org/9nc0Apdn7t9DpsgQfglk3Go2"}

# Check if required variables are set
if [ -z "$FILM_LEDGER_ADDRESS" ]; then
    echo -e "${RED}Error: EVM_FILM_LEDGER_ADDRESS not set. Please deploy the Film Ledger contract and update .env file.${NC}"
    FILM_LEDGER_ADDRESS="NOT_DEPLOYED_YET"
    echo -e "${YELLOW}Continuing without token balance checks...${NC}"
fi

echo -e "${BOLD}DCP Migration Account Tracer${NC}"
echo "==========================================="
echo -e "MongoDB URI: ${BLUE}$MONGODB_URI${NC}"
echo -e "Film Ledger Contract: ${BLUE}$FILM_LEDGER_ADDRESS${NC}"
echo -e "RPC URL: ${BLUE}$RPC_URL${NC}"
echo "==========================================="

# Declare test accounts array with their details
declare -A ACCOUNTS
ACCOUNTS["Kanley Stubrick"]="tz1XTbJrMGHan4vEYmE7xpCKExBi3oDYYmPI3|55.88|684.61|40.4"
ACCOUNTS["Herner werzog"]="tz2HYEVENZnJxtzXChvZxSwQaSVnJDSN|0.98|6.06|0"
ACCOUNTS["TwitterProd"]="tz2GYLLxLJQqyaYmE1qVkLppEKfKRK4q52gf|2.39|0|0"
ACCOUNTS["Keith Fellini"]="tz1YX9mD4pdrz4vYpyE9dMMkJJaWFX6qa9Qs|3080.69|194.9|0"

# Create results directory
RESULTS_DIR="migration_results"
mkdir -p $RESULTS_DIR
SUMMARY_FILE="$RESULTS_DIR/migration_summary.txt"
echo "Migration Tracking Summary - $(date)" > $SUMMARY_FILE
echo "==========================================" >> $SUMMARY_FILE

# Function to check MongoDB for account details
check_mongodb() {
    local account_name=$1
    local tezos_address=$2
    local expected_internal=$3
    local expected_external=$4
    local expected_reputation=$5
    
    echo -e "\n${BOLD}Checking MongoDB for ${GREEN}$account_name${NC} (Tezos: ${BLUE}$tezos_address${NC})${NC}"
    
    # MongoDB query to find user by Tezos address
    MONGO_RESULT_FILE="$RESULTS_DIR/${account_name// /_}_mongo.json"
    mongosh --quiet "$MONGODB_URI" --eval "db.user_migrations.find({tezosAddress: \"$tezos_address\"}).pretty()" > $MONGO_RESULT_FILE
    
    # Check if record exists
    if grep -q "null" $MONGO_RESULT_FILE || [ ! -s $MONGO_RESULT_FILE ]; then
        echo -e "${RED}No MongoDB record found for $account_name${NC}"
        echo "$account_name: NO_RECORD_FOUND" >> $SUMMARY_FILE
        return 1
    fi
    
    # Extract MongoDB ID and EVM address
    MONGO_ID=$(grep "_id" $MONGO_RESULT_FILE | head -1 | awk -F'"' '{print $4}')
    EVM_ADDRESS=$(grep "evmAddress" $MONGO_RESULT_FILE | head -1 | awk -F'"' '{print $4}')
    
    # Extract balances
    INTERNAL_BALANCE=$(grep "internalBalance" $MONGO_RESULT_FILE | head -1 | awk -F': ' '{print $2}' | tr -d ',')
    EXTERNAL_BALANCE=$(grep "externalBalance" $MONGO_RESULT_FILE | head -1 | awk -F': ' '{print $2}' | tr -d ',')
    REPUTATION=$(grep "reputation" $MONGO_RESULT_FILE | head -1 | awk -F': ' '{print $2}' | tr -d ',')
    
    echo -e "MongoDB ID: ${BLUE}$MONGO_ID${NC}"
    echo -e "EVM Address: ${BLUE}$EVM_ADDRESS${NC}"
    echo -e "Internal Balance: ${YELLOW}$INTERNAL_BALANCE${NC} (Expected: $expected_internal)"
    echo -e "External Balance: ${YELLOW}$EXTERNAL_BALANCE${NC} (Expected: $expected_external)"
    echo -e "Reputation: ${YELLOW}$REPUTATION${NC} (Expected: $expected_reputation)"
    
    # Add to summary
    echo "$account_name: MONGO_ID=$MONGO_ID, EVM=$EVM_ADDRESS, Internal=$INTERNAL_BALANCE, External=$EXTERNAL_BALANCE, Rep=$REPUTATION" >> $SUMMARY_FILE
    
    # Return the EVM address for further checks
    echo $EVM_ADDRESS
}

# Function to check balance on Base L3
check_base_balance() {
    local account_name=$1
    local evm_address=$2
    
    if [ -z "$evm_address" ] || [ "$evm_address" == "null" ] || [ "$evm_address" == "To be assigned" ]; then
        echo -e "${RED}No EVM address assigned yet for $account_name${NC}"
        return 1
    fi
    
    echo -e "\n${BOLD}Checking Base L3 balances for ${GREEN}$account_name${NC} (EVM: ${BLUE}$evm_address${NC})${NC}"
    
    # Check native token balance
    if command -v cast &> /dev/null; then
        NATIVE_BALANCE=$(cast balance $evm_address --rpc-url $RPC_URL 2>/dev/null || echo "ERROR")
        echo -e "Native ETH Balance: ${YELLOW}$NATIVE_BALANCE${NC}"
        
        # Check TALNT token balance if contract is deployed
        if [ "$FILM_LEDGER_ADDRESS" != "NOT_DEPLOYED_YET" ]; then
            TOKEN_BALANCE=$(cast call $FILM_LEDGER_ADDRESS "balanceOf(address)" $evm_address --rpc-url $RPC_URL 2>/dev/null || echo "ERROR")
            echo -e "TALNT Token Balance: ${YELLOW}$TOKEN_BALANCE${NC}"
            echo "$account_name: BASE_BALANCE=$NATIVE_BALANCE, TOKEN_BALANCE=$TOKEN_BALANCE" >> $SUMMARY_FILE
        else
            echo -e "${YELLOW}Skipping token balance check - contract not deployed${NC}"
            echo "$account_name: BASE_BALANCE=$NATIVE_BALANCE, TOKEN_BALANCE=NOT_CHECKED" >> $SUMMARY_FILE
        fi
    else
        echo -e "${RED}cast command not found. Install foundry to check blockchain balances.${NC}"
        echo "$account_name: BALANCE_CHECK_SKIPPED (cast not found)" >> $SUMMARY_FILE
    fi
}

# Function to verify migration status
verify_migration() {
    local account_name=$1
    local evm_address=$2
    local expected_internal=$3
    local expected_external=$4
    local expected_reputation=$5
    
    echo -e "\n${BOLD}Verifying migration for ${GREEN}$account_name${NC}${NC}"
    
    # Verification logic would vary based on your specific requirements
    # For this example, we'll mock a basic verification
    
    # Check if EVM address is assigned
    if [ -z "$evm_address" ] || [ "$evm_address" == "null" ] || [ "$evm_address" == "To be assigned" ]; then
        echo -e "${RED}⨯ Migration Incomplete: No EVM address assigned${NC}"
        echo "$account_name: MIGRATION_STATUS=INCOMPLETE (No EVM address)" >> $SUMMARY_FILE
        return 1
    fi
    
    # In a real implementation, you would:
    # 1. Check if token balances match expected amounts
    # 2. Verify contract state contains correct mappings
    # 3. Test authentication and access
    
    echo -e "${GREEN}✓ Basic verification passed - EVM address assigned${NC}"
    echo -e "${YELLOW}Note: Full verification requires manual testing of authentication and user interface${NC}"
    echo "$account_name: MIGRATION_STATUS=BASIC_VERIFICATION_PASSED" >> $SUMMARY_FILE
}

# Function to trace a single account through the migration process
trace_account() {
    local account_name=$1
    local account_info=$2
    
    # Parse account info
    IFS='|' read -r tezos_address expected_internal expected_external expected_reputation <<< "$account_info"
    
    echo -e "\n${BOLD}===========================================${NC}"
    echo -e "${BOLD}Tracing account: ${GREEN}$account_name${NC}${NC}"
    echo -e "${BOLD}===========================================${NC}"
    
    # Step 1: Check MongoDB for account details
    evm_address=$(check_mongodb "$account_name" "$tezos_address" "$expected_internal" "$expected_external" "$expected_reputation")
    
    # Step 2: Check Base L3 for balances
    check_base_balance "$account_name" "$evm_address"
    
    # Step 3: Verify migration status
    verify_migration "$account_name" "$evm_address" "$expected_internal" "$expected_external" "$expected_reputation"
}

# Main execution
echo -e "\n${BOLD}Starting account migration tracing...${NC}"

# Process each account
for account_name in "${!ACCOUNTS[@]}"; do
    trace_account "$account_name" "${ACCOUNTS[$account_name]}"
done

echo -e "\n${BOLD}Account tracing complete.${NC}"
echo -e "Detailed results saved to: ${GREEN}$RESULTS_DIR${NC}"
echo -e "Summary file: ${GREEN}$SUMMARY_FILE${NC}"

# Print MongoDB query cheat sheet
echo -e "\n${BOLD}MongoDB Query Cheat Sheet:${NC}"
echo -e "${BLUE}# Find all migrated accounts${NC}"
echo "mongosh \"$MONGODB_URI\" --eval 'db.user_migrations.find({}).pretty()'"
echo -e "${BLUE}# Check specific Tezos address${NC}"
echo "mongosh \"$MONGODB_URI\" --eval 'db.user_migrations.find({tezosAddress: \"tz1XTbJrMGHan4vEYmE7xpCKExBi3oDYYmPI3\"}).pretty()'"
echo -e "${BLUE}# Check specific EVM address${NC}"
echo "mongosh \"$MONGODB_URI\" --eval 'db.user_migrations.find({evmAddress: \"0x...\"}).pretty()'"

# Print contract interaction cheat sheet
echo -e "\n${BOLD}Contract Interaction Cheat Sheet:${NC}"
echo -e "${BLUE}# Check TALNT token balance${NC}"
echo "cast call $FILM_LEDGER_ADDRESS \"balanceOf(address)\" \"0x...\" --rpc-url $RPC_URL"

echo -e "\n${GREEN}Happy migration testing!${NC}" 