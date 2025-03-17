document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initializeStatusChart();
    initializePhaseChart();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load test cases from localStorage if available
    loadTestCases();
    
    // Initialize test account data
    initializeTestAccounts();
});

/**
 * Initialize the test status summary chart
 */
function initializeStatusChart() {
    const statusCtx = document.getElementById('statusChart').getContext('2d');
    
    const statusData = {
        labels: ['Passed', 'Failed', 'In Progress', 'Not Started'],
        datasets: [{
            data: [0, 0, 0, 32],
            backgroundColor: [
                '#1cc88a', // Success/Passed
                '#e74a3b', // Danger/Failed
                '#f6c23e', // Warning/In Progress
                '#858796'  // Secondary/Not Started
            ],
            hoverBackgroundColor: [
                '#17a673',
                '#d52a1a',
                '#dda20a',
                '#6e707e'
            ],
            hoverBorderColor: "rgba(234, 236, 244, 1)",
        }]
    };
    
    new Chart(statusCtx, {
        type: 'doughnut',
        data: statusData,
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    backgroundColor: "rgb(255,255,255)",
                    bodyFontColor: "#858796",
                    borderColor: '#dddfeb',
                    borderWidth: 1,
                    displayColors: false,
                    caretPadding: 10,
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.dataset.labels[tooltipItem.dataIndex] + ': ' + 
                                   tooltipItem.dataset.data[tooltipItem.dataIndex] + ' tests';
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

/**
 * Initialize the phase progress chart
 */
function initializePhaseChart() {
    const phaseCtx = document.getElementById('phaseChart').getContext('2d');
    
    const phaseData = {
        labels: ['Phase 1: Data Snapshot', 'Phase 2: Migration Pipeline', 'Phase 3: Base L3 Deployment'],
        datasets: [{
            label: 'Tests Passed',
            data: [0, 0, 0],
            backgroundColor: '#1cc88a',
            borderWidth: 0
        }, {
            label: 'Tests Remaining',
            data: [7, 12, 15],
            backgroundColor: '#e9ecef',
            borderWidth: 0
        }]
    };
    
    new Chart(phaseCtx, {
        type: 'bar',
        data: phaseData,
        options: {
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false
                    }
                },
                y: {
                    stacked: true,
                    grid: {
                        color: "rgba(0, 0, 0, 0.05)"
                    },
                    ticks: {
                        beginAtZero: true,
                        precision: 0
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

/**
 * Set up all event listeners for the application
 */
function setupEventListeners() {
    // Add test form submission
    const saveTestBtn = document.getElementById('save-test-btn');
    if (saveTestBtn) {
        saveTestBtn.addEventListener('click', saveTestCase);
    }
    
    // View/Edit test case buttons - update selectors for all test tabs
    document.querySelectorAll('#migration-tests-body .btn, #signing-tests-body .btn, #ui-tests-body .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.classList.contains('btn-outline-primary') ? 'view' : 'edit';
            const testId = this.closest('tr').querySelector('td:first-child').textContent;
            handleTestAction(testId, action);
        });
    });
    
    // Account details buttons
    document.querySelectorAll('.account-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const accountId = this.getAttribute('data-account');
            showAccountDetails(accountId);
        });
    });
    
    // Refresh accounts button
    const refreshBtn = document.getElementById('refresh-accounts-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshAccountStatus);
    }
}

/**
 * Handle view/edit actions for test cases
 */
function handleTestAction(testId, action) {
    // For this demo, just show an alert
    alert(`${action.charAt(0).toUpperCase() + action.slice(1)}ing test case ${testId}`);
    
    // In a real application, you would:
    // 1. Fetch the test case details from your data source
    // 2. Open a modal with the details
    // 3. Allow viewing or editing based on the action
}

/**
 * Save a new test case
 */
function saveTestCase() {
    // Get form values
    const testName = document.getElementById('test-name').value;
    const testPhase = document.getElementById('test-phase').value;
    const testPriority = document.getElementById('test-priority').value;
    const testCategory = document.getElementById('test-category').value;
    const testDescription = document.getElementById('test-description').value;
    const testSteps = document.getElementById('test-steps').value;
    const testExpected = document.getElementById('test-expected').value;
    
    // Validate form
    if (!testName || !testPhase || !testCategory || !testDescription || !testSteps || !testExpected) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Generate test ID based on category (in a real app, this would come from the server)
    let prefix = 'MIG';
    if (testCategory === 'Signing') {
        prefix = 'SIGN';
    } else if (testCategory === 'UI') {
        prefix = 'UI';
    }
    
    // Get count of existing tests in that category
    let testCount = 0;
    if (testCategory === 'Migration') {
        testCount = document.querySelectorAll('#migration-tests-body tr').length;
    } else if (testCategory === 'Signing') {
        testCount = document.querySelectorAll('#signing-tests-body tr').length;
    } else if (testCategory === 'UI') {
        testCount = document.querySelectorAll('#ui-tests-body tr').length;
    }
    
    const testId = `${prefix}-${(testCount + 1).toString().padStart(3, '0')}`;
    
    // Create new test case object
    const newTest = {
        id: testId,
        name: testName,
        phase: testPhase,
        status: 'Not Started',
        category: testCategory,
        priority: testPriority,
        description: testDescription,
        steps: testSteps,
        expected: testExpected,
        dateCreated: new Date().toISOString()
    };
    
    // Add to localStorage (in a real app, you would send to a server)
    saveTestToStorage(newTest);
    
    // Add to table
    addTestToTable(newTest);
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('addTestModal'));
    modal.hide();
    document.getElementById('test-form').reset();
}

