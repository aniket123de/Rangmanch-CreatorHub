# Creator Hub Deployment Guide

## Vercel Deployment Steps

### 1. **Deploy Creator Hub to Vercel**
1. Go to [Vercel](https://vercel.com)
2. Import your Creator Hub project from GitHub
3. Set the **Root Directory** to: `Creator Hub`
4. Add Environment Variables in Vercel Dashboard:
   - Key: `NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY`
   - Value: `AIzaSyAOnPkSGxDTW79dZYZM98eOIQEbyNGs894`
   - Environment: All (Production, Preview, Development)
5. Deploy the project

### 2. **Update Main Dashboard**
After Creator Hub is deployed, update the main dashboard:

1. Open `src/components/CreatorHub.tsx`
2. Replace the production URL with your actual Vercel URL:
   ```tsx
   const creatorHubUrl = process.env.NODE_ENV === 'production' 
     ? 'https://YOUR_ACTUAL_VERCEL_URL.vercel.app/dashboard'
     : 'http://localhost:3001/dashboard';
   ```

### 3. **Deploy Main Dashboard**
1. Deploy your main dashboard to Vercel
2. The Creator Hub will be embedded as an iframe

## Important Notes

### Security Headers
- The Creator Hub is configured to allow iframe embedding
- CSP headers allow embedding from Vercel domains

### Environment Variables
- Make sure to add the Gemini API key to Vercel environment variables
- The API key is already configured in the project

### CORS and Iframe Issues
- If you encounter iframe loading issues, check the browser console
- Ensure both apps are served over HTTPS in production

### Testing
1. Test locally first: `npm run dev`
2. Test the deployed version
3. Verify the iframe embedding works properly

## Troubleshooting

### Common Issues:
1. **Iframe not loading**: Check CSP headers and X-Frame-Options
2. **API not working**: Verify the Gemini API key is set correctly
3. **CORS errors**: Ensure proper headers are configured

### Browser Console Errors:
- Check for any security or CORS-related errors
- Verify the iframe URL is accessible

## Project Structure
```
Creator Hub/
├── app/
│   └── dashboard/
│       └── layout.tsx (No sidebar - clean iframe content)
├── .env.local (API key)
├── next.config.mjs (Iframe headers)
└── vercel.json (Deployment config)
```

## Features Removed for Clean Integration
- ✅ Database dependencies removed
- ✅ Authentication removed  
- ✅ Billing/subscription removed
- ✅ Sidebar navigation removed
- ✅ Clean iframe-friendly layout
- ✅ Unlimited free usage
