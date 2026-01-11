# A/B Testing System for Portfolio Backend

A comprehensive A/B testing system built for your portfolio backend that allows you to test different variations of your website content and track conversions to optimize user experience.

## Features

- **Experiment Management**: Create, manage, and monitor A/B tests
- **Variant Assignment**: Consistent user assignment to test variants
- **Conversion Tracking**: Track user actions and measure success
- **Statistical Analysis**: Built-in statistical significance testing
- **Real-time Results**: Live experiment results and analytics
- **React Integration**: Easy-to-use React hooks and components
- **Admin Dashboard**: Web interface for managing experiments

## Architecture

### Backend Components

1. **API Routes** (`routes/ab_testing.py`)
   - RESTful API endpoints for experiment management
   - Variant assignment and conversion tracking
   - Results and analytics endpoints

2. **Database Schema** (`ab_testing_schema.py`)
   - Experiments table for test configurations
   - Assignments table for user-variant mappings
   - Conversions table for tracking user actions
   - Events table for detailed analytics

3. **Service Layer** (`services/ab_testing_service.py`)
   - Statistical analysis functions
   - Experiment health metrics
   - Report generation
   - Sample size calculations

### Frontend Components

1. **Service Layer** (`services/abTesting.js`)
   - Client-side A/B testing functionality
   - Variant assignment and caching
   - Conversion tracking with retry logic
   - Local storage for persistence

2. **React Hooks** (`hooks/useABTesting.js`)
   - `useABTest`: Basic variant assignment
   - `useABTestComponent`: Component-based testing
   - `useABTestWithTracking`: Automatic conversion tracking
   - `useMultipleABTests`: Multiple experiment management
   - `useABTestAnalytics`: Results and analytics
   - `useExperimentManager`: Admin functionality

3. **Admin Dashboard** (`components/ABTestDashboard.jsx`)
   - Create and manage experiments
   - View real-time results
   - Update experiment status
   - Statistical analysis display

## Installation & Setup

### 1. Backend Setup

Install required dependencies:
```bash
pip install flask flask-cors pymysql python-dotenv
```

Run the setup script to initialize the database:
```bash
cd backend
python setup_ab_testing.py
```

### 2. Frontend Setup

The A/B testing components are already integrated into your existing React setup. No additional dependencies required.

### 3. Database Configuration

The system uses your existing database configuration from `database.py`. It supports both SQLite (development) and MySQL (production).

## API Endpoints

### Experiments Management

- `GET /api/ab/experiments` - List all experiments
- `POST /api/ab/experiments` - Create new experiment
- `PUT /api/ab/experiments/{id}/status` - Update experiment status

### Variant Assignment & Tracking

- `POST /api/ab/assign/{experiment_id}` - Get variant assignment
- `POST /api/ab/convert` - Track conversion event

### Analytics & Results

- `GET /api/ab/results/{experiment_id}` - Get experiment results

## Usage Examples

### 1. Basic A/B Test in React

```jsx
import { useABTest } from '../hooks/useABTesting';

const HeroSection = () => {
    const { variant, trackConversion } = useABTest('hero-cta-test');

    const handleCTAClick = () => {
        trackConversion('cta_click');
        // Handle CTA action
    };

    return (
        <div>
            {variant === 'control' && (
                <button onClick={handleCTAClick}>Get Started</button>
            )}
            {variant === 'variant_a' && (
                <button onClick={handleCTAClick}>Start Your Journey</button>
            )}
        </div>
    );
};
```

### 2. Component-Based A/B Testing

```jsx
import { useABTestComponent } from '../hooks/useABTesting';

const variants = {
    control: <button className="btn-primary">Contact Me</button>,
    variant_a: <button className="btn-success">Let's Work Together</button>,
    variant_b: <button className="btn-warning">Hire Me Now</button>
};

const ContactButton = () => {
    const ButtonComponent = useABTestComponent('contact-button-test', variants);
    return ButtonComponent;
};
```

### 3. Creating Experiments via API

```javascript
const experimentData = {
    name: 'Hero Section CTA Test',
    description: 'Testing different call-to-action buttons',
    variants: ['control', 'variant_a', 'variant_b'],
    traffic_split: { control: 34, variant_a: 33, variant_b: 33 },
    status: 'active'
};

const response = await fetch('/api/ab/experiments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(experimentData)
});
```

### 4. Admin Dashboard Usage

```jsx
import ABTestDashboard from '../components/ABTestDashboard';

const AdminPage = () => {
    return (
        <div>
            <h1>A/B Testing Admin</h1>
            <ABTestDashboard />
        </div>
    );
};
```

