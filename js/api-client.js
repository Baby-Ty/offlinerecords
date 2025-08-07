/**
 * API Client for Medical Records Backend Service
 */
class ApiClient {
    constructor(baseUrl = 'http://localhost:3001') {
        this.baseUrl = baseUrl;
        this.isOnline = true;
        this.cache = new Map();
        this.fallbackData = null;
    }

    async checkConnection() {
        try {
            const response = await fetch(`${this.baseUrl}/health`, {
                method: 'GET',
                timeout: 5000
            });
            this.isOnline = response.ok;
            return this.isOnline;
        } catch (error) {
            console.warn('API connection failed:', error);
            this.isOnline = false;
            return false;
        }
    }

    async getResidents() {
        const cacheKey = 'residents';
        
        // Try API first if online
        if (this.isOnline) {
            try {
                const response = await fetch(`${this.baseUrl}/residents`);
                if (response.ok) {
                    const data = await response.json();
                    this.cache.set(cacheKey, data);
                    this.saveFallbackData(cacheKey, data);
                    return data;
                }
            } catch (error) {
                console.warn('Failed to fetch from API:', error);
                this.isOnline = false;
            }
        }

        // Fall back to cached data
        if (this.cache.has(cacheKey)) {
            console.log('Using cached residents data');
            return this.cache.get(cacheKey);
        }

        // Prioritize anonymized fallback data for demo mode
        let offlineData = null;
        
        // Always use anonymized fallback data if available (for demo safety)
        if (typeof window !== 'undefined' && window.FALLBACK_DATA && window.FALLBACK_DATA.status?.dataType === 'DEMO_ANONYMIZED') {
            offlineData = window.FALLBACK_DATA.residentsList;
            console.log('Using anonymized demo fallback data');
        } else {
            // Fall back to cached data only if no anonymized data available
            offlineData = this.loadFallbackData(cacheKey);
            if (!offlineData && typeof window !== 'undefined' && window.FALLBACK_DATA) {
                offlineData = window.FALLBACK_DATA.residentsList;
                console.log('Using fallback data');
            }
        }
        
        if (offlineData) {
            console.log('Using offline fallback data');
            return offlineData;
        }

        // Return empty structure if no data available
        return {
            lastUpdated: null,
            totalResidents: 0,
            facilitiesProcessed: 0,
            residents: []
        };
    }

    async getResident(residentId) {
        const cacheKey = `resident_${residentId}`;
        
        // Try API first if online
        if (this.isOnline) {
            try {
                const response = await fetch(`${this.baseUrl}/residents/${residentId}`);
                if (response.ok) {
                    const data = await response.json();
                    this.cache.set(cacheKey, data);
                    this.saveFallbackData(cacheKey, data);
                    return data;
                }
            } catch (error) {
                console.warn(`Failed to fetch resident ${residentId}:`, error);
                this.isOnline = false;
            }
        }

        // Fall back to cached data
        if (this.cache.has(cacheKey)) {
            console.log(`Using cached data for resident ${residentId}`);
            return this.cache.get(cacheKey);
        }

        // Prioritize anonymized fallback data for demo mode
        let offlineData = null;
        
        // Always use anonymized fallback data if available (for demo safety)
        if (typeof window !== 'undefined' && window.FALLBACK_DATA && window.FALLBACK_DATA.status?.dataType === 'DEMO_ANONYMIZED') {
            offlineData = window.FALLBACK_DATA.residentDetails[residentId];
            if (offlineData) {
                console.log(`Using anonymized demo data for resident ${residentId}`);
            }
        } else {
            // Fall back to cached data only if no anonymized data available
            offlineData = this.loadFallbackData(cacheKey);
            if (!offlineData && typeof window !== 'undefined' && window.FALLBACK_DATA) {
                offlineData = window.FALLBACK_DATA.residentDetails[residentId];
                if (offlineData) {
                    console.log(`Using fallback data for resident ${residentId}`);
                }
            }
        }
        
        if (offlineData) {
            console.log(`Using offline data for resident ${residentId}`);
            return offlineData;
        }

        return null;
    }

    async getStatus() {
        const cacheKey = 'status';
        
        // Try API first if online
        if (this.isOnline) {
            try {
                const response = await fetch(`${this.baseUrl}/status`);
                if (response.ok) {
                    const data = await response.json();
                    this.cache.set(cacheKey, data);
                    return data;
                }
            } catch (error) {
                console.warn('Failed to fetch status:', error);
                this.isOnline = false;
            }
        }

        // Return offline status
        return {
            status: 'offline',
            lastProcessed: this.cache.has('residents') ? 
                this.cache.get('residents').lastUpdated : null,
            totalResidents: this.cache.has('residents') ? 
                this.cache.get('residents').totalResidents : 0,
            facilitiesProcessed: this.cache.has('residents') ? 
                this.cache.get('residents').facilitiesProcessed : 0,
            timestamp: new Date().toISOString(),
            mode: 'cached/offline'
        };
    }

    setOfflineMode(offline = true) {
        this.isOnline = !offline;
        console.log(`API client set to ${offline ? 'offline' : 'online'} mode`);
    }

    saveFallbackData(key, data) {
        try {
            localStorage.setItem(`dr_fallback_${key}`, JSON.stringify({
                data,
                timestamp: new Date().toISOString()
            }));
        } catch (error) {
            console.warn('Failed to save fallback data:', error);
        }
    }

    loadFallbackData(key) {
        try {
            const stored = localStorage.getItem(`dr_fallback_${key}`);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Check if data is less than 24 hours old
                const dataAge = Date.now() - new Date(parsed.timestamp).getTime();
                if (dataAge < 24 * 60 * 60 * 1000) { // 24 hours
                    return parsed.data;
                }
            }
        } catch (error) {
            console.warn('Failed to load fallback data:', error);
        }
        return null;
    }

    // Preload fallback data from existing static files if available
    async initializeFallbackData() {
        try {
            // Try to load from existing offline data structure
            const facilities = ['DEMO_DAY', 'DEMO_LTC', 'DEMO_OP', 'DEMO_RC'];
            const fallbackResidents = [];

            // This would be replaced with actual implementation
            // For now, we'll just initialize empty fallback data
            console.log('Fallback data initialization completed');
            
        } catch (error) {
            console.warn('Failed to initialize fallback data:', error);
        }
    }

    clearCache() {
        this.cache.clear();
        // Clear localStorage fallback data
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('dr_fallback_')) {
                localStorage.removeItem(key);
            }
        });
        console.log('Cache and fallback data cleared');
    }
}

// Create global API client instance
const apiClient = new ApiClient();
