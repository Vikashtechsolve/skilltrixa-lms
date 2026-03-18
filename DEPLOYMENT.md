# Deployment Guide

## Quick Fix for "Cannot connect to server at http://localhost:8000"

This error means `VITE_API_URL` environment variable is **NOT SET** during build time.

### Step-by-Step Fix

#### For Vercel:
1. Go to your project → Settings → Environment Variables
2. Add new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-api.com` (your actual backend URL)
   - **Environment**: Production, Preview, Development (select all)
3. Click **Save**
4. Go to **Deployments** tab
5. Click **⋯** on latest deployment → **Redeploy**
6. Wait for rebuild to complete
7. Check browser console - should show your API URL, not localhost

#### For Netlify:
1. Go to Site Settings → Environment Variables
2. Click **Add a variable**
3. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-api.com`
   - **Scopes**: All scopes (or specific ones)
4. Click **Save**
5. Go to **Deploys** tab
6. Click **Trigger deploy** → **Deploy site**
7. Wait for rebuild
8. Check browser console

#### For GitHub Actions / CI/CD:
Add to your workflow file:
```yaml
env:
  VITE_API_URL: ${{ secrets.VITE_API_URL }}
```

Make sure secret is set in GitHub repository settings.

#### For Manual Deployment:
```bash
# Set environment variable
export VITE_API_URL=https://your-backend-api.com

# Verify it's set
echo $VITE_API_URL

# Build
npm run build

# Deploy dist/ folder
```

## Verification

After deployment, open browser console. You should see:
```
🔗 API Base URL: https://your-backend-api.com
🔗 Environment Variable VITE_API_URL: https://your-backend-api.com
🔗 Mode: production
🔗 Production: true
```

If you see:
```
🔗 API Base URL: http://localhost:8000
🔗 Environment Variable VITE_API_URL: NOT SET
```

Then the environment variable wasn't set during build. Follow the steps above.

## Common Issues

### Issue 1: Variable set but still showing localhost
**Solution**: You need to rebuild after setting the variable. Vite embeds env vars at build time.

### Issue 2: Variable name wrong
**Solution**: Must be `VITE_API_URL` (with `VITE_` prefix), not `API_URL` or `REACT_APP_API_URL`

### Issue 3: Variable set in wrong environment
**Solution**: Make sure it's set for Production environment, not just Development

### Issue 4: Cached build
**Solution**: Clear build cache and rebuild:
- Vercel: Settings → General → Clear Build Cache
- Netlify: Deploys → Clear cache and retry deploy

## Testing Locally Before Deployment

```bash
# Set environment variable
export VITE_API_URL=https://your-backend-api.com

# Verify
npm run verify-env

# Build
npm run build

# Preview
npm run preview
```

Check the preview - console should show your API URL.

