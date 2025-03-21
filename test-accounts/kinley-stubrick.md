# Account Migration Verification Test Case

## Test Case ID: TST-ACCT-KANLEY

### Basic Information
- **Test Name:** Verify Kanley Stubrick Migration
- **Created By:** Migration Team
- **Creation Date:** 2025-02-15
- **Migration Phase:** Phase 3: Base L3 Deployment
- **Priority:** High

### Account Information
- **Account Name:** Kanley Stubrick
- **Tezos Address:** tz1XTbJrMGHan4vEYmE7xpCKExBi3oDYYmPI3
- **Base Address:** To be assigned during migration
- **Email:** michaelkerrmaghan@ecadlabs.com
- **Phone/Contact:** 614-615-9138
- **Service Type:** Rogers
- **Purpose:** Main Prod User
- **Authentication Method:** Google Auth
- **User Role:** Moderator

### Initial Values (Tezos)
- **Internal Balance:** 55.88
- **External Balance:** 684.61
- **Reputation:** 40.4
- **Blockchain Hash:** tz1XTbJrMGHanCY4cHNiBj3DTZnVd4YmEYmPI3
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
- [ ] Attempt to authenticate with Google Auth credentials
- [ ] Verify successful login to the migrated application
- [ ] Confirm user profile information is preserved
- [ ] Verify authentication methods (Google Auth, 2FA) are working correctly
- [ ] Confirm moderator privileges are properly assigned and functional
- [ ] Test moderation-specific features and permissions

#### 4. Token Transfer Verification
- [ ] Trigger user interaction to initiate token transfer
- [ ] Verify smart contract executes token transfer
- [ ] Confirm tokens appear in user's Base L3 wallet
- [ ] Verify transaction hash and details: __________________

#### 5. Data Integrity Verification
- [ ] Confirm final internal balance on Base L3: __________________
- [ ] Verify internal balance matches expected value (55.88)
- [ ] Confirm final external balance on Base L3: __________________
- [ ] Verify external balance matches expected value (684.61)
- [ ] Confirm reputation value on Base L3: __________________
- [ ] Verify reputation matches expected value (40.4)
- [ ] Validate any additional account attributes or settings

### Expected Results
- User should authenticate successfully on the migrated platform
- Internal balance should be preserved: 55.88
- External balance should be preserved: 684.61
- Reputation should be preserved: 40.4
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
- Primary user account with high importance
- Will serve as the benchmark for other account migrations
- Consider adding additional verification steps if needed 