## Best Practices

### 1. Experiment Design

- **Test One Element**: Focus on testing one element at a time for clear results
- **Clear Hypothesis**: Define what you expect to improve and why
- **Meaningful Variants**: Create variants that are significantly different
- **Control Group**: Always maintain a control group for comparison

### 2. Statistical Significance

- **Sample Size**: Run tests long enough to gather sufficient data
- **Significance Level**: Use 95% confidence level (p < 0.05)
- **Avoid Peeking**: Don't stop tests early based on preliminary results
- **Multiple Testing**: Be aware of multiple comparison problems

### 3. Implementation

- **Consistent Assignment**: Users should see the same variant across sessions
- **Fallback Handling**: Always provide fallback behavior for errors
- **Performance**: Cache variant assignments to avoid repeated API calls
- **Privacy**: Respect user privacy and data protection regulations

### 4. Conversion Tracking

- **Clear Goals**: Define specific, measurable conversion events
- **Event Naming**: Use consistent naming conventions for events
- **Value Tracking**: Track conversion values when applicable
- **Deduplication**: Prevent duplicate conversion tracking

## Database Schema

### ab_experiments
- `id`: Unique experiment identifier
- `name`: Human-readable experiment name
- `description`: Experiment description
- `variants`: JSON array of variant names
- `traffic_split`: JSON object with traffic allocation
- `status`: Experiment status (draft, active, paused, completed)
- `created_at`, `updated_at`: Timestamps
- `start_date`, `end_date`: Optional date constraints

### ab_assignments
- `id`: Assignment record ID
- `experiment_id`: Reference to experiment
- `user_id`: Consistent user identifier
- `variant`: Assigned variant name
- `assigned_at`: Assignment timestamp
- `ip_address`: User IP for analytics

### ab_conversions
- `id`: Conversion record ID
- `experiment_id`: Reference to experiment
- `user_id`: User identifier
- `variant`: User's assigned variant
- `conversion_type`: Type of conversion event
- `conversion_value`: Numeric value of conversion
- `converted_at`: Conversion timestamp
- `ip_address`: User IP for analytics

### ab_events
- `id`: Event record ID
- `experiment_id`: Reference to experiment
- `user_id`: User identifier
- `variant`: User's assigned variant
- `event_type`: Type of event
- `event_data`: JSON data for event details
- `created_at`: Event timestamp
- `ip_address`: User IP for analytics

## Statistical Analysis

The system includes built-in statistical analysis features:

### Z-Test for Proportions
- Compares conversion rates between variants
- Calculates p-values and confidence intervals
- Determines statistical significance

### Sample Size Calculation
- Estimates required sample size for experiments
- Based on baseline rate and minimum detectable effect
- Configurable power and significance levels

### Health Metrics
- Traffic distribution analysis
- Experiment runtime tracking
- Data quality assessment

## Security Considerations

- **Rate Limiting**: API endpoints include rate limiting
- **Input Validation**: All inputs are validated and sanitized
- **SQL Injection**: Uses parameterized queries
- **CORS**: Properly configured for your domain
- **Privacy**: User IDs are hashed for privacy

## Monitoring & Maintenance

### Performance Monitoring
- Monitor API response times
- Track database query performance
- Watch for memory usage in caching

### Data Cleanup
- Archive completed experiments
- Clean up old assignment data
- Monitor database size growth

### Error Handling
- Log failed conversions for retry
- Handle network failures gracefully
- Provide meaningful error messages

## Troubleshooting

### Common Issues

1. **Variant Assignment Inconsistency**
   - Check user ID generation
   - Verify caching implementation
   - Review hash function consistency

2. **Low Conversion Rates**
   - Verify conversion tracking implementation
   - Check event naming consistency
   - Review user flow for tracking points

3. **Statistical Significance Issues**
   - Ensure sufficient sample size
   - Check for external factors affecting results
   - Verify traffic split implementation

4. **Database Performance**
   - Add indexes for frequently queried columns
   - Archive old experiment data
   - Monitor query execution plans

### Debug Mode

Enable debug logging by setting environment variables:
```bash
export FLASK_ENV=development
export AB_TEST_DEBUG=true
```

## Future Enhancements

- **Multivariate Testing**: Support for testing multiple elements simultaneously
- **Segmentation**: User segmentation for targeted experiments
- **Automated Reporting**: Scheduled experiment reports
- **Integration**: Integration with analytics platforms
- **Machine Learning**: Automated variant optimization

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the example implementations
3. Check API endpoint responses for error details
4. Verify database schema and data integrity

## License

This A/B testing system is part of your portfolio project and follows the same licensing terms.