/**
 * Save test to localStorage
 */
function saveTestToStorage(test) {
    let tests = JSON.parse(localStorage.getItem('dcpTests')) || [];
    tests.push(test);
    localStorage.setItem('dcpTests', JSON.stringify(tests));
}

/**
 * Add a test to the table
 */
function addTestToTable(test) {
    // Select the appropriate table body based on the test category
    let tbody;
    if (test.category === 'Migration') {
        tbody = document.getElementById('migration-tests-body');
    } else if (test.category === 'Signing') {
        tbody = document.getElementById('signing-tests-body');
    } else if (test.category === 'UI') {
        tbody = document.getElementById('ui-tests-body');
    } else {
        // Default to migration if category is not recognized
        tbody = document.getElementById('migration-tests-body');
    }
    
    const tr = document.createElement('tr');
    
    // Set badge class based on status
    let badgeClass = 'bg-secondary';
    if (test.status === 'Passed') badgeClass = 'bg-success';
    else if (test.status === 'Failed') badgeClass = 'bg-danger';
    else if (test.status === 'In Progress') badgeClass = 'bg-warning text-dark';
    
    tr.innerHTML = `
        <td>${test.id}</td>
        <td>${test.name}</td>
        <td>${test.phase}</td>
        <td><span class="badge ${badgeClass}">${test.status}</span></td>
        <td>
            <button class="btn btn-sm btn-outline-primary">View</button>
            <button class="btn btn-sm btn-outline-secondary">Edit</button>
        </td>
    `;
    
    // Add event listeners to new buttons
    tr.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.classList.contains('btn-outline-primary') ? 'view' : 'edit';
            handleTestAction(test.id, action);
        });
    });
    
    tbody.appendChild(tr);
}

/**
 * Load test cases from localStorage
 */
function loadTestCases() {
    const tests = JSON.parse(localStorage.getItem('dcpTests')) || [];
    
    if (tests.length > 0) {
        // Clear existing demo entries in all tables
        document.getElementById('migration-tests-body').innerHTML = '';
        document.getElementById('signing-tests-body').innerHTML = '';
        document.getElementById('ui-tests-body').innerHTML = '';
        
        // Add stored tests to the appropriate tables
        tests.forEach(test => addTestToTable(test));
    }
}

/**
 * Update the migration progress
 * This would be called whenever test statuses change in a real application
 */
function updateProgress() {
    const tests = JSON.parse(localStorage.getItem('dcpTests')) || [];
    const totalTests = tests.length;
    const passedTests = tests.filter(test => test.status === 'Passed').length;
    
    if (totalTests > 0) {
        const progressPercent = Math.round((passedTests / totalTests) * 100);
        const progressBar = document.querySelector('.progress-bar');
        
        progressBar.style.width = `${progressPercent}%`;
        progressBar.textContent = `${progressPercent}%`;
        progressBar.setAttribute('aria-valuenow', progressPercent);
    }
}

