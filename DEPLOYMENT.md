# Smart Gaushala - Render Deployment Guide

## Overview
This guide explains how to deploy the Smart Gaushala waste management system on Render.com.

## Prerequisites
- GitHub repository with the code
- Render.com account (free tier available)
- Node.js 18+ knowledge

## Deployment Steps

### 1. Backend Deployment (Web Service)

1. **Go to Render Dashboard**
   - Login to https://dashboard.render.com
   - Click "New" -> "Web Service"

2. **Connect Repository**
   - Connect your GitHub account
   - Select the `Bhumika197/cep` repository
   - Choose the `server` directory as root

3. **Configure Service**
   - **Name**: smart-gaushala-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node simple-server.js`
   - **Instance Type**: Free

4. **Environment Variables**
   - `NODE_ENV`: `production`
   - `PORT`: `5002`

5. **Advanced Settings**
   - **Health Check Path**: `/api/health`
   - **Auto-Deploy**: Enable

### 2. Frontend Deployment (Static Site)

1. **Create New Web Service**
   - Click "New" -> "Web Service"
   - Select same repository
   - Choose the `client` directory as root

2. **Configure Service**
   - **Name**: smart-gaushala-frontend
   - **Environment**: Static
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Instance Type**: Free

3. **Environment Variables**
   - `VITE_API_URL`: `https://smart-gaushala-backend.onrender.com`

4. **Custom Routes**
   - Add rewrite rule for API calls:
     - **Source**: `/api/*`
     - **Destination**: `https://smart-gaushala-backend.onrender.com/api/*`
   - Add SPA fallback:
     - **Source**: `/*`
     - **Destination**: `/index.html`

## Post-Deployment

### 1. Test the Application
- Visit your frontend URL
- Test login functionality
- Verify data persistence
- Check all features work

### 2. Update Environment Variables
If needed, update the frontend environment variable:
```bash
# In Render dashboard for frontend service
VITE_API_URL=https://your-backend-url.onrender.com
```

### 3. Monitor Health
- Check backend health: `https://your-backend-url.onrender.com/api/health`
- Monitor logs in Render dashboard
- Set up alerts if needed

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend allows frontend origin
   - Check CORS middleware configuration

2. **API Connection Issues**
   - Verify `VITE_API_URL` is correct
   - Check backend service is running

3. **Build Failures**
   - Check package.json scripts
   - Verify all dependencies are installed

4. **Health Check Failures**
   - Ensure `/api/health` endpoint exists
   - Check server is listening on correct port

### Environment Variables Reference

**Backend:**
- `NODE_ENV`: `production`
- `PORT`: `5002` (or Render's assigned port)

**Frontend:**
- `VITE_API_URL`: Backend URL (e.g., `https://smart-gaushala-backend.onrender.com`)

## URLs After Deployment

- **Backend**: `https://smart-gaushala-backend.onrender.com`
- **Frontend**: `https://smart-gaushala-frontend.onrender.com`
- **API Health**: `https://smart-gaushala-backend.onrender.com/api/health`

## Maintenance

### Regular Tasks
- Monitor application logs
- Update dependencies as needed
- Check for security vulnerabilities
- Backup data if using external database

### Scaling Considerations
- Upgrade to paid tiers for better performance
- Consider database for persistent storage
- Implement caching for better performance
- Add monitoring and alerting

## Support

For Render-specific issues:
- Check Render documentation: https://render.com/docs
- Contact Render support: support@render.com

For application issues:
- Check GitHub repository
- Review deployment logs
- Test locally with production settings
