/**
 * A/B Test Dashboard Component
 * Admin interface for managing A/B tests and viewing results
 */

import React, { useState } from 'react';
import { useExperimentManager, useABTestAnalytics } from '../hooks/useABTesting';
import './ABTestDashboard.css';

const ABTestDashboard = () => {
    const {
        experiments,
        loading: experimentsLoading,
        error: experimentsError,
        createExperiment,
        updateExperimentStatus,
        refreshExperiments
    } = useExperimentManager();

    const [selectedExperiment, setSelectedExperiment] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [createFormData, setCreateFormData] = useState({
        name: '',
        description: '',
        variants: ['control', 'variant'],
        traffic_split: { control: 50, variant: 50 },
        status: 'draft'
    });

    const handleCreateExperiment = async (e) => {
        e.preventDefault();
        
        try {
            await createExperiment(createFormData);
            setShowCreateForm(false);
            setCreateFormData({
                name: '',
                description: '',
                variants: ['control', 'variant'],
                traffic_split: { control: 50, variant: 50 },
                status: 'draft'
            });
        } catch (error) {
            alert(`Error creating experiment: ${error.message}`);
        }
    };

    const handleStatusUpdate = async (experimentId, newStatus) => {
        try {
            await updateExperimentStatus(experimentId, newStatus);
        } catch (error) {
            alert(`Error updating status: ${error.message}`);
        }
    };

    const addVariant = () => {
        const newVariantName = `variant_${createFormData.variants.length}`;
        const newVariants = [...createFormData.variants, newVariantName];
        const newTrafficSplit = { ...createFormData.traffic_split };
        
        // Redistribute traffic equally
        const equalSplit = Math.floor(100 / newVariants.length);
        const remainder = 100 - (equalSplit * newVariants.length);
        
        newVariants.forEach((variant, index) => {
            newTrafficSplit[variant] = equalSplit + (index === 0 ? remainder : 0);
        });

        setCreateFormData({
            ...createFormData,
            variants: newVariants,
            traffic_split: newTrafficSplit
        });
    };

    const removeVariant = (variantToRemove) => {
        if (createFormData.variants.length <= 2) return; // Keep at least 2 variants
        
        const newVariants = createFormData.variants.filter(v => v !== variantToRemove);
        const newTrafficSplit = { ...createFormData.traffic_split };
        delete newTrafficSplit[variantToRemove];
        
        // Redistribute traffic equally
        const equalSplit = Math.floor(100 / newVariants.length);
        const remainder = 100 - (equalSplit * newVariants.length);
        
        newVariants.forEach((variant, index) => {
            newTrafficSplit[variant] = equalSplit + (index === 0 ? remainder : 0);
        });

        setCreateFormData({
            ...createFormData,
            variants: newVariants,
            traffic_split: newTrafficSplit
        });
    };

    const updateTrafficSplit = (variant, value) => {
        const newTrafficSplit = { ...createFormData.traffic_split };
        newTrafficSplit[variant] = parseInt(value);
        
        setCreateFormData({
            ...createFormData,
            traffic_split: newTrafficSplit
        });
    };

    if (experimentsLoading) {
        return <div className="ab-dashboard-loading">Loading experiments...</div>;
    }

    if (experimentsError) {
        return <div className="ab-dashboard-error">Error: {experimentsError}</div>;
    }

    return (
        <div className="ab-test-dashboard">
            <div className="dashboard-header">
                <h2>A/B Test Dashboard</h2>
                <div className="dashboard-actions">
                    <button 
                        className="btn btn-primary"
                        onClick={() => setShowCreateForm(true)}
                    >
                        Create Experiment
                    </button>
                    <button 
                        className="btn btn-secondary"
                        onClick={refreshExperiments}
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {showCreateForm && (
                <div className="create-experiment-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Create New Experiment</h3>
                            <button 
                                className="close-btn"
                                onClick={() => setShowCreateForm(false)}
                            >
                                ×
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateExperiment}>
                            <div className="form-group">
                                <label>Experiment Name:</label>
                                <input
                                    type="text"
                                    value={createFormData.name}
                                    onChange={(e) => setCreateFormData({
                                        ...createFormData,
                                        name: e.target.value
                                    })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description:</label>
                                <textarea
                                    value={createFormData.description}
                                    onChange={(e) => setCreateFormData({
                                        ...createFormData,
                                        description: e.target.value
                                    })}
                                    rows="3"
                                />
                            </div>

                            <div className="form-group">
                                <label>Variants:</label>
                                <div className="variants-section">
                                    {createFormData.variants.map((variant, index) => (
                                        <div key={variant} className="variant-row">
                                            <input
                                                type="text"
                                                value={variant}
                                                onChange={(e) => {
                                                    const newVariants = [...createFormData.variants];
                                                    const oldVariant = newVariants[index];
                                                    newVariants[index] = e.target.value;
                                                    
                                                    const newTrafficSplit = { ...createFormData.traffic_split };
                                                    newTrafficSplit[e.target.value] = newTrafficSplit[oldVariant];
                                                    delete newTrafficSplit[oldVariant];
                                                    
                                                    setCreateFormData({
                                                        ...createFormData,
                                                        variants: newVariants,
                                                        traffic_split: newTrafficSplit
                                                    });
                                                }}
                                            />
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={createFormData.traffic_split[variant] || 0}
                                                onChange={(e) => updateTrafficSplit(variant, e.target.value)}
                                            />
                                            <span>%</span>
                                            {createFormData.variants.length > 2 && (
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => removeVariant(variant)}
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="btn btn-secondary btn-sm"
                                        onClick={addVariant}
                                    >
                                        Add Variant
                                    </button>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">
                                    Create Experiment
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setShowCreateForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="experiments-list">
                <h3>Experiments</h3>
                {experiments.length === 0 ? (
                    <p>No experiments found. Create your first experiment!</p>
                ) : (
                    <div className="experiments-grid">
                        {experiments.map((experiment) => (
                            <ExperimentCard
                                key={experiment.id}
                                experiment={experiment}
                                onStatusUpdate={handleStatusUpdate}
                                onSelect={() => setSelectedExperiment(experiment.id)}
                                isSelected={selectedExperiment === experiment.id}
                            />
                        ))}
                    </div>
                )}
            </div>

            {selectedExperiment && (
                <ExperimentResults 
                    experimentId={selectedExperiment}
                    onClose={() => setSelectedExperiment(null)}
                />
            )}
        </div>
    );
};

const ExperimentCard = ({ experiment, onStatusUpdate, onSelect, isSelected }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return '#28a745';
            case 'paused': return '#ffc107';
            case 'completed': return '#6c757d';
            default: return '#007bff';
        }
    };

    return (
        <div className={`experiment-card ${isSelected ? 'selected' : ''}`}>
            <div className="card-header">
                <h4>{experiment.name}</h4>
                <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(experiment.status) }}
                >
                    {experiment.status}
                </span>
            </div>
            
            <div className="card-body">
                <p>{experiment.description}</p>
                <div className="variants-info">
                    <strong>Variants:</strong> {experiment.variants.join(', ')}
                </div>
                <div className="traffic-split">
                    <strong>Traffic Split:</strong>
                    {Object.entries(experiment.traffic_split).map(([variant, percent]) => (
                        <span key={variant} className="split-item">
                            {variant}: {percent}%
                        </span>
                    ))}
                </div>
            </div>
            
            <div className="card-actions">
                <button 
                    className="btn btn-primary btn-sm"
                    onClick={onSelect}
                >
                    View Results
                </button>
                
                {experiment.status === 'draft' && (
                    <button 
                        className="btn btn-success btn-sm"
                        onClick={() => onStatusUpdate(experiment.id, 'active')}
                    >
                        Start
                    </button>
                )}
                
                {experiment.status === 'active' && (
                    <>
                        <button 
                            className="btn btn-warning btn-sm"
                            onClick={() => onStatusUpdate(experiment.id, 'paused')}
                        >
                            Pause
                        </button>
                        <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => onStatusUpdate(experiment.id, 'completed')}
                        >
                            Stop
                        </button>
                    </>
                )}
                
                {experiment.status === 'paused' && (
                    <button 
                        className="btn btn-success btn-sm"
                        onClick={() => onStatusUpdate(experiment.id, 'active')}
                    >
                        Resume
                    </button>
                )}
            </div>
        </div>
    );
};

const ExperimentResults = ({ experimentId, onClose }) => {
    const { results, loading, error, refreshResults } = useABTestAnalytics(experimentId);

    if (loading) {
        return (
            <div className="results-modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3>Experiment Results</h3>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>
                    <div className="loading">Loading results...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="results-modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3>Experiment Results</h3>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>
                    <div className="error">Error: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="results-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Results: {results.experiment_name}</h3>
                    <div className="header-actions">
                        <button className="btn btn-secondary btn-sm" onClick={refreshResults}>
                            Refresh
                        </button>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>
                </div>
                
                <div className="results-content">
                    <div className="results-summary">
                        <div className="summary-item">
                            <strong>Total Assignments:</strong> {results.total_assignments}
                        </div>
                        <div className="summary-item">
                            <strong>Total Conversions:</strong> {results.total_conversions}
                        </div>
                    </div>

                    <div className="variants-results">
                        {Object.entries(results.results).map(([variant, data]) => (
                            <div key={variant} className="variant-result">
                                <h4>{variant}</h4>
                                <div className="result-metrics">
                                    <div className="metric">
                                        <span className="metric-label">Assignments:</span>
                                        <span className="metric-value">{data.assignments}</span>
                                    </div>
                                    <div className="metric">
                                        <span className="metric-label">Conversions:</span>
                                        <span className="metric-value">{data.conversions}</span>
                                    </div>
                                    <div className="metric">
                                        <span className="metric-label">Conversion Rate:</span>
                                        <span className="metric-value">{data.conversion_rate}%</span>
                                    </div>
                                    <div className="metric">
                                        <span className="metric-label">Total Value:</span>
                                        <span className="metric-value">${data.total_value.toFixed(2)}</span>
                                    </div>
                                    <div className="metric">
                                        <span className="metric-label">Avg Value:</span>
                                        <span className="metric-value">${data.avg_value.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ABTestDashboard;