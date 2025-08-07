/**
 * Emergency Medical Records Interface - Modern JavaScript
 * Clean, fast, and accessible medical records access during outages
 */

class EmergencyRecordsApp {
  constructor() {
    this.state = {
      selectedFacility: null,
      selectedRecordType: null,
      currentView: 'record-selection',
      isLoading: false
    };
    
    // Data cache
    this.cache = {
      facilityData: new Map(),
      recordCounts: new Map()
    };
    
    // DOM elements
    this.elements = {};
    
    this.init();
  }

  async init() {
    try {
      this.bindElements();
      this.attachEventListeners();
      this.setupKeyboardShortcuts();
      await this.loadInitialData();
      this.updateLastModified();
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.showError('Failed to initialize application');
    }
  }

  bindElements() {
    // Main sections
    this.elements.recordTypes = document.getElementById('recordTypes');
    this.elements.facilitySelection = document.getElementById('facilitySelection');
    this.elements.facilityGrid = document.getElementById('facilityGrid');
    
    // Controls
    this.elements.helpBtn = document.getElementById('helpBtn');
    this.elements.closeHelp = document.getElementById('closeHelp');
    this.elements.printBtn = document.getElementById('printBtn');
    
    // Overlays
    this.elements.loadingOverlay = document.getElementById('loadingOverlay');
    this.elements.loadingText = document.getElementById('loadingText');
    this.elements.helpModal = document.getElementById('helpModal');
    
    // Status
    this.elements.lastUpdated = document.getElementById('lastUpdated');
    
    // Record count elements (initial display)
    this.elements.facesheetCount = document.getElementById('facesheetCount');
    this.elements.medCount = document.getElementById('medCount');
    this.elements.treCount = document.getElementById('treCount');
    this.elements.othCount = document.getElementById('othCount');
    
    // Facility count elements
    this.elements.rcCount = document.getElementById('rcCount');
    this.elements.dayCount = document.getElementById('dayCount');
    this.elements.ltcCount = document.getElementById('ltcCount');
    this.elements.opCount = document.getElementById('opCount');
  }

