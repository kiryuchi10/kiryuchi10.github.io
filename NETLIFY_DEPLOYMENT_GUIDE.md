# Netlify Deployment Guide - 3D Enhanced Portfolio

This guide will help you deploy your enhanced 3D portfolio to Netlify.

## 🚀 New Features in This Version

### 3D Components
- **Scene3D**: Interactive 3D scenes with floating objects and animations
- **InteractiveCard3D**: Clickable 3D cards for showcasing skills/services
- **ParticleSystem**: Dynamic particle effects with connection lines
- **Enhanced Animations**: Smooth transitions and hover effects

### Buy Me a Coffee Integration
- **Floating Button**: Persistent support button
- **Inline Widgets**: Embedded support options
- **Card Component**: Full support section with benefits
- **Multiple Themes**: Default, dark, and minimal styles

### Performance Optimizations
- **Code Splitting**: Lazy loading for 3D components
- **Asset Optimization**: Compressed images and fonts
- **Caching Strategy**: Optimized cache headers
- **Bundle Analysis**: Built-in bundle analyzer

## 📋 Prerequisites

1. **Node.js** (version 18 or higher)
2. **npm** or **yarn**
3. **Netlify CLI** (optional but recommended)
4. **Git** for version control

## 🛠 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Netlify CLI (Optional)

```bash
npm install -g netlify-cli
```

### 3. Configure Environment Variables

Create a `.env.production` file:

```env
REACT_APP_API_URL=https://your-backend-api.com
REACT_APP_BUYMEACOFFEE_USERNAME=kiryuchi10
NODE_ENV=production
```

### 4. Update Buy Me a Coffee Username

In the following files, replace `kiryuchi10` with your actual Buy Me a Coffee username:

- `src/components/BuyMeACoffee.jsx`
- `src/components/Home.jsx`
- `src/components/Works.jsx`
- `src/components/ContactForm.jsx`

## 🌐 Deployment Methods

### Method 1: Netlify CLI (Recommended)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Deploy to preview:**
   ```bash
   npm run preview:netlify
   ```

4. **Deploy to production:**
   ```bash
   npm run deploy:netlify
   ```

### Method 2: Git Integration

1. **Push to your repository:**
   ```bash
   git add .
   git commit -m "Add 3D components and Buy Me a Coffee integration"
   git push origin netlify-3d-portfolio
   ```

2. **Connect to Netlify:**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Choose your repository
   - Select the `netlify-3d-portfolio` branch
   - Build settings will be auto-detected from `netlify.toml`

### Method 3: Drag and Drop

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Drag the `build` folder** to Netlify's deploy area

## ⚙️ Configuration Files

### netlify.toml
```toml
[build]
  publish = "build"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### package.json Scripts
```json
{
  "scripts": {
    "deploy:netlify": "npm run build && netlify deploy --prod --dir=build",
    "preview:netlify": "npm run build && netlify deploy --dir=build",
    "analyze": "npm run build && npx bundle-analyzer build/static/js/*.js"
  }
}
```

## 🔧 Environment Variables in Netlify

Set these in your Netlify dashboard under Site Settings > Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `REACT_APP_API_URL` | `https://your-api.com` | Backend API URL |
| `REACT_APP_BUYMEACOFFEE_USERNAME` | `your-username` | Buy Me a Coffee username (uses coff.ee format) |

## 🎨 Customization Options

### 3D Scene Customization

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

### Buy Me a Coffee Themes

```jsx
<BuyMeACoffee 
  username="your-username"
  theme="default" // default, dark, minimal
  customMessage="Support my work"
/>
```

## 📊 Performance Monitoring

### Bundle Analysis
```bash
npm run analyze
```

### Lighthouse Audit
- Use Chrome DevTools
- Check Performance, Accessibility, Best Practices, SEO
- Aim for scores above 90

### Core Web Vitals
Monitor these metrics:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## 🐛 Troubleshooting

### Common Issues

1. **3D Components Not Loading**
   - Check Three.js dependencies
   - Verify WebGL support in browser
   - Check console for errors

2. **Build Failures**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version: `node --version`
   - Verify all dependencies are installed

3. **Routing Issues**
   - Ensure `netlify.toml` has correct redirects
   - Check React Router configuration

4. **Performance Issues**
   - Reduce particle count in ParticleSystem
   - Enable lazy loading for 3D components
   - Optimize images and assets

### Debug Commands

```bash
# Check build locally
npm run build && npx serve -s build

# Analyze bundle size
npm run analyze

# Test with different Node versions
nvm use 18 && npm run build
```

## 🔒 Security Considerations

### Content Security Policy
The `netlify.toml` includes CSP headers. Update them if you add new external resources:

```toml
Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.buymeacoffee.com;"
```

### Environment Variables
- Never commit sensitive data to Git
- Use Netlify's environment variable system
- Prefix client-side variables with `REACT_APP_`

## 📈 SEO Optimization

### Meta Tags
Update `public/index.html`:

```html
<meta name="description" content="Interactive 3D Portfolio - Full Stack Developer">
<meta name="keywords" content="3D, React, Three.js, Portfolio, Web Development">
<meta property="og:title" content="Your Name - 3D Portfolio">
<meta property="og:description" content="Explore my interactive 3D portfolio">
```

### Structured Data
Add JSON-LD structured data for better search visibility.

## 🚀 Post-Deployment Checklist

- [ ] Test all 3D components work correctly
- [ ] Verify Buy Me a Coffee integration
- [ ] Check responsive design on mobile
- [ ] Test contact form functionality
- [ ] Verify all links work
- [ ] Check loading performance
- [ ] Test in different browsers
- [ ] Validate HTML and CSS
- [ ] Check accessibility compliance
- [ ] Monitor error logs

## 📞 Support

If you encounter issues:

1. Check the [Netlify Documentation](https://docs.netlify.com)
2. Review the browser console for errors
3. Check the Netlify deploy logs
4. Test locally with `npm run build && npx serve -s build`

## 🎉 Success!

Your 3D enhanced portfolio should now be live on Netlify! 

**Next Steps:**
- Set up custom domain (optional)
- Configure analytics
- Set up form notifications
- Monitor performance metrics
- Plan future enhancements

---

**Live Site:** `https://your-site-name.netlify.app`
**Admin Panel:** `https://app.netlify.com/sites/your-site-name`