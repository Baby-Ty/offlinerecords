/**
 * Main Application Logic for Medical Records Interface
 */

// Global state
let currentResident = null;
let allResidents = [];
let facilities = new Set();
let currentFilter = {
    facility: 'all'
};
let viewMode = 'table'; // 'table' | 'cards'

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing Medical Records Interface...');
    
    // Initialize API client fallback data
    await apiClient.initializeFallbackData();
    
    // Check API connection status
    await updateConnectionStatus();
    
    // Load initial data
    await loadResidents();
    
    // Set up periodic status updates
    setInterval(updateConnectionStatus, 30000); // Every 30 seconds
    
    // Set up event listeners
    setupEventListeners();
    
    console.log('Application initialized successfully');
});

function setupEventListeners() {
    // Facility card selection
    document.addEventListener('click', (e) => {
        const facilityCard = e.target.closest('.facility-card-btn');
        if (facilityCard) {
            selectFacility(facilityCard.dataset.facility);
        }
    });
    
    // Handle window resize for responsive design
    window.addEventListener('resize', debounce(() => {
        // Recalculate grid layout if needed
        console.log('Window resized, adjusting layout...');
    }, 250));
}

async function updateConnectionStatus() {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    
    const isOnline = await apiClient.checkConnection();
    
    if (statusDot) {
        statusDot.classList.toggle('offline', !isOnline);
    }
    if (statusText) {
        statusText.textContent = isOnline ? 'Connected to API' : 'Offline Mode';
    }
    
    // Update last update timestamp
    try {
        const status = await apiClient.getStatus();
        const lastUpdate = document.getElementById('lastUpdate');
        if (lastUpdate) {
            if (status.lastProcessed) {
                const date = new Date(status.lastProcessed);
                lastUpdate.textContent = `Last Update: ${date.toLocaleString()}`;
            } else {
                lastUpdate.textContent = 'Last Update: Never';
            }
        }
    } catch (error) {
        console.warn('Could not fetch status:', error);
    }
}

async function loadResidents() {
    const content = document.getElementById('content');
    const refreshBtn = document.getElementById('refreshBtn');
    
    // Show loading state
    content.innerHTML = '<div class="loading"><p>Loading residents...</p></div>';
    refreshBtn.disabled = true;
    
    try {
        const data = await apiClient.getResidents();
        allResidents = data.residents || [];
        
        // Extract unique facilities
        facilities.clear();
        allResidents.forEach(resident => {
            if (resident.facility) {
                facilities.add(resident.facility);
            }
        });
        
        // Update facility cards
        updateFacilityCards();
        
        // Display residents (and summary counts)
        filterAndDisplayResidents();
        
        console.log(`Loaded ${allResidents.length} residents from ${facilities.size} facilities`);
        
    } catch (error) {
        console.error('Error loading residents:', error);
        content.innerHTML = `
            <div class="error">
                <h3>Failed to Load Data</h3>
                <p>Could not load resident data. Please check your connection and try again.</p>
                <p>Error: ${error.message}</p>
            </div>
        `;
    } finally {
        refreshBtn.disabled = false;
    }
}

function updateFacilityCards() {
    const facilityCardsGrid = document.getElementById('facilityCardsGrid');
    
    if (!facilityCardsGrid) {
        console.warn('Facility cards grid not found');
        return;
    }
    
    // Clear existing cards
    facilityCardsGrid.innerHTML = '';
    
    // Add "All Facilities" card first
    const allCard = createFacilityCard('all', 'All Facilities', '🏥', 'All Facilities', 'ALL');
    facilityCardsGrid.appendChild(allCard);
    
    // Add facility cards
    Array.from(facilities).sort().forEach(facility => {
        const facilityInfo = getFacilityDisplayInfo(facility);
        const facilityCard = createFacilityCard(facility, facilityInfo.name, facilityInfo.icon, facilityInfo.description, facilityInfo.badge);
        facilityCardsGrid.appendChild(facilityCard);
    });
}

