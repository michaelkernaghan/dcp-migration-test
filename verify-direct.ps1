# Direct JSON-RPC Verification Script for PowerShell
# This directly calls the Base L3 blockchain without requiring Node.js

# Contract addresses
$FILM_LEDGER_ADDRESS = "0xf31b1860d20Bc1CaBCB16B9F08F8783B0eb4a59d"
$RPC_URL = "https://talntnet-auth-rpc-testnet.appchain.base.org/9nc0Apdn7t9DpsgQfglk3Go2"

# Kanley's address and expected reputation
$KANLEY_BASE_ADDRESS = "0x7A23608a8eBe71868013BDA0d900351A83bb4Dc2"
$EXPECTED_REPUTATION = 40.4

Write-Output "`nDirect JSON-RPC Verification of Kanley's Reputation Migration`n"
Write-Output "==========================================================="
Write-Output "This script directly queries the Base L3 blockchain via JSON-RPC"
Write-Output "to verify Kanley's reputation score migration.`n"

Write-Output "Details:"
Write-Output "- Film Ledger Contract: $FILM_LEDGER_ADDRESS"
Write-Output "- RPC URL: $RPC_URL"
Write-Output "- Kanley Base Address: $KANLEY_BASE_ADDRESS"
Write-Output "- Expected Reputation: $EXPECTED_REPUTATION`n"

# Function signatures (first 4 bytes of the keccak256 hash of the function signature)
$IS_REGISTERED_SIG = "4f5a4e1c" # isRegistered(address)
$GET_REPUTATION_SIG = "5a9a0b76" # getReputation(address)
$BALANCE_OF_SIG = "70a08231" # balanceOf(address)

# Prepare the address parameter (remove 0x prefix and pad to 32 bytes)
$addressParam = $KANLEY_BASE_ADDRESS.Substring(2).PadLeft(64, '0')

# Build JSON-RPC payloads
$isRegisteredPayload = @{
    jsonrpc = "2.0"
    method = "eth_call"
    params = @(
        @{
            to = $FILM_LEDGER_ADDRESS
            data = "0x$($IS_REGISTERED_SIG)$($addressParam)"
        },
        "latest"
    )
    id = 1
} | ConvertTo-Json -Compress

$getReputationPayload = @{
    jsonrpc = "2.0"
    method = "eth_call"
    params = @(
        @{
            to = $FILM_LEDGER_ADDRESS
            data = "0x$($GET_REPUTATION_SIG)$($addressParam)"
        },
        "latest"
    )
    id = 2
} | ConvertTo-Json -Compress

$balanceOfPayload = @{
    jsonrpc = "2.0"
    method = "eth_call"
    params = @(
        @{
            to = $FILM_LEDGER_ADDRESS
            data = "0x$($BALANCE_OF_SIG)$($addressParam)"
        },
        "latest"
    )
    id = 3
} | ConvertTo-Json -Compress

# Set up headers for the HTTP request
$headers = @{
    "Content-Type" = "application/json"
}

Write-Output "Making direct JSON-RPC calls to Base L3...`n"