/**
 * Initialize test account data
 */
function initializeTestAccounts() {
    // This would typically load from an API or localStorage
    // For demo, we'll just simulate the data
    
    // Sample account data structure for future reference/expansion
    const accountsData = [
        {
            id: 'kanley',
            name: 'Kanley Stubrick',
            tezosAddress: 'tz1XTbJrMGHan4vEYmE7xpCKExBi3oDYYmPI3',
            baseAddress: 'To be assigned',
            status: 'Not Started',
            balanceTezos: 684.61,
            balanceBase: 55.88,
            reputationTezos: 40.4,
            reputationBase: 40.4,
            verification: 'Not Started',
            progress: 0,
            authMethod: 'Google Auth',
            userRole: 'Moderator',
            details: {
                email: 'michaelkerrmaghan@ecadlabs.com',
                phone: '614-615-9138',
                service: 'Rogers',
                purpose: 'Main Prod User',
                prodStage: 'Prod',
                registered: 'yes',
                twoFactor: 'Yes',
                idVerified: 'no',
                notes: 'Primary User',
                blockchainHash: 'tz1XTbJrMGHanCY4cHNiBj3DTZnVd4YmEYmPI3',
                authMethod: 'Google Auth',
                userRole: 'Moderator'
            }
        },
        {
            id: 'herner',
            name: 'Herner werzog',
            tezosAddress: 'tz2HYEVENZnJxtzXChvZxSwQaSVnJDSN',
            baseAddress: 'To be assigned',
            status: 'Not Started',
            balanceTezos: 6.06,
            balanceBase: 0.98,
            reputationTezos: 0,
            reputationBase: 0,
            verification: 'Not Started',
            progress: 0,
            authMethod: 'Google Auth (Secondary)',
            userRole: 'Standard User',
            details: {
                email: 'michael.kerrmaghan@gmail.com',
                phone: '778-949-2186',
                service: 'NetNow',
                purpose: 'Social Prod User',
                prodStage: 'Prod',
                registered: 'yes',
                twoFactor: 'Yes',
                idVerified: 'no',
                notes: 'prod moderate is bad idea',
                blockchainHash: 'tz2HYEVeNZ0utXzXChzXcCkrZxSwS3wSpDSN',
                authMethod: 'Google Auth (Secondary)',
                userRole: 'Standard User'
            }
        },
        {
            id: 'twitter',
            name: 'TwitterProd',
            tezosAddress: 'tz2GYLLxLJQqyaYmE1qVkLppEKfKRK4q52gf',
            baseAddress: 'To be assigned',
            status: 'Not Started',
            balanceTezos: 0,
            balanceBase: 2.39,
            reputationTezos: 0,
            reputationBase: 0,
            verification: 'Not Started',
            progress: 0,
            authMethod: 'X (Twitter) Sign-in',
            userRole: 'Standard User',
            details: {
                email: 'none - filed bug report',
                phone: '@standardtesting',
                service: '-',
                purpose: 'Social Testing',
                prodStage: 'Prod',
                registered: 'phone only',
                twoFactor: 'no',
                idVerified: 'no',
                notes: 'none - filed bug report',
                blockchainHash: 'tz2GYLLxLJQqyaYmE1qVkLppEKfKRK4q52gf',
                authMethod: 'X (Twitter) Sign-in',
                userRole: 'Standard User'
            }
        },
        {
            id: 'keith',
            name: 'Keith Fellini',
            tezosAddress: 'tz1YX9mD4pdrz4vYpyE9dMMkJJaWFX6qa9Qs',
            baseAddress: 'To be assigned',
            status: 'Not Started',
            balanceTezos: 194.9,
            balanceBase: 3080.69,
            reputationTezos: 0,
            reputationBase: 0,
            verification: 'Not Started',
            progress: 0,
            authMethod: 'Sentinel Wallet Login',
            userRole: 'Standard User (Baker)',
            details: {
                email: 'abbotslordcroqust@gmail.com',
                phone: '236-869-9903',
                service: 'Sentinel Wallet',
                purpose: 'Baker Testing',
                prodStage: 'Prod/Stage',
                registered: 'yes',
                twoFactor: 'Yes/no',
                idVerified: 'Yes (reviewing/no)',
                notes: 'Baker verification/prod',
                blockchainHash: 'tz1YX9mD4pdrz4vYpyE9dMMkJJaWFX6qa9Qs',
                authMethod: 'Sentinel Wallet Login',
                userRole: 'Standard User (Baker)'
            }
        }
    ];
    
    // Store accounts data in localStorage for reuse
    localStorage.setItem('dcpAccounts', JSON.stringify(accountsData));
}

