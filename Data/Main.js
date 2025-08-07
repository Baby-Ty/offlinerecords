// Version 3.0 - Modern JavaScript Implementation
class DRInterface {
    constructor() {
        this.recordData = {
            names: [],
            paths: [],
            groups: []
        };
        this.init();
    }

    async init() {
        try {
            await this.loadData();
            this.setupEventListeners();
        } catch (error) {
            this.showError('Failed to initialize application', error);
        }
    }

    // Modern logout with better UX
    logOut() {
        this.showLoading('Logging out...');
        setTimeout(() => {
            // Could integrate with actual logout endpoint
            window.location.href = 'index.html';
        }, 1000);
    }

    // Enhanced UI box management with modern CSS classes
    showBox(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('visible');
            element.setAttribute('aria-hidden', 'false');
        }
    }

    closeBox(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('visible');
            element.setAttribute('aria-hidden', 'true');
        }
    }

    // Modern navigation with better state management
    async loadRecord(path) {
        try {
            this.showLoading('Loading medical records...');
            
            // Use sessionStorage instead of cookies for better security
            sessionStorage.setItem('recordPath', path);
            
            // Add small delay for better UX
            await new Promise(resolve => setTimeout(resolve, 800));
            
            window.location.href = "ViewData.html";
        } catch (error) {
            this.showError('Failed to load record', error);
        }
    }

    // Modern file reading with better error handling
    async readDataFile(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.text();
        } catch (error) {
            console.error('Failed to load file:', error);
            throw new Error(`Unable to load data file: ${path}`);
        }
    }

    // Load data from embedded configuration (avoids CORS issues with local files)
    async loadData() {
        try {
            const configData = this.getEmbeddedConfig();
            this.parseConfigData(configData);
            console.log('Successfully loaded embedded configuration');
        } catch (error) {
            console.error('Data loading failed:', error);
            this.showError('Failed to load medical records configuration');
        }
    }

    // Embedded configuration to avoid fetch/CORS issues with local files
    getEmbeddedConfig() {
        return {
            "records": {
                "MARS": [
                    {
                        "name": "MARS DAY",
                        "path": "offline data/RUSSLL_DAY/MED_data.html",
                        "role": "DAY",
                        "description": "Day Program Medication Records"
                    },
                    {
                        "name": "MARS LTC", 
                        "path": "offline data/RUSSLL_LTC/MED_data.html",
                        "role": "LTC",
                        "description": "Long Term Care Medication Records"
                    },
                    {
                        "name": "MARS OP",
                        "path": "offline data/RUSSLL_OP/MED_data.html", 
                        "role": "OP",
                        "description": "Outpatient Medication Records"
                    },
                    {
                        "name": "MARS RC",
                        "path": "offline data/RUSSLL_RC/MED_data.html",
                        "role": "RC", 
                        "description": "Residential Care Medication Records"
                    }
                ],
                "TARS": [
                    {
                        "name": "TARS DAY",
                        "path": "offline data/RUSSLL_DAY/TRE_data.html",
                        "role": "DAY",
                        "description": "Day Program Treatment Records"
                    },
                    {
                        "name": "TARS LTC",
                        "path": "offline data/RUSSLL_LTC/TRE_data.html", 
                        "role": "LTC",
                        "description": "Long Term Care Treatment Records"
                    },
                    {
                        "name": "TARS OP",
                        "path": "offline data/RUSSLL_OP/TRE_data.html",
                        "role": "OP", 
                        "description": "Outpatient Treatment Records"
                    },
                    {
                        "name": "TARS RC",
                        "path": "offline data/RUSSLL_RC/TRE_data.html",
                        "role": "RC",
                        "description": "Residential Care Treatment Records"
                    }
                ],
                "FaceSheets": [
                    {
                        "name": "Face Sheets DAY",
                        "path": "offline data/RUSSLL_DAY/Facesheet_data.html",
                        "role": "DAY",
                        "description": "Day Program Patient Summary"
                    },
                    {
                        "name": "Face Sheets LTC",
                        "path": "offline data/RUSSLL_LTC/Facesheet_data.html",
                        "role": "LTC", 
                        "description": "Long Term Care Patient Summary"
                    },
                    {
                        "name": "Face Sheets OP",
                        "path": "offline data/RUSSLL_OP/Facesheet_data.html",
                        "role": "OP",
                        "description": "Outpatient Patient Summary"
                    },
                    {
                        "name": "Face Sheets RC", 
                        "path": "offline data/RUSSLL_RC/Facesheet_data.html",
                        "role": "RC",
                        "description": "Residential Care Patient Summary"
                    }
                ],
                "Orders": [
                    {
                        "name": "Orders DAY",
                        "path": "offline data/RUSSLL_DAY/Oth_data.html",
                        "role": "DAY", 
                        "description": "Day Program Medical Orders"
                    },
                    {
                        "name": "Orders LTC",
                        "path": "offline data/RUSSLL_LTC/Oth_data.html",
                        "role": "LTC",
                        "description": "Long Term Care Medical Orders"
                    },
                    {
                        "name": "Orders OP",
                        "path": "offline data/RUSSLL_OP/Oth_data.html",
                        "role": "OP",
                        "description": "Outpatient Medical Orders"
                    },
                    {
                        "name": "Orders RC",
                        "path": "offline data/RUSSLL_RC/Oth_data.html", 
                        "role": "RC",
                        "description": "Residential Care Medical Orders"
                    }
                ]
            }
        };
    }

    parseConfigData(configData) {
        // Convert config data to the expected format
        const records = configData.records;
        
        Object.keys(records).forEach(recordType => {
            this.recordData.groups.push(recordType);
            const names = [];
            const paths = [];
            
            records[recordType].forEach(record => {
                names.push(record.name);
                paths.push(record.path);
            });
            
            this.recordData.names.push(names);
            this.recordData.paths.push(paths);
        });
        
        console.log('Loaded record data:', this.recordData);
    }



    // Modern record box population with better DOM manipulation
    populateRecordBox(groupName) {
        try {
            const groupIndex = this.recordData.groups.findIndex(
                group => group.toUpperCase().includes(groupName.toUpperCase())
            );

            if (groupIndex === -1) {
                this.showError(`No records found for ${groupName}`);
                return;
            }

            const records = this.recordData.names[groupIndex];
            const paths = this.recordData.paths[groupIndex];

            // If only one record, load it directly
            if (records.length === 1) {
                this.loadRecord(paths[0]);
                return;
            }

            // Update modal title to show what type of record is being selected
            const recordTitle = document.getElementById('record-title');
            if (recordTitle) {
                recordTitle.textContent = `Select ${groupName} Role`;
            }

            // Create record selection UI
            this.createRecordSelectionUI(records, paths, groupName);
            this.showBox('SLTRecord');

        } catch (error) {
            this.showError('Failed to load record selection', error);
        }
    }

    // Create modern record selection interface
    createRecordSelectionUI(records, paths, groupName) {
        const container = document.getElementById('SLTRecordCont');
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        // Add instruction text
        const instruction = document.createElement('p');
        instruction.className = 'role-instruction';
        instruction.textContent = `Select the facility role to view ${groupName} records:`;
        container.appendChild(instruction);

        // Create record buttons with modern approach
        records.forEach((name, index) => {
            const button = this.createRoleButton(name, paths[index], groupName);
            container.appendChild(button);
        });
    }

    createRoleButton(name, path, groupName) {
        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'SLTRecordBTN role-button';
        
        // Extract role from name (e.g., "MARS LTC" -> "LTC")
        const roleName = name.split(' ').pop();
        const roleDescriptions = {
            'LTC': 'Long Term Care',
            'OP': 'Outpatient',
            'RC': 'Residential Care', 
            'DAY': 'Day Program'
        };

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'role-btn-content';
        
        const roleIcon = document.createElement('span');
        roleIcon.className = 'role-icon';
        roleIcon.textContent = this.getRoleIcon(roleName);
        
        const roleTitle = document.createElement('span');
        roleTitle.className = 'role-title';
        roleTitle.textContent = roleName;
        
        const roleDesc = document.createElement('span');
        roleDesc.className = 'role-description';
        roleDesc.textContent = roleDescriptions[roleName] || roleName;
        
        button.appendChild(roleIcon);
        button.appendChild(roleTitle);
        button.appendChild(roleDesc);
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeBox('SLTRecord');
            this.loadRecord(path);
        });
        
        buttonDiv.appendChild(button);
        return buttonDiv;
    }

    getRoleIcon(roleName) {
        const icons = {
            'LTC': '🏥',  // Hospital for Long Term Care
            'OP': '🚶',   // Walking person for Outpatient
            'RC': '🏠',   // House for Residential Care
            'DAY': '☀️'   // Sun for Day Program
        };
        return icons[roleName] || '📋';
    }

    // Enhanced loading and user feedback states
    showLoading(message = 'Loading...', details = '') {
        const loadingElement = document.getElementById('LoadingMSG');
        if (loadingElement) {
            const messageElement = loadingElement.querySelector('h2');
            const detailsElement = loadingElement.querySelector('p');
            
            if (messageElement) {
                messageElement.textContent = message;
            }
            if (detailsElement && details) {
                detailsElement.textContent = details;
            }
            
            loadingElement.classList.add('visible');
            loadingElement.setAttribute('aria-hidden', 'false');
            
            // Add subtle animation
            loadingElement.style.animation = 'fadeIn 0.3s ease-in-out';
        }
    }

    hideLoading() {
        const loadingElement = document.getElementById('LoadingMSG');
        if (loadingElement) {
            // Smooth fade out
            loadingElement.style.animation = 'fadeOut 0.3s ease-in-out';
            
            setTimeout(() => {
            loadingElement.classList.remove('visible');
                loadingElement.setAttribute('aria-hidden', 'true');
                loadingElement.style.animation = '';
            }, 300);
        }
    }

    // Enhanced progress feedback for longer operations
    showProgress(message, percentage = null) {
        this.showLoading(message, percentage ? `${percentage}% complete` : '');
        
        // Optional: Add progress bar if percentage is provided
        if (percentage !== null) {
            let progressBar = document.querySelector('.progress-bar');
            if (!progressBar) {
                progressBar = document.createElement('div');
                progressBar.className = 'progress-bar';
                progressBar.innerHTML = '<div class="progress-fill"></div>';
                
                const loadingElement = document.getElementById('LoadingMSG');
                const loadingContent = loadingElement.querySelector('.LoadingCont');
                if (loadingContent) {
                    loadingContent.appendChild(progressBar);
                }
            }
            
            const progressFill = progressBar.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
            }
        }
    }

    showError(message, error = null) {
        console.error('DR Interface Error:', message, error);
        
        // Create or update error display
        let errorDiv = document.getElementById('errorDisplay');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'errorDisplay';
            errorDiv.className = 'error-message';
            document.body.appendChild(errorDiv);
        }
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
        
        this.hideLoading();
    }

    // Enhanced event listeners with accessibility support
    setupEventListeners() {
        // Enhanced keyboard accessibility
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Focus management for better accessibility
        document.addEventListener('focusin', (e) => {
            this.handleFocusChange(e);
        });

        // Announce page changes to screen readers
        this.announcePageLoad();
    }

    handleKeyboardNavigation(e) {
        switch(e.key) {
            case 'Escape':
                this.handleEscapeKey(e);
                break;
            case 'Enter':
            case ' ':
                this.handleActivationKey(e);
                break;
            case 'Tab':
                this.handleTabNavigation(e);
                break;
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
                this.handleArrowNavigation(e);
                break;
        }
    }

    handleEscapeKey(e) {
                // Close any open popups
                const visiblePopups = document.querySelectorAll('.PopupBox.visible');
        if (visiblePopups.length > 0) {
            e.preventDefault();
                visiblePopups.forEach(popup => {
                    popup.classList.remove('visible');
                popup.setAttribute('aria-hidden', 'true');
            });
            
            // Return focus to the element that opened the popup
            const trigger = document.querySelector('[aria-expanded="true"]');
            if (trigger) {
                trigger.focus();
                trigger.setAttribute('aria-expanded', 'false');
            }
            
            this.announceToScreenReader('Dialog closed');
        }
    }

    handleActivationKey(e) {
        const target = e.target;
        
        // Handle button activation with keyboard
        if (target.matches('button, .MainBTN, .SLTRecordBTN')) {
            e.preventDefault();
            target.click();
        }
    }

    handleTabNavigation(e) {
        // Trap focus within modals
        const openModal = document.querySelector('.PopupBox.visible');
        if (openModal) {
            const focusableElements = openModal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    handleArrowNavigation(e) {
        const target = e.target;
        
        // Navigate between main buttons with arrow keys
        if (target.matches('.MainBTN')) {
            e.preventDefault();
            const buttons = Array.from(document.querySelectorAll('.MainBTN'));
            const currentIndex = buttons.indexOf(target);
            let nextIndex;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'ArrowLeft':
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
                    break;
                case 'ArrowDown':
                case 'ArrowRight':
                    nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
                    break;
            }
            
            if (nextIndex !== undefined) {
                buttons[nextIndex].focus();
            }
        }
        
        // Navigate between record selection buttons
        if (target.matches('.SLTRecordBTN button, .role-btn-content')) {
            e.preventDefault();
            const buttons = Array.from(document.querySelectorAll('.SLTRecordBTN button, .role-btn-content'));
            const currentIndex = buttons.indexOf(target);
            let nextIndex;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'ArrowLeft':
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
                    break;
                case 'ArrowDown':
                case 'ArrowRight':
                    nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
                    break;
            }
            
            if (nextIndex !== undefined) {
                buttons[nextIndex].focus();
            }
        }
    }

    handleFocusChange(e) {
        // Announce focused element to screen readers if it has a description
        const target = e.target;
        const description = target.getAttribute('aria-describedby');
        if (description) {
            const descElement = document.getElementById(description);
            if (descElement) {
                this.announceToScreenReader(descElement.textContent);
            }
        }
    }

    announceToScreenReader(message) {
        // Create or update a live region for screen reader announcements
        let announcer = document.getElementById('screenReaderAnnouncer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'screenReaderAnnouncer';
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.className = 'sr-only';
            document.body.appendChild(announcer);
        }
        
        // Clear and set the message
        announcer.textContent = '';
        setTimeout(() => {
            announcer.textContent = message;
        }, 100);
    }

    announcePageLoad() {
        setTimeout(() => {
            this.announceToScreenReader('NCA Disaster Recovery Interface loaded. Use tab to navigate between buttons, or use arrow keys to move between main options.');
        }, 1000);
    }
}

