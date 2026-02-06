# Quick Railway Deployment Checklist

## Before Deployment
- [ ] Fork/clone the repository: https://github.com/JBANALO/ILS-WMSU.git
- [ ] Have Railway account ready
- [ ] Have MySQL database access (local or cloud)

## During Railway Setup

### Step 1: Create Railway Project
- [ ] Go to https://railway.app/dashboard
- [ ] Click "New Project" → "Deploy from GitHub repo"
- [ ] Select "JBANALO/ILS-WMSU"
- [ ] Authorize Railway with GitHub

### Step 2: Add MySQL Database
- [ ] In Railway project, click "Add Service"
- [ ] Select "MySQL" from templates
- [ ] Wait for MySQL to deploy
- [ ] Note the database credentials shown in Railway

### Step 3: Configure Environment Variables
In Railway Variables section, add:

```
NODE_ENV=production
PORT=8080

DB_HOST=<from MySQL service>
DB_USER=<from MySQL service>
DB_PASSWORD=<from MySQL service>
DB_NAME=wmsu_ed
DB_PORT=3306

JWT_SECRET=<generate-strong-random-key>
VITE_API_URL=https://<your-railway-domain>.up.railway.app/api
```

### Step 4: Deploy
- [ ] Click "Deploy" button
- [ ] Wait for build to complete (watch logs)
- [ ] Verify status shows "ACTIVE"

### Step 5: Initialize Database
After deployment succeeds:

1. Get MySQL credentials from Railway
2. Connect to database using MySQL client:
   ```bash
   mysql -h <DB_HOST> -u <DB_USER> -p
   ```
3. Create database and import schema:
   ```sql
   CREATE DATABASE wmsu_ed CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE wmsu_ed;
   ```
4. Import SQL files (run from your machine):
   ```bash
   mysql -h <DB_HOST> -u <DB_USER> -p wmsu_ed < database/users.sql
   mysql -h <DB_HOST> -u <DB_USER> -p wmsu_ed < database/classes.sql
   mysql -h <DB_HOST> -u <DB_USER> -p wmsu_ed < database/students.sql
   mysql -h <DB_HOST> -u <DB_USER> -p wmsu_ed < database/attendance.sql
   mysql -h <DB_HOST> -u <DB_USER> -p wmsu_ed < database/grades.sql
   ```

### Step 6: Verify Deployment
- [ ] Visit `https://<your-railway-domain>.up.railway.app/`
- [ ] Should see WMSU Portal login page
- [ ] Test login with admin credentials
- [ ] Test grades management
- [ ] Test report card export

## Environment Variables Quick Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `NODE_ENV` | Deployment environment | `production` |
| `PORT` | Server port (must be 8080 for Railway) | `8080` |
| `DB_HOST` | MySQL server hostname | `mysql.railway.internal` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `secure-password-123` |
| `DB_NAME` | Database name | `wmsu_ed` |
| `DB_PORT` | MySQL port | `3306` |
| `JWT_SECRET` | JWT signing key | `your-secret-key` |
| `VITE_API_URL` | Frontend API endpoint | `https://app.railway.app/api` |

## Troubleshooting Quick Fixes

**Build Failed:**
- Check Node version in Procfile
- Verify all dependencies in package.json
- Check build logs for specific errors

**Database Connection Failed:**
- Verify DB_HOST, DB_USER, DB_PASSWORD are correct
- Ensure MySQL service is running
- Check firewall rules allow connection

**API 404 Error:**
- Verify backend is running (check logs)
- Check VITE_API_URL is correct
- Verify routes exist in server/routes/

**Frontend Not Loading:**
- Clear browser cache
- Check Vite build logs
- Verify VITE_API_URL is accessible

## Post-Deployment Steps

1. **Update Mobile App:**
   - Change API URL in MyNewApp to Railway backend URL
   - Rebuild and deploy mobile app

2. **Add Initial Data:**
   - Create admin users
   - Import student data
   - Set up classes and sections

3. **Security:**
   - Change default JWT_SECRET
   - Enable database backups
   - Set up monitoring alerts

4. **Monitor:**
   - Check Railway dashboard regularly
   - Review application logs
   - Monitor database performance

## Useful Commands

```bash
# Local development setup
npm install
cd server && npm install && cd ..

# Start development
npm run dev              # Frontend
cd server && npm run dev # Backend

# Build for production
npm run build

# Test Railway locally
PORT=8080 npm run start:prod

# MySQL backup
mysqldump -h HOST -u USER -p DATABASE > backup.sql

# Restore from backup
mysql -h HOST -u USER -p DATABASE < backup.sql
```

## Contact & Support

- Railway Support: https://railway.app/support
- Project Repository: https://github.com/JBANALO/ILS-WMSU
- Report Issues: Create GitHub issue

---

**Version:** 1.0
**Last Updated:** December 2024
**Status:** Ready for production
