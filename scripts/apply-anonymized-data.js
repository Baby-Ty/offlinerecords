/**
 * Script to apply anonymized data for demo mode
 * This script replaces real patient data with realistic but fictional data
 */

// Load the anonymized data
import('../js/anonymized-fallback-data.js').then(module => {
    const anonymizedData = module.default || module;
    
    // Replace the global fallback data
    if (typeof window !== 'undefined') {
        window.FALLBACK_DATA = anonymizedData;
        window.ANONYMIZED_MODE = true;
        
        console.log('✅ Anonymized data loaded successfully');
        console.log('📊 Demo now uses fictional patient data:');
        console.log(`   - ${anonymizedData.residents.length} anonymized residents`);
        console.log(`   - ${Object.keys(anonymizedData.facilities || {}).length} demo facilities`);
        console.log(`   - All names, IDs, and medical data are fictional`);
        
        // Trigger a refresh of any displayed data
        if (typeof refreshResidentsList === 'function') {
            refreshResidentsList();
        }
        
        // Update any facility references
        updateFacilityReferences();
    }
});

/**
 * Update facility references from RUSSLL_* to DEMO_*
 */
function updateFacilityReferences() {
    // Update any DOM elements that reference the old facility names
    const facilityMap = {
        'RUSSLL_DAY': 'DEMO_DAY',
        'RUSSLL_LTC': 'DEMO_LTC', 
        'RUSSLL_OP': 'DEMO_OP',
        'RUSSLL_RC': 'DEMO_RC'
    };
    
    // Update text content in DOM
    document.querySelectorAll('[data-facility]').forEach(element => {
        const oldFacility = element.getAttribute('data-facility');
        if (facilityMap[oldFacility]) {
            element.setAttribute('data-facility', facilityMap[oldFacility]);
        }
    });
    
    // Update any facility display names
    document.querySelectorAll('.facility-name').forEach(element => {
        const text = element.textContent;
        Object.keys(facilityMap).forEach(oldName => {
            if (text.includes(oldName)) {
                element.textContent = text.replace(oldName, facilityMap[oldName]);
            }
        });
    });
    
    console.log('🏥 Facility references updated to demo facilities');
}

/**
 * Add a banner to indicate demo mode with anonymized data
 */
function addAnonymizedBanner() {
    const banner = document.createElement('div');
    banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: white;
        padding: 8px 16px;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;
    banner.innerHTML = `
        🔒 <strong>DEMO MODE</strong> - All patient data shown is fictional and anonymized for demonstration purposes
    `;
    
    document.body.insertBefore(banner, document.body.firstChild);
    
    // Adjust body padding to account for banner
    document.body.style.paddingTop = '40px';
}

// Auto-apply anonymized data when the script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        addAnonymizedBanner();
    });
} else {
    addAnonymizedBanner();
}

export { updateFacilityReferences, addAnonymizedBanner };