function createFacilityCard(facilityId, name, icon, description, badge) {
    const card = document.createElement('div');
    card.className = 'facility-card-btn';
    card.dataset.facility = facilityId;
    
    // Set selected state for "all" by default
    if (facilityId === 'all' && currentFilter.facility === 'all') {
        card.classList.add('selected');
    }
    
    card.innerHTML = `
        <div class="facility-icon">${icon}</div>
        <div class="facility-name">${name}</div>
        <div class="facility-description">${description}</div>
        <div class="facility-badge">${badge}</div>
    `;
    
    return card;
}

// Facility display name mapping
function getFacilityDisplayInfo(facilityId) {
    const facilityMap = {
        // Protea Valley facility codes
        'PROTEA_LTC': {
            name: 'Long Term Care',
            description: 'Extended Care Services',
            icon: '🏨',
            badge: 'LTC'
        },
        'PROTEA_RC': {
            name: 'Residential Care',
            description: 'Rehabilitation Services',
            icon: '🏥',
            badge: 'RC'
        },
        'PROTEA_DAY': {
            name: 'Day Services',
            description: 'Day Programs & Services',
            icon: '📅',
            badge: 'DAY'
        },
        'PROTEA_OP': {
            name: 'Outpatient',
            description: 'Outpatient Services',
            icon: '📋',
            badge: 'OP'
        },
        // Legacy DEMO facility codes (for compatibility)
        'DEMO_LTC': {
            name: 'Long Term Care',
            description: 'Extended Care Services',
            icon: '🏨',
            badge: 'LTC'
        },
        'DEMO_RC': {
            name: 'Residential Care',
            description: 'Rehabilitation Services',
            icon: '🏥',
            badge: 'RC'
        },
        'DEMO_DAY': {
            name: 'Day Services',
            description: 'Day Programs & Services',
            icon: '📅',
            badge: 'DAY'
        },
        'DEMO_OP': {
            name: 'Outpatient Services',
            description: 'OP Services ',
            icon: '📋',
            badge: 'OP'
        },
        // Legacy RUSSLL facility codes (for compatibility)
        'RUSSLL_LTC': {
            name: 'Long Term Care',
            description: 'Extended Care Services',
            icon: '🏨',
            badge: 'LTC'
        },
        'RUSSLL_RC': {
            name: 'Residential Care',
            description: 'Rehabilitation Services',
            icon: '🏥',
            badge: 'RC'
        },
        'RUSSLL_OP': {
            name: 'Services',
            description: 'Day Programs & Services',
            icon: '☀️',
            badge: 'DAY'
        },
        'RUSSLL_DAY': {
            name: 'Services',
            description: 'Day Programs & Services',
            icon: '☀️',
            badge: 'DAY'
        }
    };
    
    return facilityMap[facilityId] || {
        name: facilityId,
        description: facilityId,
        icon: '🏢',
        badge: facilityId.split('_')[1] || facilityId
    };
}

function selectFacility(facilityId) {
    // Remove selected class from all cards
    document.querySelectorAll('.facility-card-btn').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to clicked card
    const selectedCard = document.querySelector(`[data-facility="${facilityId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Update filter and refresh display
    currentFilter.facility = facilityId;
    filterAndDisplayResidents();
}

function filterAndDisplayResidents() {
    const filteredResidents = allResidents.filter(resident => {
        // Filter by facility only (record type filter removed)
        if (currentFilter.facility !== 'all') {
            if (resident.facility !== currentFilter.facility) return false;
        }
        
        return true;
    });
    
    displayResidents(filteredResidents);
    // Update summary counts for current filter
    displaySummaryCounts(filteredResidents);
}

function displayResidents(residents) {
    const content = document.getElementById('content');
    
    if (residents.length === 0) {
        content.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 40px; color: #6c757d;">
                <h3>No Residents Found</h3>
                <p>No residents match the current filter criteria.</p>
            </div>
        `;
        return;
    }
    
    content.innerHTML = '';
    if (viewMode === 'table') {
        const table = ResidentTable.create(residents);
        content.appendChild(table);
    } else {
        const grid = document.createElement('div');
        grid.className = 'resident-grid';
        residents.forEach(resident => {
            const card = ResidentProfileCard.create(resident);
            if (card) grid.appendChild(card);
        });
        content.appendChild(grid);
    }
}

