#!/bin/bash
# Independent Verification Script for Kanley's Reputation Migration
# This queries the actual smart contracts on Base L3 directly

# Text formatting
BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Contract addresses
FILM_LEDGER_ADDRESS="0xf31b1860d20Bc1CaBCB16B9F08F8783B0eb4a59d"
EXTERNAL_BALANCE_ADDRESS="0xE4D297078f8678b6C9c746A3485409F2c011c156" 
FILM_CREW_NFTS_ADDRESS="0xdC3E83b88762B6FF14f4a938052652FDCa8eBeB0"
RPC_URL="https://talntnet-auth-rpc-testnet.appchain.base.org/9nc0Apdn7t9DpsgQfglk3Go2"

# Kanley's addresses
KANLEY_TEZOS_ADDRESS="tz1XTbJrMGHan4vEYmE7xpCKExBi3oDYYmPI3"
KANLEY_BASE_ADDRESS="0x7A23608a8eBe71868013BDA0d900351A83bb4Dc2"
EXPECTED_REPUTATION=40.4

echo -e "\n${BOLD}Independent Verification of Kanley's Reputation Migration${NC}\n"
echo "==========================================================="
echo "This script will query the actual deployed contracts on Base L3"
echo "to independently verify Kanley's reputation score migration."
echo ""

echo -e "${BLUE}Contract Addresses:${NC}"
echo "- Film Ledger: $FILM_LEDGER_ADDRESS"
echo "- External Balance Cutover: $EXTERNAL_BALANCE_ADDRESS"
echo "- Film Crew NFTs: $FILM_CREW_NFTS_ADDRESS"
echo "- RPC URL: $RPC_URL"
echo ""

echo -e "${BLUE}Kanley Account Details:${NC}"
echo "- Tezos Address: $KANLEY_TEZOS_ADDRESS"
echo "- Base Address: $KANLEY_BASE_ADDRESS"
echo "- Expected Reputation: $EXPECTED_REPUTATION"
echo ""

# Check if cast is installed
if ! command -v cast &> /dev/null; then
    echo -e "${RED}Error: 'cast' command not found. Please install Foundry.${NC}"
    echo "Visit: https://book.getfoundry.sh/getting-started/installation"
    echo ""
    echo -e "${YELLOW}Since 'cast' is not available, here are the commands you should run:${NC}"
