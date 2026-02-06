# Railway Deployment Guide

This guide will help you deploy the WMSU ILS Elementary Portal to Railway.

## Prerequisites

1. Railway account (https://railway.app)
2. GitHub repository access (https://github.com/JBANALO/ILS-WMSU.git)
3. MySQL database ready or Railway MySQL plugin

## Step 1: Connect GitHub Repository to Railway

1. Go to [Railway Dashboard](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select "JBANALO/ILS-WMSU" repository
4. Authorize Railway to access your GitHub

## Step 2: Set Up Database

### Option A: Use Railway MySQL Plugin
1. In Railway project, click "Add Service"
2. Select "MySQL" from the template library
3. Railway will automatically create a MySQL service
4. Copy the database credentials from the "MySQL" service variables

### Option B: Use Existing MySQL Database
1. In Railway project, click "Variables" (or Variables tab)
2. Add the following environment variables:
   ```
   DB_HOST=your-mysql-server-ip-or-hostname
   DB_USER=your-database-user
   DB_PASSWORD=your-password
   DB_NAME=wmsu_ed
   DB_PORT=3306
   ```

## Step 3: Configure Environment Variables

In Railway Dashboard, go to your deployment and add these environment variables:

**Required Variables:**
```
NODE_ENV=production
PORT=8080

# Database (from Step 2)
DB_HOST=xxxxx
DB_USER=xxxxx
DB_PASSWORD=xxxxx
DB_NAME=wmsu_ed
DB_PORT=3306

# Frontend API URL (get this after deployment)
VITE_API_URL=https://YOUR-RAILWAY-DOMAIN.up.railway.app/api

# JWT Secret
JWT_SECRET=your-super-secret-key-change-this
```

**Optional Variables:**
```
# Email configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## Step 4: Database Setup

### Import Tables

After the initial deployment, SSH into the Railway container or use MySQL client to import the database schema:

1. **Run migrations:**
   ```bash
   mysql -h YOUR_DB_HOST -u YOUR_DB_USER -p wmsu_ed < database/users.sql
   mysql -h YOUR_DB_HOST -u YOUR_DB_USER -p wmsu_ed < database/classes.sql
   mysql -h YOUR_DB_HOST -u YOUR_DB_USER -p wmsu_ed < database/students.sql
   mysql -h YOUR_DB_HOST -u YOUR_DB_USER -p wmsu_ed < database/attendance.sql
   mysql -h YOUR_DB_HOST -u YOUR_DB_USER -p wmsu_ed < database/grades.sql
   ```

2. **Add initial admin user:**
   - Run the PHP script: `database/add_admin_josie.php`
   - Or use the API to create an admin user

## Step 5: Update Deployment Configuration

The project already includes:
- **Procfile** - Specifies production start command
- **railway.json** - Railway configuration with build settings
- **.env.production** - Production environment template
- **vite.config.js** - Frontend build configuration
- **axiosConfig.js** - API client using VITE_API_URL environment variable

## Step 6: Monitor Deployment

1. In Railway Dashboard, click your project
2. View deployment logs in real-time
3. Check for any build or runtime errors
4. Verify the application status shows "ACTIVE"

## Step 7: Test Deployment

Once deployed and showing "ACTIVE":

1. **Test Backend API:**
   - Visit: `https://YOUR-RAILWAY-DOMAIN.up.railway.app/`
   - Should see: "WMSU Portal API is running"

2. **Test Frontend:**
   - Visit: `https://YOUR-RAILWAY-DOMAIN.up.railway.app/`
   - Should load the WMSU Portal login page

3. **Test Authentication:**
   - Login with an admin account (default: username: admin, password: admin)
   - Test accessing grades, attendance, classes pages

4. **Test Report Card Export:**
   - Navigate to Grades management
   - Select a student and quarter
   - Click "Export Report Card"
   - Verify PDF exports correctly

## Step 8: Update Mobile App

After deployment, update the mobile app (MyNewApp) to use the production API:

In `MyNewApp/src/services/authService.js` or similar, update:
```javascript
const API_URL = 'https://YOUR-RAILWAY-DOMAIN.up.railway.app/api';
```

Then rebuild and deploy the mobile app.

## Troubleshooting

### Database Connection Failed
- Check DB_HOST, DB_USER, DB_PASSWORD, DB_NAME variables are set correctly
- Ensure database server is accessible from Railway (check firewall rules)
- Verify MySQL is running and user has proper permissions

### Build Failed
- Check Railway build logs for specific error messages
- Ensure all dependencies are installed: `npm install` in both root and server/
- Verify Node.js version compatibility (v16 or higher recommended)

### API Returns 404
- Verify backend is running (check deployment logs)
- Check VITE_API_URL environment variable is set correctly in Railway
- Ensure routes are defined in server/routes/

### Frontend Not Loading
- Check Vite build process in deployment logs
- Verify VITE_API_URL is accessible from browser
- Clear browser cache and hard refresh

### Database Tables Missing
- Verify database migration scripts were run
- Check database credentials and permissions
- Run migration scripts manually via SSH or MySQL client

## Production Best Practices

1. **Change default passwords:**
   - Admin account password
   - JWT_SECRET (use a strong random key)
   - Database password

2. **Enable HTTPS:**
   - Railway provides automatic HTTPS
   - Update all references from `http://` to `https://`

3. **Database Backups:**
   - Set up automatic backups for MySQL
   - Use Railway's backup features

4. **Environment Separation:**
   - Use `.env.production` for sensitive variables
   - Never commit `.env` files to GitHub

5. **Monitor Performance:**
   - Check Railway dashboard for resource usage
   - Monitor database connections and queries
   - Review application logs for errors

6. **Security:**
   - Implement rate limiting on API endpoints
   - Validate all user inputs server-side
   - Use CORS whitelist for frontend domain
   - Keep dependencies updated

## Post-Deployment Verification

- [ ] Backend API responding
- [ ] Frontend loading
- [ ] Database connected
- [ ] User authentication working
- [ ] Grades CRUD operations functional
- [ ] Report card export working
- [ ] Attendance tracking functional
- [ ] Mobile app can connect to API

## Support & Documentation

- Railway Docs: https://docs.railway.app
- Node.js Docs: https://nodejs.org/docs/
- Express Docs: https://expressjs.com
- React Docs: https://react.dev
- MySQL Docs: https://dev.mysql.com/doc/

---

**Last Updated:** $(date)
**Status:** Ready for production deployment