function toggleViewMode() {
    viewMode = viewMode === 'table' ? 'cards' : 'table';
    const btn = document.getElementById('viewToggleBtn');
    if (btn) {
        if (viewMode === 'table') {
            btn.innerHTML = '🗂 <span>Cards</span>';
        } else {
            btn.innerHTML = '📋 <span>Table</span>';
        }
    }
    filterAndDisplayResidents();
}

function displaySummaryCounts(residentsForSummary) {
    const content = document.getElementById('content');
    if (!content) return;

    const residents = Array.isArray(residentsForSummary) ? residentsForSummary : allResidents;
    const facilitiesCount = new Set(residents.map(r => r.facility).filter(Boolean)).size;

    const counts = {
        'Total Residents': residents.length,
        'Facilities': facilitiesCount,
        'With Medications': residents.filter(r => r.hasData?.medications).length,
        'With Orders': residents.filter(r => r.hasData?.orders).length
    };

    let countsContainer = document.getElementById('countsSummary');
    if (!countsContainer) {
        countsContainer = document.createElement('div');
        countsContainer.id = 'countsSummary';
        countsContainer.className = 'counts-summary';
        // If there's existing content (like grid), insert before it
        content.insertBefore(countsContainer, content.firstChild || null);
    }

    // Re-render cards
    countsContainer.innerHTML = '';
    Object.entries(counts).forEach(([label, count]) => {
        const countCard = document.createElement('div');
        countCard.className = 'count-card';
        countCard.innerHTML = `
            <span class="count-number">${count}</span>
            <span class="count-label">${label}</span>
        `;
        countsContainer.appendChild(countCard);
    });

    // Ensure summary stays at top
    if (content.firstChild !== countsContainer) {
        content.insertBefore(countsContainer, content.firstChild);
    }
}

async function showResidentDetail(residentId) {
    const content = document.getElementById('content');
    
    // Show loading state
    content.innerHTML = '<div class="loading"><p>Loading resident details...</p></div>';
    
    try {
        const resident = await apiClient.getResident(residentId);
        
        if (!resident) {
            throw new Error('Resident not found');
        }
        
        currentResident = resident;
        displayResidentDetail(resident);
        
    } catch (error) {
        console.error('Error loading resident detail:', error);
        content.innerHTML = `
            <div class="error">
                <h3>Failed to Load Resident</h3>
                <p>Could not load details for resident ${residentId}.</p>
                <p>Error: ${error.message}</p>
                <button class="back-button" onclick="loadResidents()">← Back to List</button>
            </div>
        `;
    }
}

function displayResidentDetail(resident) {
    const content = document.getElementById('content');
    
    const detailContainer = document.createElement('div');
    detailContainer.innerHTML = `
        <button class="back-button" onclick="loadResidents()">← Back to Residents</button>
        
        <div class="resident-detail-header" style="margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; border-radius: 8px;">
            <h2 style="margin: 0 0 10px 0;">${resident.Name || 'Unknown Name'}</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                <div><strong>ID:</strong> ${resident.ResidentID}</div>
                <div><strong>Facility:</strong> ${resident.facility || 'Unknown'}</div>
                <div><strong>Age:</strong> ${resident.facesheet?.Age || 'Unknown'}</div>
                <div><strong>DOB:</strong> ${resident.facesheet?.BirthDate || 'Unknown'}</div>
            </div>
        </div>
        
        <div id="recordSections"></div>
    `;
    
    content.innerHTML = '';
    content.appendChild(detailContainer);
    
    // Add record sections
    const sectionsContainer = document.getElementById('recordSections');
    
    // Facesheet section
    if (resident.facesheet && Object.keys(resident.facesheet).length > 0) {
        sectionsContainer.appendChild(createRecordSection(
            'Face Sheet', 
            createFacesheetDisplay(resident.facesheet),
            'facesheet'
        ));
    }
    
    // Medications section
    if (resident.medications && resident.medications.length > 0) {
        sectionsContainer.appendChild(createRecordSection(
            `Medications (${resident.medications.length})`,
            MedicationTable.create(resident.medications),
            'medications'
        ));
    }
    
    // Treatments section
    if (resident.treatments && resident.treatments.length > 0) {
        sectionsContainer.appendChild(createRecordSection(
            `Treatments (${resident.treatments.length})`,
            TreatmentTimeline.create(resident.treatments),
            'treatments'
        ));
    }
    
    // Orders section
    if (resident.orders && resident.orders.length > 0) {
        sectionsContainer.appendChild(createRecordSection(
            `Orders (${resident.orders.length})`,
            OrderList.create(resident.orders),
            'orders'
        ));
    }
}

