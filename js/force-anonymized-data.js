/**
 * Force Anonymized Data Script
 * This script ensures that only anonymized demo data is used, 
 * clearing any cached real patient data for privacy protection
 */

// Clear any cached real patient data immediately on load
(function() {
    'use strict';
    
    console.log('🔒 Forcing anonymized data mode...');
    
    // Clear localStorage that might contain real patient data
    if (typeof localStorage !== 'undefined') {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('dr_fallback_') || 
                key.includes('resident') || 
                key.includes('RUSSLL')) {
                localStorage.removeItem(key);
                console.log(`Cleared cached data: ${key}`);
            }
        });
    }
    
    // Clear sessionStorage as well
    if (typeof sessionStorage !== 'undefined') {
        const keys = Object.keys(sessionStorage);
        keys.forEach(key => {
            if (key.startsWith('dr_fallback_') || 
                key.includes('resident') || 
                key.includes('RUSSLL')) {
                sessionStorage.removeItem(key);
                console.log(`Cleared session data: ${key}`);
            }
        });
    }
    
    // Ensure API client cache is cleared when it's available
    document.addEventListener('DOMContentLoaded', function() {
        // Wait a moment for apiClient to be initialized
        setTimeout(function() {
            if (typeof window.apiClient !== 'undefined' && window.apiClient.clearCache) {
                window.apiClient.clearCache();
                console.log('Cleared API client cache');
            }
        }, 100);
    });
    
    console.log('✅ Anonymized data mode enforced - only demo data will be displayed');
})();
