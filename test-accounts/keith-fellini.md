# Account Migration Verification Test Case

## Test Case ID: TST-ACCT-KEITH

### Basic Information
- **Test Name:** Verify Keith Fellini Migration
- **Created By:** Migration Team
- **Creation Date:** 2025-02-15
- **Migration Phase:** Phase 3: Base L3 Deployment
- **Priority:** High

### Account Information
- **Account Name:** Keith Fellini
- **Tezos Address:** tz1YX9mD4pdrz4vYpyE9dMMkJJaWFX6qa9Qs
- **Base Address:** To be assigned during migration
- **Email:** abbotslordcroqust@gmail.com
- **Phone/Contact:** 236-869-9903
- **Service Type:** Sentinel Wallet
- **Purpose:** Baker Testing
- **Authentication Method:** Sentinel Wallet Login
- **User Role:** Standard User (Baker)

### Initial Values (Tezos)
- **Internal Balance:** 3080.69
- **External Balance:** 194.9
- **Reputation:** 0
- **Blockchain Hash:** tz1YX9mD4pdrz4vYpyE9dMMkJJaWFX6qa9Qs
- **Special Settings/Flags:** 2FA mixed (Yes/no), ID verified (reviewing/no), registered user

### Migration Test Steps

#### 1. Data Snapshot Phase
- [ ] Verify user account exists in Tezos blockchain
- [ ] Record initial balance and reputation values
- [ ] Confirm account details are accurately captured in snapshot
- [ ] Verify blockchain hash integrity

#### 2. Smart Contract Assignment
- [ ] Verify smart contract is deployed on Base L3
- [ ] Confirm account has been assigned a cutover address in the smart contract
- [ ] Record the assigned Base L3 address: __________________
- [ ] Verify mapping between Tezos address and Base address is correct

#### 3. User Authentication
- [ ] Attempt to authenticate with Sentinel Wallet Login
- [ ] Verify successful connection to wallet and login to the migrated application
- [ ] Confirm user profile information is preserved
- [ ] Verify wallet connection and signing methods are working correctly
- [ ] Test Baker-specific features and permissions
- [ ] Verify wallet transaction signing capabilities

#### 4. Token Transfer Verification
- [ ] Trigger user interaction to initiate token transfer
- [ ] Verify smart contract executes token transfer
- [ ] Confirm tokens appear in user's Base L3 wallet
- [ ] Verify transaction hash and details: __________________

#### 5. Data Integrity Verification
- [ ] Confirm final internal balance on Base L3: __________________
- [ ] Verify internal balance matches expected value (3080.69)
- [ ] Confirm final external balance on Base L3: __________________
- [ ] Verify external balance matches expected value (194.9)
- [ ] Confirm reputation value on Base L3: __________________
- [ ] Verify reputation matches expected value (0)
- [ ] Validate any additional account attributes or settings

### Expected Results
- User should authenticate successfully on the migrated platform
- Internal balance should be preserved: 3080.69
- External balance should be preserved: 194.9
- Reputation should be preserved: 0
- User should have full control over their assets on Base L3
- All account settings and preferences should be maintained

### Actual Results
- **Authentication Success:** [Not Started]
- **Final Balance:** [Not Started]
- **Final Reputation:** [Not Started]
- **Token Ownership Verified:** [Not Started]
- **Full Asset Control:** [Not Started]

### Migration Status
- **Overall Status:** Not Started
- **Completion Date:** [Pending]
- **Verified By:** [Pending]

### Evidence/Attachments
- [ ] Screenshot of original Tezos account state
- [ ] Screenshot of Base L3 smart contract assignment
- [ ] Transaction logs
- [ ] Authentication logs
- [ ] Final account state on Base L3

### Notes
- High-value account with substantial balance and reputation
- Baker testing account - important for validator functionality
- Special attention needed for mixed authentication settings 