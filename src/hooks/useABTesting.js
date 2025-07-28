/**
 * React Hook for A/B Testing
 * Provides easy integration of A/B testing functionality in React components
 */

import { useState, useEffect, useCallback } from 'react';
import abTestingService from '../services/abTesting';

/**
 * Hook for A/B testing variant assignment
 * @param {string} experimentId - The ID of the experiment
 * @param {Object} options - Additional options
 * @returns {Object} - Variant assignment and helper functions
 */
export const useABTest = (experimentId, options = {}) => {
    const [variant, setVariant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!experimentId) {
            setError('Experiment ID is required');
            setLoading(false);
            return;
        }

        const getVariant = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const assignedVariant = await abTestingService.getVariant(experimentId, options);
                setVariant(assignedVariant);
            } catch (err) {
                setError(err.message);
                setVariant('control'); // Fallback to control
            } finally {
                setLoading(false);
            }
        };

        getVariant();
    }, [experimentId, JSON.stringify(options)]);

    const trackConversion = useCallback(async (conversionType = 'default', conversionValue = 1.0) => {
        try {
            return await abTestingService.trackConversion(experimentId, conversionType, conversionValue);
        } catch (err) {
            console.error('Error tracking conversion:', err);
            return false;
        }
    }, [experimentId]);

    const isVariant = useCallback((targetVariant) => {
        return variant === targetVariant;
    }, [variant]);

    const isControl = useCallback(() => {
        return variant === 'control';
    }, [variant]);

    return {
        variant,
        loading,
        error,
        trackConversion,
        isVariant,
        isControl
    };
};

/**
 * Hook for conditional rendering based on A/B test variant
 * @param {string} experimentId - The ID of the experiment
 * @param {Object} variantComponents - Object mapping variants to components
 * @param {React.Component} defaultComponent - Default component to render
 * @returns {React.Component} - Component to render based on variant
 */
export const useABTestComponent = (experimentId, variantComponents, defaultComponent = null) => {
    const { variant, loading, error } = useABTest(experimentId);

    if (loading) {
        return defaultComponent || variantComponents.control || null;
    }

    if (error) {
        console.error('A/B Test Error:', error);
        return defaultComponent || variantComponents.control || null;
    }

    return variantComponents[variant] || defaultComponent || variantComponents.control || null;
};

/**
 * Hook for A/B testing with automatic conversion tracking
 * @param {string} experimentId - The ID of the experiment
 * @param {Object} options - Additional options
 * @returns {Object} - Variant assignment and conversion tracking functions
 */
export const useABTestWithTracking = (experimentId, options = {}) => {
    const abTest = useABTest(experimentId, options);
    const [conversions, setConversions] = useState({});

    const trackConversionOnce = useCallback(async (conversionType = 'default', conversionValue = 1.0) => {
        const key = `${experimentId}_${conversionType}`;
        
        // Prevent duplicate conversions
        if (conversions[key]) {
            return false;
        }

        const success = await abTest.trackConversion(conversionType, conversionValue);
        
        if (success) {
            setConversions(prev => ({
                ...prev,
                [key]: {
                    type: conversionType,
                    value: conversionValue,
                    timestamp: new Date().toISOString()
                }
            }));
        }

        return success;
    }, [experimentId, abTest, conversions]);

    const hasConverted = useCallback((conversionType = 'default') => {
        const key = `${experimentId}_${conversionType}`;
        return !!conversions[key];
    }, [experimentId, conversions]);

    return {
        ...abTest,
        trackConversionOnce,
        hasConverted,
        conversions
    };
};

/**
 * Hook for managing multiple A/B tests
 * @param {Array} experiments - Array of experiment configurations
 * @returns {Object} - Variants and helper functions for all experiments
 */
export const useMultipleABTests = (experiments) => {
    const [variants, setVariants] = useState({});
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!experiments || experiments.length === 0) {
            setLoading(false);
            return;
        }

        const getVariants = async () => {
            setLoading(true);
            const newVariants = {};
            const newErrors = {};

            await Promise.all(
                experiments.map(async (experiment) => {
                    try {
                        const variant = await abTestingService.getVariant(
                            experiment.id, 
                            experiment.options || {}
                        );
                        newVariants[experiment.id] = variant;
                    } catch (err) {
                        newErrors[experiment.id] = err.message;
                        newVariants[experiment.id] = 'control'; // Fallback
                    }
                })
            );

            setVariants(newVariants);
            setErrors(newErrors);
            setLoading(false);
        };

        getVariants();
    }, [JSON.stringify(experiments)]);

    const trackConversion = useCallback(async (experimentId, conversionType = 'default', conversionValue = 1.0) => {
        try {
            return await abTestingService.trackConversion(experimentId, conversionType, conversionValue);
        } catch (err) {
            console.error('Error tracking conversion:', err);
            return false;
        }
    }, []);

    const getVariant = useCallback((experimentId) => {
        return variants[experimentId] || 'control';
    }, [variants]);

    const isVariant = useCallback((experimentId, targetVariant) => {
        return variants[experimentId] === targetVariant;
    }, [variants]);

    return {
        variants,
        loading,
        errors,
        trackConversion,
        getVariant,
        isVariant
    };
};

/**
 * Hook for A/B testing analytics (admin use)
 * @param {string} experimentId - The ID of the experiment
 * @returns {Object} - Experiment results and analytics data
 */
export const useABTestAnalytics = (experimentId) => {
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchResults = useCallback(async () => {
        if (!experimentId) {
            setError('Experiment ID is required');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const data = await abTestingService.getExperimentResults(experimentId);
            setResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [experimentId]);

    useEffect(() => {
        fetchResults();
    }, [fetchResults]);

    const refreshResults = useCallback(() => {
        fetchResults();
    }, [fetchResults]);

    return {
        results,
        loading,
        error,
        refreshResults
    };
};

/**
 * Hook for managing experiments (admin use)
 * @returns {Object} - Experiments management functions
 */
export const useExperimentManager = () => {
    const [experiments, setExperiments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchExperiments = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const data = await abTestingService.getExperiments();
            setExperiments(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchExperiments();
    }, [fetchExperiments]);

    const createExperiment = useCallback(async (experimentData) => {
        try {
            const result = await abTestingService.createExperiment(experimentData);
            await fetchExperiments(); // Refresh list
            return result;
        } catch (err) {
            throw err;
        }
    }, [fetchExperiments]);

    const updateExperimentStatus = useCallback(async (experimentId, status) => {
        try {
            const result = await abTestingService.updateExperimentStatus(experimentId, status);
            await fetchExperiments(); // Refresh list
            return result;
        } catch (err) {
            throw err;
        }
    }, [fetchExperiments]);

    const refreshExperiments = useCallback(() => {
        fetchExperiments();
    }, [fetchExperiments]);

    return {
        experiments,
        loading,
        error,
        createExperiment,
        updateExperimentStatus,
        refreshExperiments
    };
};