/**
 * Show detailed information for a specific test account
 */
function showAccountDetails(accountId) {
    // Get accounts data from localStorage
    const accounts = JSON.parse(localStorage.getItem('dcpAccounts')) || [];
    const account = accounts.find(acc => acc.id === accountId);
    
    if (!account) {
        alert('Account details not found');
        return;
    }
    
    // For demo purposes, show an alert with account details
    // In a real app, you would display this in a modal
    const detailsMessage = `
    Account Details for ${account.name}:
    
    Email: ${account.details.email}
    Phone: ${account.details.phone}
    Service: ${account.details.service}
    Purpose: ${account.details.purpose}
    Authentication Method: ${account.authMethod}
    User Role: ${account.userRole}
    Production Stage: ${account.details.prodStage}
    Registered: ${account.details.registered}
    Two-Factor Auth: ${account.details.twoFactor}
    ID Verified: ${account.details.idVerified}
    Notes: ${account.details.notes}
    
    Tezos Address: ${account.tezosAddress}
    Base Address: ${account.baseAddress}
    Blockchain Hash: ${account.details.blockchainHash}
    
    Current Migration Status: ${account.status} (${account.progress}%)
    Balance: ${account.balanceTezos} → ${account.balanceBase}
    Reputation: ${account.reputationTezos} → ${account.reputationBase}
    `;
    
    alert(detailsMessage);
    
    // In a real application, you would show a modal with this information
    // and potentially offer options to update the status
}

/**
 * Simulate refreshing test account status
 */
function refreshAccountStatus() {
    // Simulate a loading state
    const refreshBtn = document.getElementById('refresh-accounts-btn');
    const originalText = refreshBtn.innerHTML;
    refreshBtn.innerHTML = '<i class="bi bi-arrow-repeat me-2"></i>Refreshing...';
    refreshBtn.disabled = true;
    
    // Simulate an API call with a delay
    setTimeout(() => {
        // In a real app, this would make an API call to get the latest status
        
        // Restore button state
        refreshBtn.innerHTML = originalText;
        refreshBtn.disabled = false;
        
        // Show success message
        alert('Account statuses refreshed successfully!');
    }, 1500);
}

/**
 * Create a new test case for account migration verification
 * This is a helper function that could be used to create predefined test cases for the accounts
 */
function createAccountMigrationTest(account) {
    const testName = `Verify ${account.name} Migration`;
    const testDescription = `Verify that ${account.name}'s account is properly migrated from Tezos to Base L3, including balance and reputation preservation.`;
    const testSteps = `1. Verify Tezos account snapshot for ${account.name} (${account.tezosAddress})
2. Confirm Base L3 smart contract assignment (${account.baseAddress})
3. Verify user can sign on to their account
4. Verify tokens are sent to wallet after user interaction
5. Confirm balance (${account.balanceTezos}) and reputation (${account.reputationTezos}) are preserved`;
    const testExpected = `1. User account information should be correctly captured in snapshot
2. Base L3 smart contract should contain entry for ${account.name}'s account
3. User should be able to authenticate successfully
4. Tokens should be transferred to user's wallet after interaction
5. Balance should remain ${account.balanceTezos} and reputation should remain ${account.reputationTezos === 'Building' ? 'Building' : account.reputationTezos}`;

    // Create test case object
    const newTest = {
        id: `TST-ACCT-${account.id.toUpperCase()}`,
        name: testName,
        phase: 'Phase 3: Base L3 Deployment',
        status: 'Not Started',
        assignee: 'Migration Team',
        priority: 'High',
        description: testDescription,
        steps: testSteps,
        expected: testExpected,
        dateCreated: new Date().toISOString()
    };
    
    return newTest;
} 