// Initialize the modern DR Interface
let drInterface;

// Legacy function wrappers for backward compatibility
function LogOut() {
    console.log('LogOut() called');
    if (drInterface && drInterface.logOut) {
        drInterface.logOut();
    } else {
        console.error('DR Interface not available or logOut method missing');
    }
}

function ShowBox(elementId) {
    console.log('ShowBox() called with:', elementId);
    if (drInterface && drInterface.showBox) {
        drInterface.showBox(elementId);
    } else {
        console.error('DR Interface not available or showBox method missing');
    }
}

function CloseBox(elementId) {
    console.log('CloseBox() called with:', elementId);
    if (drInterface && drInterface.closeBox) {
        drInterface.closeBox(elementId);
    } else {
        console.error('DR Interface not available or closeBox method missing');
    }
}

function Load(path) {
    console.log('Load() called with:', path);
    if (drInterface && drInterface.loadRecord) {
        drInterface.loadRecord(path);
    } else {
        console.error('DR Interface not available or loadRecord method missing');
    }
}

function PopRecordBox(group) {
    console.log('PopRecordBox() called with:', group);
    
    // Check both drInterface and window.drInterface
    const interface = drInterface || window.drInterface;
    
    if (interface && interface.populateRecordBox) {
        interface.populateRecordBox(group);
    } else {
        console.error('DR Interface not available. Attempting emergency initialization...');
        
        // Emergency initialization attempt
        try {
            window.drInterface = new DRInterface();
            setTimeout(() => {
                if (window.drInterface && window.drInterface.populateRecordBox) {
                    window.drInterface.populateRecordBox(group);
                } else {
                    alert('Unable to initialize DR Interface. Please refresh the page.');
                }
            }, 500);
        } catch (error) {
            console.error('Emergency initialization failed:', error);
            alert('DR Interface initialization failed. Please refresh the page and try again.');
        }
    }
}

function ASNData() {
    console.log('ASNData() called - initializing DR Interface');
    try {
        window.drInterface = new DRInterface();
        console.log('DR Interface initialized successfully');
    } catch (error) {
        console.error('Failed to initialize DR Interface:', error);
    }
}

// Immediate initialization attempt
console.log('Starting DR Interface initialization...');
try {
    window.drInterface = new DRInterface();
    console.log('DR Interface initialized immediately');
} catch (error) {
    console.log('Immediate initialization failed, will try on DOM ready:', error.message);
}

// Also initialize when DOM is ready as a fallback
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - checking if DR Interface needs initialization');
    if (typeof window.drInterface === 'undefined' || !window.drInterface) {
        console.log('DR Interface not initialized, initializing now...');
        ASNData();
    }
});

// Another fallback - initialize after a short delay
setTimeout(() => {
    if (typeof window.drInterface === 'undefined' || !window.drInterface) {
        console.log('Delayed initialization attempt...');
        try {
            window.drInterface = new DRInterface();
            console.log('DR Interface initialized via timeout');
        } catch (error) {
            console.error('Delayed initialization failed:', error);
        }
    }
}, 1000);





