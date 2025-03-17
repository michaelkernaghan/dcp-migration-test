# Account Migration Verification Test Case

## Test Case ID: [TST-ACCT-XXX]

### Basic Information
- **Test Name:** Verify [Account Name] Migration
- **Created By:** [Author name]
- **Creation Date:** [YYYY-MM-DD]
- **Migration Phase:** Phase 3: Base L3 Deployment
- **Priority:** High
- **Assigned To:** [Team member name]

### Account Information
- **Account Name:** [Full name]
- **Tezos Address:** [Tezos blockchain address]
- **Base Address:** To be assigned during migration
- **Email:** [Associated email]
- **Phone/Contact:** [Contact information]
- **Service Type:** [e.g., Rogers, NetNow, Social Testing, etc.]
- **Purpose:** [e.g., Main Prod User, Baker Testing, etc.]

### Initial Values (Tezos)
- **Balance:** [Token amount]
- **Reputation:** [Reputation value/status]
- **Blockchain Hash:** [Hash value]
- **Special Settings/Flags:** [2FA status, verification status, etc.]

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
- [ ] Verify authentication methods (password, 2FA) are working correctly

#### 4. Token Transfer Verification
- [ ] Trigger user interaction to initiate token transfer
- [ ] Verify smart contract executes token transfer
- [ ] Confirm tokens appear in user's Base L3 wallet
- [ ] Verify transaction hash and details: __________________

#### 5. Data Integrity Verification
- [ ] Confirm final balance on Base L3: __________________
- [ ] Verify balance matches original Tezos balance
- [ ] Confirm reputation value/status on Base L3: __________________
- [ ] Verify reputation matches original Tezos value
- [ ] Validate any additional account attributes or settings

### Expected Results
- User should authenticate successfully on the migrated platform
- Balance should remain identical: [Original Balance] → [Target Balance]
- Reputation should be preserved: [Original Reputation] → [Target Reputation]
- User should have full control over their assets on Base L3
- All account settings and preferences should be maintained

### Actual Results
- **Authentication Success:** [Yes/No]
- **Final Balance:** [Actual amount]
- **Final Reputation:** [Actual value/status]
- **Token Ownership Verified:** [Yes/No]
- **Full Asset Control:** [Yes/No]

### Migration Status
- **Overall Status:** [Not Started / In Progress / Completed / Failed]
- **Completion Date:** [YYYY-MM-DD]
- **Verified By:** [Team member name]

### Evidence/Attachments
- [ ] Screenshot of original Tezos account state
- [ ] Screenshot of Base L3 smart contract assignment
- [ ] Transaction logs
- [ ] Authentication logs
- [ ] Final account state on Base L3

### Notes
- [Special considerations for this account]
- [Issues encountered during migration]
- [Recommendations for similar accounts]
- [Any deviations from standard migration process]

---

## Example: Kinley Stubrick Migration Verification

### Test Case ID: TST-ACCT-KINLEY

### Basic Information
- **Test Name:** Verify Kinley Stubrick Migration
- **Created By:** Migration Team
- **Creation Date:** 2025-02-15
- **Migration Phase:** Phase 3: Base L3 Deployment
- **Priority:** High
- **Assigned To:** Alex Johnson

### Account Information
- **Account Name:** Kinley Stubrick
- **Tezos Address:** tz1XTbJrMGHan4vEYmE7xpCKExBi3oDYYmPI3
- **Base Address:** To be assigned during migration
- **Email:** michaelkerrmaghan@ecadlabs.com
- **Phone/Contact:** 614-615-9138
- **Service Type:** Rogers
- **Purpose:** Main Prod User

### Initial Values (Tezos)
- **Balance:** 11
- **Reputation:** Building
- **Blockchain Hash:** tz1XTbJrMGHanCY4cHNiBj3DTZnVd4YmEYmPI3
- **Special Settings/Flags:** 2FA enabled, ID not verified, registered user

### Migration Status
- **Overall Status:** In Progress
- **Current Step:** Smart Contract Assignment
- **Last Updated:** 2023-03-17 