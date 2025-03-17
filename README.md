# DCP Migration Testing Dashboard

A comprehensive web application for tracking the migration of a decentralized pictures application from Tezos to Base L3 blockchain. This dashboard helps teams plan, execute, and monitor test cases throughout the migration process.

## Features

- **Dashboard Overview**: Visual summary of migration progress with interactive charts
- **Migration Phase Tracking**: Monitor progress across the three main migration phases
- **Test Account Tracking**: Track specific test accounts through the migration process
- **Test Case Management**: Create, view, and edit test cases for different migration phases
- **Status Reporting**: Track test execution status and results
- **Data Persistence**: Test cases are stored in the browser's localStorage

## Migration Phases

The dashboard tracks testing across three critical phases:

1. **Phase 1: Data Snapshot** - Testing the snapshot creation of user accounts, balances, and data from the Tezos blockchain
2. **Phase 2: Migration Pipeline** - Testing the secure pipeline for transferring data to Base L3
3. **Phase 3: Base L3 Deployment** - Testing smart contract deployment and user balance migration

## Test Categories

The dashboard organizes test cases into three main categories:

1. **Migration Tests** - Tests focused on verifying data migration integrity, smart contract functionality, and token transfers
2. **Signing Validation Tests** - Tests for verifying wallet connection, transaction signatures, and approval flows
3. **UI Functional Tests** - Tests for user interface functionality, responsiveness, and user experience

## Test Account Migration Tracking

The dashboard includes a dedicated section for tracking specific test accounts through the migration process:

### Key Account Migration Steps

1. **Tezos Snapshot** - Capture initial account state on Tezos blockchain
2. **Base Smart Contract Assignment** - Assign cutover address in Base L3 smart contract
3. **User Authentication** - Verify user can sign in and activate their account
4. **Token Transfer** - Verify tokens are sent to wallet after user interaction
5. **Data Verification** - Verify balances and reputation are preserved

### Test Accounts

The system tracks four test accounts through the migration process:

1. **Kanley Stubrick** - Main production user with active balance and reputation
2. **Herner werzog** - Social production user with zero balance
3. **TwitterProd** - Social testing account with reputation only
4. **Keith Fellini** - Baker testing account with substantial balance and reputation

For each account, the system monitors:
- Original Tezos address and assigned Base address
- Balance migration (ensuring values are preserved)
- Reputation migration
- User authentication and verification
- Smart contract integration

Templates for detailed account migration verification are provided in the `test-accounts/` directory.

## Getting Started

To use the application:

1. Clone this repository
2. Open `index.html` in your web browser
3. Begin adding and managing test cases for your migration

## Tech Stack

- HTML5, CSS3, and JavaScript (vanilla)
- Bootstrap 5 for UI components and responsive design
- Chart.js for data visualization
- Browser localStorage for data persistence

## Future Enhancements

Potential future improvements for this dashboard include:

- Server-side storage with a proper database
- User authentication and role-based access control
- File attachments for test evidence
- Email notifications for test status changes
- Integration with CI/CD pipelines
- Export/import functionality for test cases

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or feedback, please reach out to the development team. 