  attachEventListeners() {
    // Record type selection (first step)
    document.addEventListener('click', (e) => {
      const recordCard = e.target.closest('.record-card');
      if (recordCard && this.state.currentView === 'record-selection') {
        this.selectRecordType(recordCard.dataset.type);
      }
    });

    // Facility selection (second step)
    this.elements.facilityGrid?.addEventListener('click', (e) => {
      const card = e.target.closest('.facility-card');
      if (card && this.state.currentView === 'facility-selection') {
        this.selectFacility(card.dataset.facility);
      }
    });



    // Modal controls
    this.elements.helpBtn?.addEventListener('click', () => {
      this.showHelp();
    });

    this.elements.closeHelp?.addEventListener('click', () => {
      this.hideHelp();
    });



    // Print functionality
    this.elements.printBtn?.addEventListener('click', () => {
      window.print();
    });

    // Close modals on backdrop click
    this.elements.helpModal?.addEventListener('click', (e) => {
      if (e.target === this.elements.helpModal) {
        this.hideHelp();
      }
    });
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // ESC key - close modals or go back
      if (e.key === 'Escape') {
        if (this.elements.helpModal?.classList.contains('visible')) {
          this.hideHelp();
        } else if (this.state.currentView !== 'record-selection') {
          this.goBack();
        }
      }
      

      
      // Enter key - select highlighted item (if any)
      if (e.key === 'Enter') {
        const focused = document.activeElement;
        if (focused?.classList.contains('record-card') || 
            focused?.classList.contains('facility-card')) {
          focused.click();
        }
      }
    });
  }

  async loadInitialData() {
    this.showLoading('Loading facility data...');
    
    try {
      // Load available facilities and record counts
      await this.loadFacilityData();
      await this.loadRecordCounts();
    } catch (error) {
      console.error('Error loading initial data:', error);
      this.showError('Failed to load facility data');
    } finally {
      this.hideLoading();
    }
  }

  async loadFacilityData() {
    // In a real implementation, this would fetch from an API or index file
    // For now, we'll use the known facility structure
    const facilities = [
      { id: 'RUSSLL_RC', name: 'Russell Park RC', description: 'Residential Care', icon: '🏥' },
      { id: 'RUSSLL_DAY', name: 'Russell Park Day', description: 'Day Programs', icon: '☀️' },
      { id: 'RUSSLL_LTC', name: 'Russell Park LTC', description: 'Long Term Care', icon: '🛏️' },
      { id: 'RUSSLL_OP', name: 'Russell Park OP', description: 'Outpatient Services', icon: '🚶' }
    ];
    
    // Store in cache
    facilities.forEach(facility => {
      this.cache.facilityData.set(facility.id, facility);
    });
  }

  async loadRecordCounts() {
    // This would typically check the actual files in the offline data directory
    // For demo purposes, we'll simulate record counts
    const recordTypes = ['Facesheet', 'MED', 'TRE', 'OTH'];
    
    for (const facility of this.cache.facilityData.keys()) {
      for (const recordType of recordTypes) {
        // Simulate checking file existence and record counts
        const count = Math.floor(Math.random() * 15) + 5; // 5-20 records
        this.cache.recordCounts.set(`${facility}_${recordType}`, count);
      }
    }
  }

  async selectRecordType(recordType) {
    // Clear previous selection
    document.querySelectorAll('.record-card').forEach(card => {
      card.classList.remove('selected');
    });
    
    // Select new record type
    const selectedCard = document.querySelector(`[data-type="${recordType}"]`);
    if (selectedCard) {
      selectedCard.classList.add('selected');
      this.state.selectedRecordType = recordType;
      
      // Update facility counts for this record type
      this.updateFacilityCounts(recordType);
      
      // Show facility selection with animation
      setTimeout(() => {
        this.showFacilitySelection();
      }, 300);
    }
  }

  selectFacility(facilityId) {
    // Clear previous selection
    document.querySelectorAll('.facility-card').forEach(card => {
      card.classList.remove('selected');
    });
    
    // Select new facility
    const selectedCard = document.querySelector(`[data-facility="${facilityId}"]`);
    if (selectedCard) {
      selectedCard.classList.add('selected');
      this.state.selectedFacility = facilityId;
      
      // Open the record directly
      setTimeout(() => {
        this.openRecord();
      }, 300);
    }
  }

  updateFacilityCounts(recordType) {
    const counts = {
      'RUSSLL_RC': this.cache.recordCounts.get(`RUSSLL_RC_${recordType}`) || 0,
      'RUSSLL_DAY': this.cache.recordCounts.get(`RUSSLL_DAY_${recordType}`) || 0,
      'RUSSLL_LTC': this.cache.recordCounts.get(`RUSSLL_LTC_${recordType}`) || 0,
      'RUSSLL_OP': this.cache.recordCounts.get(`RUSSLL_OP_${recordType}`) || 0
    };

    if (this.elements.rcCount) {
      this.elements.rcCount.textContent = `${counts.RUSSLL_RC} ${recordType} records`;
    }
    if (this.elements.dayCount) {
      this.elements.dayCount.textContent = `${counts.RUSSLL_DAY} ${recordType} records`;
    }
    if (this.elements.ltcCount) {
      this.elements.ltcCount.textContent = `${counts.RUSSLL_LTC} ${recordType} records`;
    }
    if (this.elements.opCount) {
      this.elements.opCount.textContent = `${counts.RUSSLL_OP} ${recordType} records`;
    }
  }

  showFacilitySelection() {
    this.elements.facilitySelection.style.display = 'block';
    this.state.currentView = 'facility-selection';
    
    // Smooth scroll to facility selection
    this.elements.facilitySelection.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }


  openRecord() {
    if (!this.state.selectedFacility || !this.state.selectedRecordType) return;
    
    this.showLoading('Opening medical records...');
    
    // Build the path to the record file
    const recordPath = `offline data/${this.state.selectedFacility}/${this.getRecordFileName(this.state.selectedRecordType)}`;
    
    // Store selection in session storage
    sessionStorage.setItem('selectedFacility', this.state.selectedFacility);
    sessionStorage.setItem('selectedRecordType', this.state.selectedRecordType);
    
    // Short delay to show loading, then open the record
    setTimeout(() => {
      this.hideLoading();
      window.open(recordPath, '_blank');
    }, 500);
  }

  getRecordFileName(recordType) {
    const fileMap = {
      'Facesheet': 'Facesheet_data.html',
      'MED': 'MED_data.html',
      'TRE': 'TRE_data.html',
      'OTH': 'Oth_data.html'
    };
    return fileMap[recordType] || 'Facesheet_data.html';
  }

  goBack() {
    switch (this.state.currentView) {
      case 'facility-selection':
        this.hideFacilitySelection();
        this.clearRecordTypeSelection();
        this.state.currentView = 'record-selection';
        break;
    }
  }

  hideFacilitySelection() {
    this.elements.facilitySelection.style.display = 'none';
    this.clearFacilitySelection();
  }

  clearRecordTypeSelection() {
    document.querySelectorAll('.record-card').forEach(card => {
      card.classList.remove('selected');
    });
    this.state.selectedRecordType = null;
  }

  clearFacilitySelection() {
    document.querySelectorAll('.facility-card').forEach(card => {
      card.classList.remove('selected');
    });
    this.state.selectedFacility = null;
  }

  showLoading(message = 'Loading...') {
    this.state.isLoading = true;
    if (this.elements.loadingText) {
      this.elements.loadingText.textContent = message;
    }
    this.elements.loadingOverlay.classList.add('visible');
  }

  hideLoading() {
    this.state.isLoading = false;
    this.elements.loadingOverlay.classList.remove('visible');
  }

  showHelp() {
    this.elements.helpModal.classList.add('visible');
  }

  hideHelp() {
    this.elements.helpModal.classList.remove('visible');
  }

  showError(message) {
    // In a real implementation, you might show a toast notification or error modal
    console.error(message);
    alert(`Error: ${message}`);
  }

  updateLastModified() {
    if (this.elements.lastUpdated) {
      this.elements.lastUpdated.textContent = new Date().toLocaleString();
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.emergencyRecordsApp = new EmergencyRecordsApp();
});

// Legacy compatibility functions for existing record files
window.ASNData = function() {
  console.log('Legacy ASNData function called');
};

window.LogOut = function() {
  if (confirm('Are you sure you want to exit the Emergency Records system?')) {
    window.location.reload();
  }
};

window.ShowBox = function(boxId) {
  const modal = document.getElementById(boxId);
  if (modal) {
    modal.classList.add('visible');
  }
};

window.CloseBox = function(boxId) {
  const modal = document.getElementById(boxId);
  if (modal) {
    modal.classList.remove('visible');
  }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EmergencyRecordsApp;
}