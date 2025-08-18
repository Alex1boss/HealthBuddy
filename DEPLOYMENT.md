# Deploying Daily Health Buddy to Vercel

## Prerequisites
- Vercel account
- Git repository with your code

## Deployment Steps

### 1. Prepare Your Repository
Your repository should contain:
- `app.py` (main Flask application)
- `index.py` (Vercel entry point)
- `vercel.json` (Vercel configuration)
- `templates/` folder with HTML templates
- `static/` folder with CSS and JavaScript
- `deploy_requirements.txt` (rename to `requirements.txt` for deployment)

### 2. Rename Requirements File
Before pushing to your Git repository, rename `deploy_requirements.txt` to `requirements.txt`:
```bash
mv deploy_requirements.txt requirements.txt
```

### 3. Create Git Repository
```bash
git init
git add .
git commit -m "Initial commit - Daily Health Buddy"
```

### 4. Push to GitHub
```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/yourusername/daily-health-buddy.git
git branch -M main
git push -u origin main
```

### 5. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure project settings:
   - **Framework Preset**: Select "Other" 
   - **Root Directory**: Leave as default (.)
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
   - **Install Command**: Leave empty (auto-detected)
6. Click "Deploy"

### 6. Configuration
- Vercel will automatically use the `vercel.json` configuration
- The `index.py` file serves as the entry point
- Static files will be served from the `static/` folder
- Templates will be served from the `templates/` folder

## Environment Variables
If you need environment variables (like SESSION_SECRET):
1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add: `SESSION_SECRET` with a secure random value

## Custom Domain (Optional)
1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow the DNS configuration instructions

## Files Created for Deployment:
- `vercel.json` - Vercel configuration
- `index.py` - Entry point for Vercel
- `.vercelignore` - Files to ignore during deployment
- `deploy_requirements.txt` - Python dependencies (rename to requirements.txt)

## Testing Locally
You can test the application locally using:
```bash
python app.py
```

The application will run on `http://localhost:5000`

## Notes
- This is a static web application with client-side calculations
- No database is required, making it perfect for Vercel's serverless platform
- All calculations are performed in JavaScript on the client side
- The Flask app only serves the static HTML template