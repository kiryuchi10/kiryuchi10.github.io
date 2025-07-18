/**
 * Visitor Tracking Tests
 * Tests for visitor tracking functionality
 */

import { apiUtils } from '../services/apiService';
import { 
  shouldTrackVisitor, 
  isTrackingSupported, 
  validateVisitorData,
  sanitizeVisitorData,
  isLikelyBot
} from '../utils/visitorTrackingUtils';

// Mock window and navigator objects for testing
const mockWindow = {
  location: {
    pathname: '/test',
    href: 'https://example.com/test',
    search: '?param=value',
    hash: '#section'
  },
  innerWidth: 1920,
  innerHeight: 1080,
  screen: {
    width: 1920,
    height: 1080
  }
};

const mockNavigator = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  language: 'en-US'
};

const mockDocument = {
  referrer: 'https://google.com'
};

// Test visitor data creation
describe('Visitor Data Creation', () => {
  beforeAll(() => {
    global.window = mockWindow;
    global.navigator = mockNavigator;
    global.document = mockDocument;
    global.Intl = {
      DateTimeFormat: () => ({
        resolvedOptions: () => ({ timeZone: 'America/New_York' })
      })
    };
  });

  test('should create basic visitor data', () => {
    const data = apiUtils.createVisitData();
    
    expect(data).toHaveProperty('page');
    expect(data).toHaveProperty('referrer');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('user_agent');
    expect(data).toHaveProperty('language');
    expect(data).toHaveProperty('timezone');
    
    expect(data.page).toBe('/test');
    expect(data.referrer).toBe('https://google.com');
    expect(data.user_agent).toBe(mockNavigator.userAgent);
    expect(data.language).toBe('en-US');
    expect(data.timezone).toBe('America/New_York');
  });

  test('should include viewport and screen information', () => {
    const data = apiUtils.createVisitData();
    
    expect(data.viewport_size).toBe('1920x1080');
    expect(data.screen_resolution).toBe('1920x1080');
  });
});

// Test tracking utilities
describe('Tracking Utilities', () => {
  test('should detect tracking support', () => {
    global.fetch = jest.fn();
    const supported = isTrackingSupported();
    expect(supported).toBe(true);
  });

  test('should validate visitor data correctly', () => {
    const validData = {
      page: '/test',
      timestamp: new Date().toISOString(),
      user_agent: 'Mozilla/5.0...'
    };
    
    const validation = validateVisitorData(validData);
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  test('should detect invalid visitor data', () => {
    const invalidData = {
      // Missing required fields
    };
    
    const validation = validateVisitorData(invalidData);
    expect(validation.isValid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });

  test('should sanitize visitor data', () => {
    const data = {
      page: '/test',
      referrer: 'https://example.com',
      maliciousField: '<script>alert("xss")</script>',
      user_agent: 'Mozilla/5.0...'
    };
    
    const sanitized = sanitizeVisitorData(data);
    expect(sanitized).toHaveProperty('page');
    expect(sanitized).toHaveProperty('referrer');
    expect(sanitized).toHaveProperty('user_agent');
    expect(sanitized).not.toHaveProperty('maliciousField');
  });

  test('should detect bots', () => {
    global.navigator = { userAgent: 'Googlebot/2.1' };
    expect(isLikelyBot()).toBe(true);
    
    global.navigator = { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' };
    expect(isLikelyBot()).toBe(false);
  });
});

// Test tracking configuration
describe('Tracking Configuration', () => {
  test('should respect development environment settings', () => {
    process.env.NODE_ENV = 'development';
    process.env.REACT_APP_ENABLE_TRACKING = 'false';
    
    expect(shouldTrackVisitor()).toBe(false);
    
    process.env.REACT_APP_ENABLE_TRACKING = 'true';
    expect(shouldTrackVisitor()).toBe(true);
  });

  test('should enable tracking in production', () => {
    process.env.NODE_ENV = 'production';
    expect(shouldTrackVisitor()).toBe(true);
  });
});

export default {};