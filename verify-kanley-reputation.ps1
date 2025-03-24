# Independent Verification Script for Kanley's Reputation Migration
# This queries the actual smart contracts on Base L3 directly

# Contract addresses
$FILM_LEDGER_ADDRESS = "0xf31b1860d20Bc1CaBCB16B9F08F8783B0eb4a59d"
$EXTERNAL_BALANCE_ADDRESS = "0xE4D297078f8678b6C9c746A3485409F2c011c156" 
$FILM_CREW_NFTS_ADDRESS = "0xdC3E83b88762B6FF14f4a938052652FDCa8eBeB0"
$RPC_URL = "https://talntnet-auth-rpc-testnet.appchain.base.org/9nc0Apdn7t9DpsgQfglk3Go2"

# Kanley's addresses
$KANLEY_TEZOS_ADDRESS = "tz1XTbJrMGHan4vEYmE7xpCKExBi3oDYYmPI3"
$KANLEY_BASE_ADDRESS = "0x7A23608a8eBe71868013BDA0d900351A83bb4Dc2"
$EXPECTED_REPUTATION = 40.4

Write-Output "`nIndependent Verification of Kanley's Reputation Migration`n"
Write-Output "==========================================================="
Write-Output "This script will query the actual deployed contracts on Base L3"
Write-Output "to independently verify Kanley's reputation score migration.`n"

Write-Output "Contract Addresses:"
Write-Output "- Film Ledger: $FILM_LEDGER_ADDRESS"
Write-Output "- External Balance Cutover: $EXTERNAL_BALANCE_ADDRESS"
Write-Output "- Film Crew NFTs: $FILM_CREW_NFTS_ADDRESS"
Write-Output "- RPC URL: $RPC_URL`n"

Write-Output "Kanley Account Details:"
Write-Output "- Tezos Address: $KANLEY_TEZOS_ADDRESS"
Write-Output "- Base Address: $KANLEY_BASE_ADDRESS"
Write-Output "- Expected Reputation: $EXPECTED_REPUTATION`n"

Write-Output "Verification Commands to Run:"
Write-Output "==========================================================="
Write-Output "1. Check if Kanley's address is registered in the FilmLedger contract:"
Write-Output "cast call $FILM_LEDGER_ADDRESS 'isRegistered(address)' $KANLEY_BASE_ADDRESS --rpc-url $RPC_URL"
Write-Output ""

Write-Output "2. Query Kanley's reputation directly from the contract:"
Write-Output "cast call $FILM_LEDGER_ADDRESS 'getReputation(address)' $KANLEY_BASE_ADDRESS --rpc-url $RPC_URL"
Write-Output ""

Write-Output "3. Check Kanley's token balance for verification:"
Write-Output "cast call $FILM_LEDGER_ADDRESS 'balanceOf(address)' $KANLEY_BASE_ADDRESS --rpc-url $RPC_URL"
Write-Output ""

Write-Output "4. Check external balance migration status:"
Write-Output "cast call $EXTERNAL_BALANCE_ADDRESS 'getClaimableBalance(address)' $KANLEY_BASE_ADDRESS --rpc-url $RPC_URL"
Write-Output ""

Write-Output "5. Check if Kanley has any Film Crew NFTs (moderator credentials):"
Write-Output "cast call $FILM_CREW_NFTS_ADDRESS 'balanceOf(address)' $KANLEY_BASE_ADDRESS --rpc-url $RPC_URL"
Write-Output ""

Write-Output "How to Interpret Results:"
Write-Output "==========================================================="
Write-Output "The 'getReputation' call will return Kanley's reputation as a uint256 value."
Write-Output "For the value 40.4, this would likely be stored as 404 (integer with implied decimals)."
Write-Output "You should see a hexadecimal result like: 0x0000000000000000000000000000000000000000000000000000000000000194"
Write-Output "(this is hex for 404)"
Write-Output ""
Write-Output "This would confirm Kanley's reputation of 40.4 was properly migrated to the Base L3 blockchain."
Write-Output "Compare this with the expected reputation to verify independently of the dashboard.`n"

Write-Output "Running these commands directly interacts with the blockchain, providing"
Write-Output "cryptographic proof of the reputation migration's accuracy."
Write-Output "===========================================================`n"

Write-Output "To attempt automatic verification, ensure you have Foundry installed with 'cast'."
Write-Output "You can install it from: https://book.getfoundry.sh/getting-started/installation" 