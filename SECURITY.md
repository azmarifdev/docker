# 🔒 Security Guidelines

## ⚠️ IMPORTANT: Sensitive Files

The following files contain sensitive information and should **NEVER** be committed to version control:

### 🚫 Files to NEVER commit:
- `.env` files (contains secrets, API keys, database URLs)
- `node_modules/` (contains dependencies)
- `build/` and `dist/` folders (compiled code)
- Log files (`*.log`)
- Database files (`*.sqlite`, `*.db`)
- IDE files (`.vscode/`, `.idea/`)

## ✅ Safe Setup Steps

### 1. Environment Variables
```bash
# Copy the example file
cd server
cp .env.example .env

# Edit the .env file with your actual values
nano .env  # or use your preferred editor
```

### 2. Database Setup
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas (cloud) - update DB_URI in .env
```

### 3. Generate Strong Secrets
```bash
# Generate JWT secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use online generator: https://generate-secret.vercel.app/32
```

## 🔐 Environment Variables Explained

### Required:
- `DB_URI`: MongoDB connection string
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `JWT_SECRET`: Secret for JWT tokens (MUST be strong)
- `API_KEY`: API authentication key

### Optional:
- `CORS_ORIGIN`: Allowed frontend URLs
- `RATE_LIMIT_*`: API rate limiting settings
- `EMAIL_*`: Email service configuration

## 🛡️ Production Security Checklist

- [ ] Use strong, unique secrets (32+ characters)
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS in production
- [ ] Use MongoDB Atlas or secure database hosting
- [ ] Enable rate limiting
- [ ] Validate all input data
- [ ] Use CORS properly
- [ ] Keep dependencies updated
- [ ] Use security headers
- [ ] Enable logging and monitoring

## 📋 Git Best Practices

### Before first commit:
```bash
# Check what will be committed
git status

# Make sure .env is ignored
git check-ignore .env
# Should output: .env

# Add safe files only
git add .
git commit -m "Initial project setup"
```

### If you accidentally committed secrets:
```bash
# Remove from history (USE WITH CAUTION)
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env' \
  --prune-empty --tag-name-filter cat -- --all

# Force push (if repository is private and you're sure)
git push origin --force --all
```

## 🔍 Check for exposed secrets:
```bash
# Search for potential secrets in code
grep -r "password\|secret\|key\|token" . --exclude-dir=node_modules

# Use tools like:
# - git-secrets
# - truffleHog
# - GitGuardian
```

## 📝 Example .env structure:
```env
# ✅ Good - using placeholder values
DB_URI=mongodb://localhost:27017/dockerapp
JWT_SECRET=generate_a_strong_secret_here

# ❌ Bad - real secrets exposed
DB_URI=mongodb+srv://admin:realpassword123@cluster.mongodb.net/
JWT_SECRET=mysecretkey123
```

Remember: **When in doubt, don't commit it!** 🔒