try {
    # 1. Check if address is registered
    Write-Output "1. Checking if Kanley's address is registered..."
    try {
        $response = Invoke-WebRequest -Uri $RPC_URL -Method Post -Body $isRegisteredPayload -Headers $headers -UseBasicParsing
        $responseObj = $response.Content | ConvertFrom-Json
        
        Write-Output "   Full response: $($response.Content)"
        
        if ($responseObj.error) {
            Write-Output "   ERROR from RPC: $($responseObj.error.message)"
        } elseif ($responseObj.result) {
            $result = $responseObj.result
            
            # Check if the result indicates true (0x01)
            $isRegistered = $result -eq "0x0000000000000000000000000000000000000000000000000000000000000001"
            
            if ($isRegistered) {
                Write-Output "   VERIFIED: Kanley's address is registered in the contract"
            } else {
                Write-Output "   NOT VERIFIED: Kanley's address is not registered"
            }
            Write-Output "   Raw result: $result"
        } else {
            Write-Output "   Unexpected response format"
        }
    } catch {
        Write-Output "   ERROR: Failed to check registration: $_"
        Write-Output "   Request body: $isRegisteredPayload"
    }
    
    # 2. Query reputation
    Write-Output "`n2. Checking Kanley's reputation..."
    try {
        $response = Invoke-WebRequest -Uri $RPC_URL -Method Post -Body $getReputationPayload -Headers $headers -UseBasicParsing
        $responseObj = $response.Content | ConvertFrom-Json
        
        Write-Output "   Full response: $($response.Content)"
        
        if ($responseObj.error) {
            Write-Output "   ERROR from RPC: $($responseObj.error.message)"
        } elseif ($responseObj.result) {
            $result = $responseObj.result
            
            # Only process if result is not empty or error
            if ($result -ne "0x") {
                # Convert hex to decimal
                $reputationHex = $result.Substring(2) # Remove 0x prefix
                $reputationDec = [Convert]::ToInt64($reputationHex, 16)
                
                # Apply scaling factor (1 decimal place means divide by 10)
                $reputationFloat = $reputationDec / 10
                
                $reputationMatch = $reputationFloat -eq $EXPECTED_REPUTATION
                
                if ($reputationMatch) {
                    Write-Output "   VERIFIED: Reputation value matches expected: $reputationFloat"
                } else {
                    Write-Output "   NOT VERIFIED: Reputation value does not match: $reputationFloat (Expected: $EXPECTED_REPUTATION)"
                }
                Write-Output "   Raw result: $result"
                Write-Output "   Decimal value: $reputationDec"
                Write-Output "   Scaled value: $reputationFloat"
            } else {
                Write-Output "   Empty result (0x) returned - contract may not have this function or address is not registered"
            }
        } else {
            Write-Output "   Unexpected response format"
        }
    } catch {
        Write-Output "   ERROR: Failed to check reputation: $_"
        Write-Output "   Request body: $getReputationPayload"
    }
    
    # 3. Check token balance
    Write-Output "`n3. Checking Kanley's token balance..."
    try {
        $response = Invoke-WebRequest -Uri $RPC_URL -Method Post -Body $balanceOfPayload -Headers $headers -UseBasicParsing
        $responseObj = $response.Content | ConvertFrom-Json
        
        Write-Output "   Full response: $($response.Content)"
        
        if ($responseObj.error) {
            Write-Output "   ERROR from RPC: $($responseObj.error.message)"
        } elseif ($responseObj.result) {
            $result = $responseObj.result
            
            # Only process if result is not empty or error
            if ($result -ne "0x") {
                # Convert hex to decimal
                $balanceHex = $result.Substring(2) # Remove 0x prefix
                $balanceDec = [Convert]::ToInt64($balanceHex, 16)
                
                # Convert to token amount (18 decimals)
                $balanceToken = $balanceDec / [Math]::Pow(10, 18)
                
                Write-Output "   Token balance: $balanceToken TALNT"
                Write-Output "   Raw result: $result"
                Write-Output "   Decimal value: $balanceDec"
            } else {
                Write-Output "   Empty result (0x) returned - contract may not have this function or address is not registered"
            }
        } else {
            Write-Output "   Unexpected response format"
        }
    } catch {
        Write-Output "   ERROR: Failed to check token balance: $_"
        Write-Output "   Request body: $balanceOfPayload"
    }
    
    # Overall verification
    Write-Output "`nVerification Summary:"
    Write-Output "==========================================================="
    if ($isRegistered -and $reputationMatch) {
        Write-Output "VERIFICATION SUCCESSFUL"
        Write-Output "Kanley's reputation score of $EXPECTED_REPUTATION has been independently verified"
        Write-Output "on the Base L3 blockchain without relying on dashboard data."
    } else {
        Write-Output "VERIFICATION FAILED"
        Write-Output "One or more checks failed during independent verification."
    }
    
} catch {
    Write-Output "ERROR: Failed to connect to the blockchain: $_"
} 