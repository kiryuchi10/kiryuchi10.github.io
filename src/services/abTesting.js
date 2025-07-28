/**
 * A/B Testing Service
 * Provides client-side functionality for A/B testing including
 * experiment assignment, conversion tracking, and variant management.
 */

class ABTestingService {
    constructor(apiBaseUrl = null) {
        // Use environment-specific API URL
        this.apiBaseUrl = apiBaseUrl || (
            process.env.NODE_ENV === 'production' 
                ? 'https://portfolio-backend-production-url.com/api/ab'
                : 'http://localhost:5000/api/ab'
        );
        
        this.cache = new Map();
        this.userId = this.generateUserId();
    }

    /**
     * Generate consistent user ID for A/B testing
     */
    generateUserId() {
        // Try to get existing user ID from localStorage
        let userId = localStorage.getItem('ab_user_id');
        
        if (!userId) {
            // Generate new user ID based on browser fingerprint
            const fingerprint = this.generateFingerprint();
            userId = this.hashString(fingerprint);
            localStorage.setItem('ab_user_id', userId);
        }
        
        return userId;
    }

    /**
     * Generate browser fingerprint for consistent user identification
     */
    generateFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('A/B Testing Fingerprint', 2, 2);
        
        const fingerprint = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            canvas.toDataURL()
        ].join('|');
        
        return fingerprint;
    }

    /**
     * Simple hash function for generating user IDs
     */
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }

    /**
     * Get variant assignment for an experiment
     */
    async getVariant(experimentId, options = {}) {
        try {
            // Check cache first
            const cacheKey = `variant_${experimentId}`;
            if (this.cache.has(cacheKey) && !options.forceRefresh) {
                return this.cache.get(cacheKey);
            }

            const response = await fetch(`${this.apiBaseUrl}/assign/${experimentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: this.userId,
                    ...options
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.status === 'success') {
                // Cache the result
                this.cache.set(cacheKey, data.variant);
                
                // Store in localStorage for persistence
                const assignments = this.getStoredAssignments();
                assignments[experimentId] = {
                    variant: data.variant,
                    assignedAt: new Date().toISOString(),
                    userId: data.user_id
                };
                localStorage.setItem('ab_assignments', JSON.stringify(assignments));
                
                return data.variant;
            } else {
                throw new Error(data.error || 'Failed to get variant assignment');
            }
        } catch (error) {
            console.error('Error getting variant assignment:', error);
            
            // Fallback to stored assignment or default
            const assignments = this.getStoredAssignments();
            if (assignments[experimentId]) {
                return assignments[experimentId].variant;
            }
            
            return 'control'; // Default fallback
        }
    }

    /**
     * Track conversion event
     */
    async trackConversion(experimentId, conversionType = 'default', conversionValue = 1.0) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/convert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    experiment_id: experimentId,
                    conversion_type: conversionType,
                    conversion_value: conversionValue,
                    user_id: this.userId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.status === 'success') {
                // Track conversion locally for analytics
                this.trackLocalConversion(experimentId, conversionType, conversionValue);
                return true;
            } else {
                throw new Error(data.error || 'Failed to track conversion');
            }
        } catch (error) {
            console.error('Error tracking conversion:', error);
            
            // Store conversion locally for retry
            this.storeFailedConversion(experimentId, conversionType, conversionValue);
            return false;
        }
    }

    /**
     * Get experiment results (for admin/analytics)
     */
    async getExperimentResults(experimentId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/results/${experimentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.status === 'success') {
                return data;
            } else {
                throw new Error(data.error || 'Failed to get experiment results');
            }
        } catch (error) {
            console.error('Error getting experiment results:', error);
            throw error;
        }
    }

    /**
     * Create new experiment (for admin)
     */
    async createExperiment(experimentData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/experiments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(experimentData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.status === 'success') {
                return data;
            } else {
                throw new Error(data.error || 'Failed to create experiment');
            }
        } catch (error) {
            console.error('Error creating experiment:', error);
            throw error;
        }
    }

    /**
     * Get all experiments (for admin)
     */
    async getExperiments() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/experiments`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.status === 'success') {
                return data.experiments;
            } else {
                throw new Error(data.error || 'Failed to get experiments');
            }
        } catch (error) {
            console.error('Error getting experiments:', error);
            throw error;
        }
    }

    /**
     * Update experiment status (for admin)
     */
    async updateExperimentStatus(experimentId, status) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/experiments/${experimentId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.status === 'success') {
                return data;
            } else {
                throw new Error(data.error || 'Failed to update experiment status');
            }
        } catch (error) {
            console.error('Error updating experiment status:', error);
            throw error;
        }
    }

    /**
     * Helper method to conditionally render content based on variant
     */
    async renderVariant(experimentId, variantContent, defaultContent = null) {
        try {
            const variant = await this.getVariant(experimentId);
            
            if (variantContent[variant]) {
                return variantContent[variant];
            } else if (defaultContent) {
                return defaultContent;
            } else {
                return variantContent['control'] || '';
            }
        } catch (error) {
            console.error('Error rendering variant:', error);
            return defaultContent || variantContent['control'] || '';
        }
    }

    /**
     * Helper method to conditionally execute code based on variant
     */
    async executeForVariant(experimentId, variantCallbacks, defaultCallback = null) {
        try {
            const variant = await this.getVariant(experimentId);
            
            if (variantCallbacks[variant] && typeof variantCallbacks[variant] === 'function') {
                return variantCallbacks[variant]();
            } else if (defaultCallback && typeof defaultCallback === 'function') {
                return defaultCallback();
            } else if (variantCallbacks['control'] && typeof variantCallbacks['control'] === 'function') {
                return variantCallbacks['control']();
            }
        } catch (error) {
            console.error('Error executing variant callback:', error);
            if (defaultCallback && typeof defaultCallback === 'function') {
                return defaultCallback();
            }
        }
    }

    /**
     * Get stored assignments from localStorage
     */
    getStoredAssignments() {
        try {
            const stored = localStorage.getItem('ab_assignments');
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error parsing stored assignments:', error);
            return {};
        }
    }

    /**
     * Track conversion locally for analytics
     */
    trackLocalConversion(experimentId, conversionType, conversionValue) {
        try {
            const conversions = this.getStoredConversions();
            const key = `${experimentId}_${conversionType}`;
            
            if (!conversions[key]) {
                conversions[key] = [];
            }
            
            conversions[key].push({
                timestamp: new Date().toISOString(),
                value: conversionValue,
                userId: this.userId
            });
            
            localStorage.setItem('ab_conversions', JSON.stringify(conversions));
        } catch (error) {
            console.error('Error tracking local conversion:', error);
        }
    }

    /**
     * Store failed conversion for retry
     */
    storeFailedConversion(experimentId, conversionType, conversionValue) {
        try {
            const failed = this.getFailedConversions();
            failed.push({
                experimentId,
                conversionType,
                conversionValue,
                timestamp: new Date().toISOString(),
                userId: this.userId
            });
            
            localStorage.setItem('ab_failed_conversions', JSON.stringify(failed));
        } catch (error) {
            console.error('Error storing failed conversion:', error);
        }
    }

    /**
     * Get stored conversions from localStorage
     */
    getStoredConversions() {
        try {
            const stored = localStorage.getItem('ab_conversions');
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error parsing stored conversions:', error);
            return {};
        }
    }

    /**
     * Get failed conversions from localStorage
     */
    getFailedConversions() {
        try {
            const stored = localStorage.getItem('ab_failed_conversions');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error parsing failed conversions:', error);
            return [];
        }
    }

    /**
     * Retry failed conversions
     */
    async retryFailedConversions() {
        const failed = this.getFailedConversions();
        const successful = [];
        
        for (const conversion of failed) {
            try {
                const success = await this.trackConversion(
                    conversion.experimentId,
                    conversion.conversionType,
                    conversion.conversionValue
                );
                
                if (success) {
                    successful.push(conversion);
                }
            } catch (error) {
                console.error('Error retrying conversion:', error);
            }
        }
        
        // Remove successful conversions from failed list
        if (successful.length > 0) {
            const remaining = failed.filter(conv => 
                !successful.some(succ => 
                    succ.experimentId === conv.experimentId && 
                    succ.timestamp === conv.timestamp
                )
            );
            
            localStorage.setItem('ab_failed_conversions', JSON.stringify(remaining));
        }
        
        return successful.length;
    }

    /**
     * Clear all stored data (for testing/debugging)
     */
    clearStoredData() {
        localStorage.removeItem('ab_user_id');
        localStorage.removeItem('ab_assignments');
        localStorage.removeItem('ab_conversions');
        localStorage.removeItem('ab_failed_conversions');
        this.cache.clear();
        this.userId = this.generateUserId();
    }
}

// Create singleton instance
const abTestingService = new ABTestingService();

// Auto-retry failed conversions on page load
document.addEventListener('DOMContentLoaded', () => {
    abTestingService.retryFailedConversions().catch(error => {
        console.error('Error retrying failed conversions:', error);
    });
});

export default abTestingService;