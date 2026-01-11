#!/usr/bin/env python3
"""
A/B Testing Service
Provides business logic for A/B testing functionality including
statistical analysis, experiment management, and reporting.
"""

import json
import math
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from database import db_config

class ABTestingService:
    """Service class for A/B testing operations"""
    
    @staticmethod
    def calculate_statistical_significance(control_conversions: int, control_visitors: int,
                                         variant_conversions: int, variant_visitors: int,
                                         confidence_level: float = 0.95) -> Dict:
        """
        Calculate statistical significance using Z-test for proportions
        
        Args:
            control_conversions: Number of conversions in control group
            control_visitors: Number of visitors in control group
            variant_conversions: Number of conversions in variant group
            variant_visitors: Number of visitors in variant group
            confidence_level: Confidence level (default 0.95 for 95%)
        
        Returns:
            Dictionary with statistical analysis results
        """
        if control_visitors == 0 or variant_visitors == 0:
            return {
                'significant': False,
                'p_value': None,
                'z_score': None,
                'confidence_interval': None,
                'error': 'Insufficient data for statistical analysis'
            }
        
        # Calculate conversion rates
        p1 = control_conversions / control_visitors
        p2 = variant_conversions / variant_visitors
        
        # Calculate pooled proportion
        p_pool = (control_conversions + variant_conversions) / (control_visitors + variant_visitors)
        
        # Calculate standard error
        se = math.sqrt(p_pool * (1 - p_pool) * (1/control_visitors + 1/variant_visitors))
        
        if se == 0:
            return {
                'significant': False,
                'p_value': None,
                'z_score': None,
                'confidence_interval': None,
                'error': 'Standard error is zero'
            }
        
        # Calculate Z-score
        z_score = (p2 - p1) / se
        
        # Calculate p-value (two-tailed test)
        p_value = 2 * (1 - ABTestingService._normal_cdf(abs(z_score)))
        
        # Determine significance
        alpha = 1 - confidence_level
        significant = p_value < alpha
        
        # Calculate confidence interval for the difference
        z_critical = ABTestingService._inverse_normal_cdf(1 - alpha/2)
        margin_of_error = z_critical * se
        ci_lower = (p2 - p1) - margin_of_error
        ci_upper = (p2 - p1) + margin_of_error
        
        return {
            'significant': significant,
            'p_value': round(p_value, 4),
            'z_score': round(z_score, 4),
            'confidence_interval': [round(ci_lower, 4), round(ci_upper, 4)],
            'control_rate': round(p1, 4),
            'variant_rate': round(p2, 4),
            'lift': round((p2 - p1) / p1 * 100, 2) if p1 > 0 else None,
            'confidence_level': confidence_level
        }
    
    @staticmethod
    def _normal_cdf(x: float) -> float:
        """Cumulative distribution function for standard normal distribution"""
        return (1.0 + math.erf(x / math.sqrt(2.0))) / 2.0
    
    @staticmethod
    def _inverse_normal_cdf(p: float) -> float:
        """Inverse cumulative distribution function for standard normal distribution"""
        # Approximation using Beasley-Springer-Moro algorithm
        if p <= 0 or p >= 1:
            raise ValueError("p must be between 0 and 1")
        
        if p == 0.5:
            return 0.0
        
        # Constants for the approximation
        a = [0, -3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02,
             1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00]
        
        b = [0, -5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02,
             6.680131188771972e+01, -1.328068155288572e+01]
        
        c = [0, -7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00,
             -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00]
        
        d = [0, 7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00,
             3.754408661907416e+00]
        
        p_low = 0.02425
        p_high = 1 - p_low
        
        if 0 < p < p_low:
            # Rational approximation for lower region
            q = math.sqrt(-2 * math.log(p))
            return (((((c[1]*q+c[2])*q+c[3])*q+c[4])*q+c[5])*q+c[6]) / \
                   ((((d[1]*q+d[2])*q+d[3])*q+d[4])*q+1)
        
        if p_low <= p <= p_high:
            # Rational approximation for central region
            q = p - 0.5
            r = q * q
            return (((((a[1]*r+a[2])*r+a[3])*r+a[4])*r+a[5])*r+a[6])*q / \
                   (((((b[1]*r+b[2])*r+b[3])*r+b[4])*r+b[5])*r+1)
        
        if p_high < p < 1:
            # Rational approximation for upper region
            q = math.sqrt(-2 * math.log(1-p))
            return -(((((c[1]*q+c[2])*q+c[3])*q+c[4])*q+c[5])*q+c[6]) / \
                    ((((d[1]*q+d[2])*q+d[3])*q+d[4])*q+1)
    
    @staticmethod
    def calculate_sample_size(baseline_rate: float, minimum_detectable_effect: float,
                            power: float = 0.8, significance_level: float = 0.05) -> int:
        """
        Calculate required sample size for A/B test
        
        Args:
            baseline_rate: Expected conversion rate of control group
            minimum_detectable_effect: Minimum effect size to detect (as proportion)
            power: Statistical power (default 0.8)
            significance_level: Significance level (default 0.05)
        
        Returns:
            Required sample size per variant
        """
        if baseline_rate <= 0 or baseline_rate >= 1:
            raise ValueError("Baseline rate must be between 0 and 1")
        
        if minimum_detectable_effect <= 0:
            raise ValueError("Minimum detectable effect must be positive")
        
        # Calculate effect size
        p1 = baseline_rate
        p2 = baseline_rate * (1 + minimum_detectable_effect)
        
        if p2 >= 1:
            p2 = min(0.99, p2)  # Cap at 99%
        
        # Calculate pooled proportion
        p_pool = (p1 + p2) / 2
        
        # Z-scores for power and significance
        z_alpha = ABTestingService._inverse_normal_cdf(1 - significance_level/2)
        z_beta = ABTestingService._inverse_normal_cdf(power)
        
        # Sample size calculation
        numerator = (z_alpha * math.sqrt(2 * p_pool * (1 - p_pool)) + 
                    z_beta * math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))) ** 2
        denominator = (p2 - p1) ** 2
        
        sample_size = math.ceil(numerator / denominator)
        
        return sample_size
    
    @staticmethod
    def get_experiment_health_metrics(experiment_id: str) -> Dict:
        """
        Get health metrics for an experiment
        
        Args:
            experiment_id: ID of the experiment
        
        Returns:
            Dictionary with health metrics
        """
        try:
            conn = db_config.get_connection()
            cursor = conn.cursor()
            
            # Get experiment details
            if db_config.db_type == 'mysql':
                cursor.execute('''
                    SELECT name, variants, traffic_split, created_at 
                    FROM ab_experiments WHERE id = %s
                ''', (experiment_id,))
            else:
                cursor.execute('''
                    SELECT name, variants, traffic_split, created_at 
                    FROM ab_experiments WHERE id = ?
                ''', (experiment_id,))
            
            experiment = cursor.fetchone()
            if not experiment:
                return {'error': 'Experiment not found'}
            
            # Get assignment distribution
            if db_config.db_type == 'mysql':
                cursor.execute('''
                    SELECT variant, COUNT(*) as count,
                           COUNT(DISTINCT DATE(assigned_at)) as active_days
                    FROM ab_assignments 
                    WHERE experiment_id = %s 
                    GROUP BY variant
                ''', (experiment_id,))
            else:
                cursor.execute('''
                    SELECT variant, COUNT(*) as count,
                           COUNT(DISTINCT DATE(assigned_at)) as active_days
                    FROM ab_assignments 
                    WHERE experiment_id = ? 
                    GROUP BY variant
                ''', (experiment_id,))
            
            assignment_data = {}
            total_assignments = 0
            for row in cursor.fetchall():
                if db_config.db_type == 'mysql':
                    variant = row['variant']
                    count = row['count']
                    active_days = row['active_days']
                else:
                    variant = row[0]
                    count = row[1]
                    active_days = row[2]
                
                assignment_data[variant] = {
                    'count': count,
                    'active_days': active_days
                }
                total_assignments += count
            
            # Calculate traffic distribution health
            expected_split = json.loads(experiment['traffic_split'] if db_config.db_type == 'mysql' else experiment[2])
            traffic_health = {}
            
            for variant, expected_percent in expected_split.items():
                actual_count = assignment_data.get(variant, {}).get('count', 0)
                actual_percent = (actual_count / total_assignments * 100) if total_assignments > 0 else 0
                expected_count = total_assignments * expected_percent / 100
                
                # Calculate chi-square contribution for this variant
                chi_square_contrib = ((actual_count - expected_count) ** 2 / expected_count) if expected_count > 0 else 0
                
                traffic_health[variant] = {
                    'expected_percent': expected_percent,
                    'actual_percent': round(actual_percent, 2),
                    'deviation': round(actual_percent - expected_percent, 2),
                    'chi_square_contrib': round(chi_square_contrib, 4)
                }
            
            # Get conversion data
            if db_config.db_type == 'mysql':
                cursor.execute('''
                    SELECT variant, COUNT(*) as conversions,
                           COUNT(DISTINCT user_id) as unique_converters
                    FROM ab_conversions 
                    WHERE experiment_id = %s 
                    GROUP BY variant
                ''', (experiment_id,))
            else:
                cursor.execute('''
                    SELECT variant, COUNT(*) as conversions,
                           COUNT(DISTINCT user_id) as unique_converters
                    FROM ab_conversions 
                    WHERE experiment_id = ? 
                    GROUP BY variant
                ''', (experiment_id,))
            
            conversion_data = {}
            for row in cursor.fetchall():
                if db_config.db_type == 'mysql':
                    variant = row['variant']
                    conversions = row['conversions']
                    unique_converters = row['unique_converters']
                else:
                    variant = row[0]
                    conversions = row[1]
                    unique_converters = row[2]
                
                conversion_data[variant] = {
                    'conversions': conversions,
                    'unique_converters': unique_converters
                }
            
            # Calculate experiment runtime
            created_at = experiment['created_at'] if db_config.db_type == 'mysql' else experiment[3]
            if isinstance(created_at, str):
                created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
            
            runtime_days = (datetime.now() - created_at).days
            
            conn.close()
            
            return {
                'experiment_name': experiment['name'] if db_config.db_type == 'mysql' else experiment[0],
                'runtime_days': runtime_days,
                'total_assignments': total_assignments,
                'traffic_health': traffic_health,
                'assignment_data': assignment_data,
                'conversion_data': conversion_data,
                'health_score': ABTestingService._calculate_health_score(traffic_health, total_assignments)
            }
            
        except Exception as e:
            return {'error': f'Failed to get health metrics: {str(e)}'}
    
    @staticmethod
    def _calculate_health_score(traffic_health: Dict, total_assignments: int) -> Dict:
        """Calculate overall health score for experiment"""
        if total_assignments < 100:
            return {
                'score': 'insufficient_data',
                'message': 'Not enough data to calculate health score'
            }
        
        # Calculate average deviation from expected traffic split
        deviations = [abs(variant['deviation']) for variant in traffic_health.values()]
        avg_deviation = sum(deviations) / len(deviations) if deviations else 0
        
        # Score based on traffic distribution
        if avg_deviation < 2:
            score = 'excellent'
            message = 'Traffic distribution is very close to expected'
        elif avg_deviation < 5:
            score = 'good'
            message = 'Traffic distribution is acceptable'
        elif avg_deviation < 10:
            score = 'fair'
            message = 'Traffic distribution has some deviation'
        else:
            score = 'poor'
            message = 'Traffic distribution significantly deviates from expected'
        
        return {
            'score': score,
            'message': message,
            'avg_deviation': round(avg_deviation, 2)
        }
    
    @staticmethod
    def generate_experiment_report(experiment_id: str) -> Dict:
        """
        Generate comprehensive experiment report
        
        Args:
            experiment_id: ID of the experiment
        
        Returns:
            Dictionary with comprehensive report data
        """
        try:
            conn = db_config.get_connection()
            cursor = conn.cursor()
            
            # Get experiment details
            if db_config.db_type == 'mysql':
                cursor.execute('''
                    SELECT * FROM ab_experiments WHERE id = %s
                ''', (experiment_id,))
            else:
                cursor.execute('''
                    SELECT * FROM ab_experiments WHERE id = ?
                ''', (experiment_id,))
            
            experiment = cursor.fetchone()
            if not experiment:
                return {'error': 'Experiment not found'}
            
            # Get detailed results
            results = ABTestingService._get_detailed_results(cursor, experiment_id)
            
            # Get health metrics
            health_metrics = ABTestingService.get_experiment_health_metrics(experiment_id)
            
            # Calculate statistical significance for each variant vs control
            control_variant = 'control'  # Assume 'control' is the control variant
            statistical_analysis = {}
            
            if control_variant in results and len(results) > 1:
                control_data = results[control_variant]
                
                for variant, data in results.items():
                    if variant != control_variant:
                        stats = ABTestingService.calculate_statistical_significance(
                            control_data['conversions'],
                            control_data['assignments'],
                            data['conversions'],
                            data['assignments']
                        )
                        statistical_analysis[variant] = stats
            
            conn.close()
            
            return {
                'experiment_id': experiment_id,
                'experiment_name': experiment['name'] if db_config.db_type == 'mysql' else experiment[1],
                'status': experiment['status'] if db_config.db_type == 'mysql' else experiment[5],
                'created_at': str(experiment['created_at'] if db_config.db_type == 'mysql' else experiment[6]),
                'results': results,
                'statistical_analysis': statistical_analysis,
                'health_metrics': health_metrics,
                'recommendations': ABTestingService._generate_recommendations(results, statistical_analysis, health_metrics)
            }
            
        except Exception as e:
            return {'error': f'Failed to generate report: {str(e)}'}
    
    @staticmethod
    def _get_detailed_results(cursor, experiment_id: str) -> Dict:
        """Get detailed results for experiment"""
        # Get assignment counts
        if db_config.db_type == 'mysql':
            cursor.execute('''
                SELECT variant, COUNT(*) as count 
                FROM ab_assignments 
                WHERE experiment_id = %s 
                GROUP BY variant
            ''', (experiment_id,))
        else:
            cursor.execute('''
                SELECT variant, COUNT(*) as count 
                FROM ab_assignments 
                WHERE experiment_id = ? 
                GROUP BY variant
            ''', (experiment_id,))
        
        assignments = {}
        for row in cursor.fetchall():
            if db_config.db_type == 'mysql':
                assignments[row['variant']] = row['count']
            else:
                assignments[row[0]] = row[1]
        
        # Get conversion data
        if db_config.db_type == 'mysql':
            cursor.execute('''
                SELECT variant, COUNT(*) as conversions, 
                       SUM(conversion_value) as total_value,
                       AVG(conversion_value) as avg_value
                FROM ab_conversions 
                WHERE experiment_id = %s 
                GROUP BY variant
            ''', (experiment_id,))
        else:
            cursor.execute('''
                SELECT variant, COUNT(*) as conversions, 
                       SUM(conversion_value) as total_value,
                       AVG(conversion_value) as avg_value
                FROM ab_conversions 
                WHERE experiment_id = ? 
                GROUP BY variant
            ''', (experiment_id,))
        
        conversions = {}
        for row in cursor.fetchall():
            if db_config.db_type == 'mysql':
                conversions[row['variant']] = {
                    'count': row['conversions'],
                    'total_value': float(row['total_value'] or 0),
                    'avg_value': float(row['avg_value'] or 0)
                }
            else:
                conversions[row[0]] = {
                    'count': row[1],
                    'total_value': float(row[2] or 0),
                    'avg_value': float(row[3] or 0)
                }
        
        # Combine results
        results = {}
        for variant in assignments.keys():
            assignment_count = assignments[variant]
            conversion_data = conversions.get(variant, {'count': 0, 'total_value': 0, 'avg_value': 0})
            conversion_count = conversion_data['count']
            
            conversion_rate = (conversion_count / assignment_count * 100) if assignment_count > 0 else 0
            
            results[variant] = {
                'assignments': assignment_count,
                'conversions': conversion_count,
                'conversion_rate': round(conversion_rate, 2),
                'total_value': conversion_data['total_value'],
                'avg_value': conversion_data['avg_value']
            }
        
        return results
    
    @staticmethod
    def _generate_recommendations(results: Dict, statistical_analysis: Dict, health_metrics: Dict) -> List[str]:
        """Generate recommendations based on experiment data"""
        recommendations = []
        
        # Check sample size
        total_assignments = sum(variant['assignments'] for variant in results.values())
        if total_assignments < 1000:
            recommendations.append("Consider running the experiment longer to gather more data for reliable results.")
        
        # Check traffic distribution
        if 'health_score' in health_metrics and health_metrics['health_score']['score'] in ['fair', 'poor']:
            recommendations.append("Traffic distribution deviates from expected. Check implementation and traffic allocation.")
        
        # Check for statistical significance
        significant_variants = [variant for variant, stats in statistical_analysis.items() if stats.get('significant', False)]
        
        if significant_variants:
            best_variant = max(significant_variants, key=lambda v: statistical_analysis[v].get('lift', 0))
            recommendations.append(f"Variant '{best_variant}' shows statistically significant improvement. Consider implementing this variant.")
        else:
            recommendations.append("No statistically significant differences found. Consider running the experiment longer or testing more dramatic changes.")
        
        # Check conversion rates
        if results:
            rates = [variant['conversion_rate'] for variant in results.values()]
            if max(rates) - min(rates) < 0.5:
                recommendations.append("Conversion rates are very similar across variants. Consider testing more significant changes.")
        
        return recommendations