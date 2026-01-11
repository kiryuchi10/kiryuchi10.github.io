# 3D Enhanced Portfolio - Netlify Version

A modern, interactive portfolio website featuring 3D components, animations, and Buy Me a Coffee integration, optimized for Netlify deployment.

## 🌟 New Features

### 🎮 3D Interactive Components
- **Scene3D**: Immersive 3D scenes with floating objects and particle effects
- **InteractiveCard3D**: Clickable 3D cards showcasing skills and services
- **ParticleSystem**: Dynamic particle effects with connection networks
- **Smooth Animations**: Framer Motion integration for seamless transitions

### ☕ Buy Me a Coffee Integration
- **Floating Support Button**: Persistent, non-intrusive support option
- **Inline Widgets**: Embedded support components throughout the site
- **Multiple Themes**: Default, dark, and minimal styling options
- **Responsive Design**: Works perfectly on all devices

### 🚀 Performance Optimizations
- **Code Splitting**: Lazy loading for optimal performance
- **Asset Optimization**: Compressed images and optimized bundles
- **Caching Strategy**: Smart caching for faster load times
- **SEO Friendly**: Optimized for search engines

## 🛠 Tech Stack

- **Frontend**: React 18, Three.js, React Three Fiber
- **3D Graphics**: @react-three/drei, @react-three/fiber
- **Animations**: Framer Motion
- **Styling**: CSS3, CSS Modules
- **Deployment**: Netlify
- **Build Tools**: Create React App, Webpack

## 📁 Project Structure

```
kiryuchi10.github.io/
├── public/
│   ├── fonts/                 # 3D text fonts
│   └── index.html
├── src/
│   ├── components/
│   │   ├── 3D/               # 3D Components
│   │   │   ├── Scene3D.jsx
│   │   │   ├── InteractiveCard3D.jsx
│   │   │   └── ParticleSystem.jsx
│   │   ├── BuyMeACoffee.jsx  # Support integration
│   │   ├── BuyMeACoffee.css
│   │   └── ...
│   ├── hooks/
│   │   └── useABTesting.js   # A/B testing hooks
│   └── services/
│       └── abTesting.js      # A/B testing service
├── netlify.toml              # Netlify configuration
├── deploy.sh                 # Unix deployment script
├── deploy.bat                # Windows deployment script
└── NETLIFY_DEPLOYMENT_GUIDE.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kiryuchi10/kiryuchi10.github.io.git
   cd kiryuchi10.github.io
   ```

2. **Switch to the 3D branch:**
   ```bash
   git checkout netlify-3d-portfolio
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start development server:**
   ```bash
   npm start
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🌐 Deployment

### Automated Deployment

**For Unix/Linux/Mac:**
```bash
./deploy.sh
```

**For Windows:**
```bash
deploy.bat
```

### Manual Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   ```bash
   npm run deploy:netlify
   ```

### Environment Variables

Set these in your Netlify dashboard:

```env
NODE_ENV=production
REACT_APP_API_URL=https://your-backend-api.com
REACT_APP_BUYMEACOFFEE_USERNAME=your-username
```

## 🎨 Customization

### 3D Scene Configuration

```jsx
<Scene3D 
  text="Your Custom Text"
  showText={true}
  enableControls={true}
  cameraPosition={[0, 0, 10]}
  backgroundColor="#your-color"
/>
```

### Particle System Options

```jsx
<ParticleSystem 
  particleCount={1000}
  showConnections={true}
  color="#4a90e2"
  height="400px"
/>
```

### Buy Me a Coffee Setup

1. **Create account** at [buymeacoffee.com](https://www.buymeacoffee.com) or use [coff.ee](https://coff.ee)
2. **Update username** in components:
   ```jsx
   <BuyMeACoffee username="your-username" />
   ```
   
   Note: The component automatically uses the correct URL format (coff.ee/username)

## 📱 Responsive Design

The portfolio is fully responsive and optimized for:
- **Desktop**: Full 3D experience with all interactions
- **Tablet**: Optimized 3D performance with touch controls
- **Mobile**: Simplified 3D effects for better performance

## 🔧 Performance Tips

### 3D Optimization
- Reduce particle count on mobile devices
- Use `Suspense` for lazy loading 3D components
- Implement level-of-detail (LOD) for complex scenes

### Bundle Optimization
```bash
# Analyze bundle size
npm run analyze

# Check performance
npm run build && npx serve -s build
```

## 🧪 A/B Testing

The portfolio includes built-in A/B testing capabilities:

```jsx
import { useABTest } from '../hooks/useABTesting';

const MyComponent = () => {
  const { variant, trackConversion } = useABTest('experiment-id');
  
  return (
    <div>
      {variant === 'control' && <OriginalComponent />}
      {variant === 'variant_a' && <NewComponent />}
    </div>
  );
};
```

## 📊 Analytics Integration

### Google Analytics
Add your tracking ID to `public/index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
```

### Performance Monitoring
- Core Web Vitals tracking
- 3D performance metrics
- User interaction analytics

## 🔒 Security

### Content Security Policy
Configured in `netlify.toml`:

```toml
Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.buymeacoffee.com;"
```

### Environment Variables
- Never commit sensitive data
- Use Netlify's environment system
- Prefix client variables with `REACT_APP_`

## 🐛 Troubleshooting

### Common Issues

1. **3D Components Not Loading**
   - Check WebGL support: `chrome://gpu/`
   - Verify Three.js dependencies
   - Check browser console for errors

2. **Performance Issues**
   - Reduce particle count
   - Enable hardware acceleration
   - Use Chrome DevTools Performance tab

3. **Build Failures**
   - Clear cache: `rm -rf node_modules && npm install`
   - Check Node.js version: `node --version`
   - Verify all dependencies

### Debug Commands

```bash
# Local build test
npm run build && npx serve -s build

# Bundle analysis
npm run analyze

# Performance audit
npm install -g lighthouse
lighthouse http://localhost:3000
```

## 📈 SEO Optimization

### Meta Tags
Updated in `public/index.html`:

```html
<meta name="description" content="Interactive 3D Portfolio - Full Stack Developer">
<meta name="keywords" content="3D, React, Three.js, Portfolio, Web Development">
<meta property="og:title" content="Your Name - 3D Portfolio">
```

### Structured Data
JSON-LD structured data for better search visibility.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **Framer Motion** - Animation library
- **Buy Me a Coffee** - Support platform
- **Netlify** - Deployment platform

## 📞 Support

- **Documentation**: Check the guides in the `/docs` folder
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Email**: donghyeunlee1@gmail.com

## 🎉 Live Demo

**Production Site**: [https://your-site.netlify.app](https://your-site.netlify.app)

---

**Built with ❤️ and lots of ☕**

If you find this project helpful, consider [buying me a coffee](https://coff.ee/kiryuchi10)!