else
    echo -e "${GREEN}Found 'cast' command. Proceeding with direct blockchain verification...${NC}"
    echo ""
    
    echo -e "${BOLD}Verification Results:${NC}"
    echo "==========================================================="
    
    # Perform actual verification on the blockchain
    echo -e "1. Checking if Kanley's address is registered in the FilmLedger contract..."
    IS_REGISTERED=$(cast call $FILM_LEDGER_ADDRESS "isRegistered(address)" $KANLEY_BASE_ADDRESS --rpc-url $RPC_URL 2>/dev/null)
    if [ $? -eq 0 ]; then
        if [ "$IS_REGISTERED" = "0x0000000000000000000000000000000000000000000000000000000000000001" ]; then
            echo -e "   ${GREEN}✓ Address is registered: $IS_REGISTERED${NC}"
            REGISTERED=true
        else
            echo -e "   ${RED}✗ Address is NOT registered: $IS_REGISTERED${NC}"
            REGISTERED=false
        fi
    else
        echo -e "   ${RED}✗ Error querying contract${NC}"
        REGISTERED=false
    fi
    
    echo -e "\n2. Querying Kanley's reputation directly from the contract..."
    REPUTATION=$(cast call $FILM_LEDGER_ADDRESS "getReputation(address)" $KANLEY_BASE_ADDRESS --rpc-url $RPC_URL 2>/dev/null)
    if [ $? -eq 0 ]; then
        # Convert hex to decimal (assuming reputation is stored as an integer with implied decimal)
        REPUTATION_DEC=$(printf "%d" $REPUTATION)
        REPUTATION_FLOAT=$(echo "scale=1; $REPUTATION_DEC/10" | bc)
        if (( $(echo "$REPUTATION_FLOAT == $EXPECTED_REPUTATION" | bc -l) )); then
            echo -e "   ${GREEN}✓ Reputation matches expected value: $REPUTATION_FLOAT${NC}"
            REPUTATION_MATCH=true
        else
            echo -e "   ${RED}✗ Reputation does NOT match: $REPUTATION_FLOAT (Expected: $EXPECTED_REPUTATION)${NC}"
            REPUTATION_MATCH=false
        fi
        echo -e "   Hex value: $REPUTATION"
        echo -e "   Decimal value: $REPUTATION_DEC"
    else
        echo -e "   ${RED}✗ Error querying reputation${NC}"
        REPUTATION_MATCH=false
    fi
    
    echo -e "\n3. Checking Kanley's token balance for verification..."
    BALANCE=$(cast call $FILM_LEDGER_ADDRESS "balanceOf(address)" $KANLEY_BASE_ADDRESS --rpc-url $RPC_URL 2>/dev/null)
    if [ $? -eq 0 ]; then
        # Convert hex to decimal and format as token amount
        BALANCE_DEC=$(printf "%d" $BALANCE)
        BALANCE_FLOAT=$(echo "scale=2; $BALANCE_DEC/10^18" | bc)
        echo -e "   TALNT Token Balance: $BALANCE_FLOAT"
        echo -e "   Hex value: $BALANCE"
    else
        echo -e "   ${RED}✗ Error querying balance${NC}"
    fi
    
    echo -e "\n4. Checking external balance migration status..."
    EXT_BALANCE=$(cast call $EXTERNAL_BALANCE_ADDRESS "getClaimableBalance(address)" $KANLEY_BASE_ADDRESS --rpc-url $RPC_URL 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo -e "   External Balance Info: $EXT_BALANCE"
    else
        echo -e "   ${RED}✗ Error querying external balance${NC}"
    fi
    
    echo -e "\n5. Checking if Kanley has any Film Crew NFTs (moderator credentials)..."
    NFT_BALANCE=$(cast call $FILM_CREW_NFTS_ADDRESS "balanceOf(address)" $KANLEY_BASE_ADDRESS --rpc-url $RPC_URL 2>/dev/null)
    if [ $? -eq 0 ]; then
        NFT_BALANCE_DEC=$(printf "%d" $NFT_BALANCE)
        if [ $NFT_BALANCE_DEC -gt 0 ]; then
            echo -e "   ${GREEN}✓ Has moderator NFTs: $NFT_BALANCE_DEC${NC}"
        else
            echo -e "   No moderator NFTs found"
        fi
    else
        echo -e "   ${RED}✗ Error querying NFT balance${NC}"
    fi
    
    # Overall verification summary
    echo -e "\n${BOLD}Verification Summary:${NC}"
    echo "==========================================================="
    if [ "$REGISTERED" = true ] && [ "$REPUTATION_MATCH" = true ]; then
        echo -e "${GREEN}✓ VERIFICATION SUCCESSFUL${NC}"
        echo -e "Kanley's reputation score of $EXPECTED_REPUTATION has been independently verified"
        echo -e "on the Base L3 blockchain without relying on dashboard data."
    else
        echo -e "${RED}✗ VERIFICATION FAILED${NC}"
        echo -e "One or more checks failed during independent verification."
    fi
    
    exit 0
fi

# If cast is not installed, just print the commands
echo "Verification Commands to Run:"
echo "==========================================================="
echo "1. Check if Kanley's address is registered in the FilmLedger contract:"
echo "cast call $FILM_LEDGER_ADDRESS 'isRegistered(address)' $KANLEY_BASE_ADDRESS --rpc-url $RPC_URL"
echo ""

echo "2. Query Kanley's reputation directly from the contract:"
echo "cast call $FILM_LEDGER_ADDRESS 'getReputation(address)' $KANLEY_BASE_ADDRESS --rpc-url $RPC_URL"
echo ""

echo "3. Check Kanley's token balance for verification:"
echo "cast call $FILM_LEDGER_ADDRESS 'balanceOf(address)' $KANLEY_BASE_ADDRESS --rpc-url $RPC_URL"
echo ""

echo "4. Check external balance migration status:"
echo "cast call $EXTERNAL_BALANCE_ADDRESS 'getClaimableBalance(address)' $KANLEY_BASE_ADDRESS --rpc-url $RPC_URL"
echo ""

echo "5. Check if Kanley has any Film Crew NFTs (moderator credentials):"
echo "cast call $FILM_CREW_NFTS_ADDRESS 'balanceOf(address)' $KANLEY_BASE_ADDRESS --rpc-url $RPC_URL"
echo ""

echo "How to Interpret Results:"
echo "==========================================================="
echo "The 'getReputation' call will return Kanley's reputation as a uint256 value."
echo "For the value 40.4, this would likely be stored as 404 (integer with implied decimals)."
echo "You should see a hexadecimal result like: 0x0000000000000000000000000000000000000000000000000000000000000194"
echo "(this is hex for 404)"
echo ""
echo "This would confirm Kanley's reputation of 40.4 was properly migrated to the Base L3 blockchain."
echo "Compare this with the expected reputation to verify independently of the dashboard."
echo ""

echo "Running these commands directly interacts with the blockchain, providing"
echo "cryptographic proof of the reputation migration's accuracy."
echo "===========================================================" 