# Account Migration Verification Test Case

## Test Case ID: TST-ACCT-TWITTER

### Basic Information
- **Test Name:** Verify TwitterProd Migration
- **Created By:** Migration Team
- **Creation Date:** 2023-03-15
- **Migration Phase:** Phase 3: Base L3 Deployment
- **Priority:** High

### Account Information
- **Account Name:** TwitterProd
- **Tezos Address:** tz2GYLLxLJQqyaYmE1qVkLppEKfKRK4q52gf
- **Base Address:** 0x6b7280... (to be assigned)
- **Email:** none - filed bug report
- **Phone/Contact:** @standardtesting
- **Service Type:** -
- **Purpose:** Social Testing

### Initial Values (Tezos)
- **Balance:** 0
- **Reputation:** 2.39
- **Blockchain Hash:** tz2GYLLxLJQqyaYmE1qVkLppEKfKRK4q52gf
- **Special Settings/Flags:** Phone only registration, no 2FA, ID not verified

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
- [ ] Attempt to authenticate with user credentials
- [ ] Verify successful login to the migrated application
- [ ] Confirm user profile information is preserved
- [ ] Verify authentication methods (phone only) are working correctly

#### 4. Token Transfer Verification
- [ ] Trigger user interaction to initiate token transfer
- [ ] Verify smart contract executes token transfer
- [ ] Confirm tokens appear in user's Base L3 wallet
- [ ] Verify transaction hash and details: __________________

#### 5. Data Integrity Verification
- [ ] Confirm final balance on Base L3: __________________
- [ ] Verify balance matches original Tezos balance (0)
- [ ] Confirm reputation value/status on Base L3: __________________
- [ ] Verify reputation matches original Tezos value (2.39)
- [ ] Validate any additional account attributes or settings

### Expected Results
- User should authenticate successfully on the migrated platform
- Balance should remain identical: 0 → 0
- Reputation should be preserved: 2.39 → 2.39
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
- Social media account without email registration
- Bug report filed regarding missing email details
- Special case for phone-only authentication
- Test case for accounts with reputation but no balance 