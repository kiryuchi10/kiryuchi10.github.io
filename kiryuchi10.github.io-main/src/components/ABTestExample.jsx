/**
 * A/B Test Example Component
 * Demonstrates how to use A/B testing in your portfolio components
 */

import React from 'react';
import { useABTest, useABTestComponent, useABTestWithTracking } from '../hooks/useABTesting';

// Example 1: Simple variant-based rendering
const HeroSectionABTest = () => {
    const { variant, loading, trackConversion } = useABTest('hero-section-test');

    const handleCTAClick = () => {
        trackConversion('cta_click');
        // Handle the actual CTA action
        console.log('CTA clicked!');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="hero-section">
            {variant === 'control' && (
                <div>
                    <h1>Welcome to My Portfolio</h1>
                    <p>I'm a full-stack developer passionate about creating amazing web experiences.</p>
                    <button onClick={handleCTAClick} className="cta-button">
                        View My Work
                    </button>
                </div>
            )}
            
            {variant === 'variant_a' && (
                <div>
                    <h1>Hi, I'm [Your Name] 👋</h1>
                    <p>Full-stack developer who loves turning ideas into reality through code.</p>
                    <button onClick={handleCTAClick} className="cta-button cta-variant">
                        Explore My Projects
                    </button>
                </div>
            )}
            
            {variant === 'variant_b' && (
                <div>
                    <h1>Building the Future, One Line at a Time</h1>
                    <p>Experienced developer specializing in modern web technologies and user experiences.</p>
                    <button onClick={handleCTAClick} className="cta-button cta-bold">
                        See What I've Built
                    </button>
                </div>
            )}
        </div>
    );
};

// Example 2: Using component-based A/B testing
const ContactButtonVariants = {
    control: (
        <button className="contact-btn contact-btn-control">
            Get In Touch
        </button>
    ),
    variant_a: (
        <button className="contact-btn contact-btn-variant-a">
            Let's Work Together
        </button>
    ),
    variant_b: (
        <button className="contact-btn contact-btn-variant-b">
            Hire Me
        </button>
    )
};

const ContactSectionABTest = () => {
    const ContactButton = useABTestComponent(
        'contact-button-test',
        ContactButtonVariants,
        ContactButtonVariants.control
    );

    return (
        <div className="contact-section">
            <h2>Ready to start your project?</h2>
            <p>I'd love to hear about your ideas and help bring them to life.</p>
            {ContactButton}
        </div>
    );
};

// Example 3: A/B testing with conversion tracking
const ProjectShowcaseABTest = () => {
    const { variant, trackConversionOnce, hasConverted } = useABTestWithTracking('project-showcase-test');

    const handleProjectClick = (projectId) => {
        if (!hasConverted('project_click')) {
            trackConversionOnce('project_click');
        }
        
        // Navigate to project details
        console.log(`Viewing project: ${projectId}`);
    };

    const handleContactClick = () => {
        trackConversionOnce('contact_from_projects');
        console.log('Contact clicked from projects');
    };

    const projects = [
        { id: 1, title: 'E-commerce Platform', tech: 'React, Node.js' },
        { id: 2, title: 'Task Management App', tech: 'Vue.js, Python' },
        { id: 3, title: 'Data Visualization Tool', tech: 'D3.js, Express' }
    ];

    return (
        <div className="projects-section">
            {variant === 'control' && (
                <div>
                    <h2>My Projects</h2>
                    <div className="projects-grid">
                        {projects.map(project => (
                            <div 
                                key={project.id} 
                                className="project-card"
                                onClick={() => handleProjectClick(project.id)}
                            >
                                <h3>{project.title}</h3>
                                <p>{project.tech}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {variant === 'variant_a' && (
                <div>
                    <h2>Featured Work</h2>
                    <p>Here are some projects I'm particularly proud of:</p>
                    <div className="projects-list">
                        {projects.map(project => (
                            <div 
                                key={project.id} 
                                className="project-item"
                                onClick={() => handleProjectClick(project.id)}
                            >
                                <div className="project-info">
                                    <h3>{project.title}</h3>
                                    <p>Built with {project.tech}</p>
                                </div>
                                <button className="view-project-btn">View Details</button>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleContactClick} className="contact-cta">
                        Interested? Let's talk!
                    </button>
                </div>
            )}
            
            {variant === 'variant_b' && (
                <div>
                    <h2>Portfolio Highlights</h2>
                    <div className="projects-showcase">
                        {projects.map((project, index) => (
                            <div 
                                key={project.id} 
                                className={`project-highlight ${index === 0 ? 'featured' : ''}`}
                                onClick={() => handleProjectClick(project.id)}
                            >
                                <div className="project-number">#{index + 1}</div>
                                <h3>{project.title}</h3>
                                <p className="tech-stack">{project.tech}</p>
                                {index === 0 && <span className="featured-badge">Featured</span>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Example 4: Conditional styling based on A/B test
const NavigationABTest = () => {
    const { variant, isVariant } = useABTest('navigation-style-test');

    const navClass = `navigation ${
        isVariant('variant_a') ? 'nav-minimal' : 
        isVariant('variant_b') ? 'nav-bold' : 
        'nav-default'
    }`;

    return (
        <nav className={navClass}>
            <div className="nav-brand">Portfolio</div>
            <ul className="nav-links">
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    );
};

// Main example component that combines all tests
const ABTestExample = () => {
    return (
        <div className="ab-test-examples">
            <h1>A/B Testing Examples</h1>
            
            <section>
                <h2>Hero Section A/B Test</h2>
                <HeroSectionABTest />
            </section>
            
            <section>
                <h2>Contact Button A/B Test</h2>
                <ContactSectionABTest />
            </section>
            
            <section>
                <h2>Project Showcase A/B Test</h2>
                <ProjectShowcaseABTest />
            </section>
            
            <section>
                <h2>Navigation Style A/B Test</h2>
                <NavigationABTest />
            </section>
            
            <div className="ab-test-info">
                <h3>How to Use A/B Testing in Your Portfolio:</h3>
                <ol>
                    <li>Create experiments using the A/B Test Dashboard</li>
                    <li>Use the useABTest hook to get variant assignments</li>
                    <li>Render different content based on the variant</li>
                    <li>Track conversions when users take desired actions</li>
                    <li>Analyze results to determine the best performing variant</li>
                </ol>
                
                <h3>Best Practices:</h3>
                <ul>
                    <li>Test one element at a time for clear results</li>
                    <li>Run tests long enough to gather significant data</li>
                    <li>Define clear conversion goals before starting</li>
                    <li>Use consistent user identification across sessions</li>
                    <li>Always have a fallback (control) variant</li>
                </ul>
            </div>
        </div>
    );
};

export default ABTestExample;