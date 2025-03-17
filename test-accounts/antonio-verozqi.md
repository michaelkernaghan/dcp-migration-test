# Account Migration Verification Test Case

## Test Case ID: TST-ACCT-HERNER

### Basic Information
- **Test Name:** Verify Herner werzog Migration
- **Created By:** Migration Team
- **Creation Date:** 2025-02-15
- **Migration Phase:** Phase 3: Base L3 Deployment
- **Priority:** High

### Account Information
- **Account Name:** Herner werzog
- **Tezos Address:** tz2HYEVENZnJxtzXChvZxSwQaSVnJDSN
- **Base Address:** To be assigned during migration
- **Email:** michael.kerrmaghan@gmail.com
- **Phone/Contact:** 778-949-2186
- **Service Type:** NetNow
- **Purpose:** Social Prod User
- **Authentication Method:** Google Auth (Secondary)
- **User Role:** Standard User

### Initial Values (Tezos)
- **Internal Balance:** 0.98
- **External Balance:** 6.06
- **Reputation:** 0
- **Blockchain Hash:** tz2HYEVeNZ0utXzXChzXcCkrZxSwS3wSpDSN
- **Special Settings/Flags:** 2FA enabled, ID not verified, registered user

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
- [ ] Attempt to authenticate with Google Auth credentials (Secondary account)
- [ ] Verify successful login to the migrated application
- [ ] Confirm user profile information is preserved
- [ ] Verify authentication methods (Google Auth, 2FA) are working correctly
- [ ] Confirm standard user permissions are correctly applied

#### 4. Token Transfer Verification
- [ ] Trigger user interaction to initiate token transfer
- [ ] Verify smart contract executes token transfer
- [ ] Confirm tokens appear in user's Base L3 wallet
- [ ] Verify transaction hash and details: __________________

#### 5. Data Integrity Verification
- [ ] Confirm final internal balance on Base L3: __________________
- [ ] Verify internal balance matches expected value (0.98)
- [ ] Confirm final external balance on Base L3: __________________
- [ ] Verify external balance matches expected value (6.06)
- [ ] Confirm reputation value on Base L3: __________________
- [ ] Verify reputation matches expected value (0)
- [ ] Validate any additional account attributes or settings

### Expected Results
- User should authenticate successfully on the migrated platform
- Internal balance should be preserved: 0.98
- External balance should be preserved: 6.06
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
- Note from source data: "prod moderate is bad idea"
- Account with zero balance - good test case for accounts without existing assets
- Monitor closely during authentication phase 