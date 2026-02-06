Test if backend is running by visiting these URLs:

1. Backend API Root:
   https://deployed-ils-wmsu-production.up.railway.app/

   Should show: "WMSU Portal API is running"

2. Test API endpoint:
   https://deployed-ils-wmsu-production.up.railway.app/api/auth/test

3. Users endpoint:
   https://deployed-ils-wmsu-production.up.railway.app/api/users

If you see "Cannot GET /" or a 404, then the backend is not running properly.

The issue is that your VITE_API_URL environment variable is set to:
https://deployed-ils-wmsu-production-5c4879c9.up.railway.app/api

But this should point to where your backend server is actually running.

SOLUTION:
Since your Railway deployment should be running the backend server (based on the Procfile changes), you need to update VITE_API_URL or build a separate frontend deployment.

Current architecture issue:
- You're trying to serve BOTH frontend AND backend from one deployment
- This won't work with the current setup

Recommended fix:
1. This deployment should ONLY run the backend
2. Create a separate deployment for the frontend with proper VITE_API_URL pointing to the backend
