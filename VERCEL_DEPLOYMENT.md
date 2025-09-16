# Vercel Deployment Guide for Protein Feature Viewer

This guide will help you deploy your Protein Feature Viewer project to Vercel.

## Prerequisites

1. **Git Repository**: Your project should be in a Git repository (GitHub, GitLab, or Bitbucket)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Node.js**: Make sure your project has proper `package.json` and build configuration

## Deployment Steps

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect your repository to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your Git repository
   - Select your protein-feature-viewer repository

2. **Configure build settings:**
   - Vercel should automatically detect it's a Node.js project
   - Build Command: `npm run build:vercel` (already configured)
   - Output Directory: `dist` (already configured in vercel.json)
   - Install Command: `npm install` (default)

3. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy your project
   - You'll get a live URL once deployment is complete

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from project directory:**
   ```bash
   cd d:\Development\Projects\protein-feature-viewer
   vercel
   ```

4. **Follow the prompts:**
   - Link to existing project or create new one
   - Confirm settings
   - Deploy

### Method 3: Deploy via Git Integration

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add Vercel deployment configuration"
   git push origin main
   ```

2. **Auto-deploy setup:**
   - Once connected to Vercel, every push to main branch will auto-deploy
   - Pull requests will get preview deployments

## Configuration Files Added

- **`vercel.json`**: Deployment configuration
- **`package.json`**: Added `build:vercel` script for Vercel-compatible builds

## Build Process

The Vercel build will:
1. Run `npm install` to install dependencies
2. Run `npm run build:vercel` to build the project with webpack
3. Serve files from the `dist` directory
4. Route all requests to `index.html` for SPA behavior

## Environment Variables (if needed)

If your project needs environment variables:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add your variables for Production, Preview, and Development

## Troubleshooting

### Common Issues:

1. **Build fails due to TypeScript errors:**
   - Fix TypeScript compilation errors
   - Check `tsconfig.json` configuration

2. **Missing dependencies:**
   - Ensure all dependencies are in `package.json`
   - Run `npm install` locally to verify

3. **Path issues:**
   - Verify file paths are correct in webpack config
   - Check import statements

4. **Large build size:**
   - Optimize webpack bundle splitting
   - Use code splitting for better performance

## Post-Deployment

After successful deployment:
1. Test all functionality on the live URL
2. Check browser console for any errors
3. Verify responsive design works correctly
4. Test feature viewer interactions

## Custom Domain (Optional)

To use a custom domain:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions

Your Protein Feature Viewer should now be live on Vercel! 🚀