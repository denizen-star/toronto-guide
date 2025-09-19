# LifePlanner v1.0 Installation Guide

## 🌐 Option 1: Use Live Application (Recommended)

**Easiest way to use LifePlanner:**
- Visit: https://kervinapps.com/LifePlanner
- No installation required
- Always up-to-date
- Mobile-friendly

## 💻 Option 2: Local Development

### Prerequisites
- Web browser (Chrome, Firefox, Safari, Edge)
- Git (optional, for cloning)

### Quick Setup
```bash
# Download the repository
git clone https://github.com/denizen-star/toronto-guide.git
cd toronto-guide/lifeplanner/v1.0

# Open in browser
open web/index.html
# OR
python -m http.server 8000  # Then visit localhost:8000/web/
```

### File Structure
```
v1.0/web/
├── index.html                 # Main interface
├── kevin_yearly_plan_working.html      # Working Kevin
└── kevin_yearly_plan_job_search.html   # Job Search Kevin
```

## 🚀 Option 3: Deploy Your Own

### Static Hosting (Netlify, Vercel, GitHub Pages)
```bash
# 1. Copy v1.0/web/ contents to your hosting
# 2. Set index.html as the main file
# 3. Configure custom domain (optional)
```

### Netlify Deployment
```toml
# netlify.toml
[build]
  publish = "v1.0/web"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Apache/Nginx
```bash
# Copy v1.0/web/ to your web server directory
# Configure virtual host to serve index.html
```

## 🔧 Python Backend (Optional)

If you want to use the Python scheduling engine:

```bash
# Install dependencies
cd v1.0/core/
pip install -r requirements.txt

# Run schedule generator
python enhanced_schedule_generator.py

# Start local server
python -m http.server 8000
```

## 📱 Mobile Access

LifePlanner v1.0 is fully responsive:
- Works on all mobile browsers
- Touch-friendly interface
- Optimized for small screens
- No app installation needed

## 🔍 Troubleshooting

### Common Issues

**Links not working?**
- Ensure all HTML files are in the same directory
- Check file permissions
- Use a local server instead of file:// URLs

**Styling broken?**
- Verify static/ folder is accessible
- Check browser developer tools for errors
- Clear browser cache

**Mobile display issues?**
- Enable responsive design mode in browser
- Check viewport meta tag is present
- Test on actual mobile device

### Browser Compatibility
- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support  
- **Safari**: ✅ Full support
- **Edge**: ✅ Full support
- **Internet Explorer**: ❌ Not supported

## 📊 Performance Optimization

### For Production Deployment
1. **Minify CSS/JS**: Reduce file sizes
2. **Optimize Images**: Compress assets
3. **Enable Gzip**: Server-side compression
4. **CDN**: Use content delivery network
5. **Caching**: Set appropriate cache headers

### Monitoring
- Use browser dev tools to check load times
- Test on various devices and connections
- Monitor Core Web Vitals

## 🔒 Security Considerations

### Static Hosting (Recommended)
- No server-side vulnerabilities
- HTTPS enabled by default on modern hosts
- No database or user data storage

### Custom Deployment
- Enable HTTPS/SSL
- Set security headers
- Regular updates and monitoring

## 📈 Analytics (Optional)

Add analytics to track usage:
```html
<!-- Add to index.html <head> -->
<script>
  // Your analytics code here
</script>
```

## 🎯 Next Steps

After installation:
1. **Test the interface** - Try both Kevin personas
2. **Check mobile compatibility** - Test on phone/tablet
3. **Customize if needed** - Modify colors, text, or schedules
4. **Share with users** - Provide the URL or access instructions

## 📞 Support

Need help with installation?
- Check the troubleshooting section above
- Review browser console for errors
- Ensure all files are properly copied
- Test with a simple HTTP server

---

**Ready to use LifePlanner v1.0!** 🚀