function createRecordSection(title, content, sectionId) {
    const section = document.createElement('div');
    section.className = 'record-detail';
    
    const header = document.createElement('div');
    header.className = 'record-header';
    header.innerHTML = `
        ${title}
        <span class="expand-icon">▼</span>
    `;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'record-content';
    contentDiv.appendChild(content);
    
    // Toggle functionality
    header.addEventListener('click', () => {
        const icon = header.querySelector('.expand-icon');
        if (contentDiv.classList.contains('active')) {
            contentDiv.classList.remove('active');
            icon.classList.remove('expanded');
        } else {
            contentDiv.classList.add('active');
            icon.classList.add('expanded');
        }
    });
    
    section.appendChild(header);
    section.appendChild(contentDiv);
    
    return section;
}

function createFacesheetDisplay(facesheet) {
    const container = document.createElement('div');
    container.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;';
    
    // Demographic information
    const demographics = document.createElement('div');
    demographics.innerHTML = `
        <h4 style="color: #495057; border-bottom: 2px solid #e9ecef; padding-bottom: 8px;">Demographics</h4>
        <div style="line-height: 1.6;">
            ${facesheet.ResidentName ? `<div><strong>Name:</strong> ${facesheet.ResidentName}</div>` : ''}
            ${facesheet.Age ? `<div><strong>Age:</strong> ${facesheet.Age}</div>` : ''}
            ${facesheet.BirthDate ? `<div><strong>DOB:</strong> ${facesheet.BirthDate}</div>` : ''}
            ${facesheet.Gender ? `<div><strong>Gender:</strong> ${facesheet.Gender}</div>` : ''}
            ${facesheet.MaritalStatusDesc ? `<div><strong>Marital Status:</strong> ${facesheet.MaritalStatusDesc}</div>` : ''}
        </div>
    `;
    
    // Medical information
    const medical = document.createElement('div');
    medical.innerHTML = `
        <h4 style="color: #495057; border-bottom: 2px solid #e9ecef; padding-bottom: 8px;">Medical Information</h4>
        <div style="line-height: 1.6;">
            ${facesheet.Allergies ? `<div><strong>Allergies:</strong> ${facesheet.Allergies}</div>` : ''}
            ${facesheet.AdmittingDiagICD1 ? `<div><strong>Primary Diagnosis:</strong> ${facesheet.AdmittingDiagICD1}</div>` : ''}
            ${facesheet.AdvancedDirectives ? `<div><strong>Advance Directives:</strong> ${facesheet.AdvancedDirectives}</div>` : ''}
            ${facesheet.LevelOfCare ? `<div><strong>Level of Care:</strong> ${facesheet.LevelOfCare}</div>` : ''}
        </div>
    `;
    
    container.appendChild(demographics);
    container.appendChild(medical);
    
    return container;
}

function toggleOfflineMode() {
    const isCurrentlyOnline = apiClient.isOnline;
    apiClient.setOfflineMode(isCurrentlyOnline);
    
    const button = document.getElementById('offlineBtn');
    if (isCurrentlyOnline) {
        button.textContent = '🌐 Online Mode';
        button.style.background = '#28a745';
    } else {
        button.textContent = '📴 Offline Mode';
        button.style.background = '#6c757d';
    }
    
    // Update status immediately
    updateConnectionStatus();
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatDate(dateString) {
    if (!dateString) return '';
    try {
        return new Date(dateString).toLocaleDateString();
    } catch {
        return dateString;
    }
}

// Global functions for HTML onclick events
window.showResidentDetail = showResidentDetail;
window.loadResidents = loadResidents;
window.toggleOfflineMode = toggleOfflineMode;
window.toggleViewMode = toggleViewMode;
