# Render Deployment Guide

## For Render.com Deployment:

### 1. Build Configuration
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node Version**: 18+ (recommended: 18.17.0)
- **Environment**: Node

### 2. Environment Variables (Required)
Set these in your Render dashboard:

```bash
NODE_ENV=production
PORT=10000
NEXTAUTH_URL=https://your-app-name.onrender.com
NEXTAUTH_SECRET=your-super-secret-key-here
WEBSITE_URL=https://your-app-name.onrender.com

# Email Configuration
GMAIL_USER=your-email@gmail.com
PassKey=your-gmail-app-password

# Database URLs
MONGODB_URI=your-mongodb-connection-string
NEO4J_URI=your-neo4j-connection-string
NEO4J_USERNAME=your-neo4j-username  
NEO4J_PASSWORD=your-neo4j-password

# Azure Storage (if using)
AZURE_STORAGE_CONNECTION_STRING=your-azure-storage-string
```

### 3. Important Notes:
- Remove `.env.local` from production (it's for local development only)
- Make sure all environment variables are set in Render dashboard
- The app uses a custom Node.js server with Socket.IO
- Build will create optimized production files in `.next` directory

### 4. Troubleshooting:
- If build fails, check Node.js version (use 18.17.0)
- If start fails, ensure all environment variables are set
- For Socket.IO issues, check if WebSockets are enabled

### 5. Health Check:
- The app runs on the PORT environment variable (default 10000 on Render)
- Health check endpoint: `GET /api/health` (if implemented)
