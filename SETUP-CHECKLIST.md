# Setup Checklist - Simplified CI/CD

This checklist will guide you through setting up automated quality checks and deployments.

## ✅ What's Included

- **GitHub Actions**: Automated quality checks (lint, format, type check, build) on every PR
- **Vercel Integration**: Automatic deployments for preview (PRs) and production (main branch)

---

## 📋 Setup Steps

### Step 1: Connect Vercel to GitHub (5 minutes)

This is the simplest approach - let Vercel handle all deployments:

- [ ] Go to your [Vercel dashboard](https://vercel.com/dashboard)
- [ ] Click "Add New Project" or select your existing project
- [ ] Click "Import" and select your GitHub repository
- [ ] Configure your project:
  - Framework Preset: **Next.js**
  - Root Directory: `./`
  - Build Command: `pnpm build`
  - Output Directory: `.next`
- [ ] Add environment variable: `NEXT_PUBLIC_SITE_URL` (e.g., `https://builder.van`)
- [ ] Click "Deploy"

**That's it!** Vercel will now automatically:

- Deploy to production when you push to `main`
- Create preview deployments for every pull request
- Comment on PRs with the preview URL

### Step 2: Enable GitHub Actions for Quality Checks (2 minutes)

The CI workflow is already in your repo at `.github/workflows/ci.yml`. It runs automatically on every PR.

**What it checks:**

- ✅ Code formatting (Prettier)
- ✅ Linting (ESLint)
- ✅ Type checking (TypeScript)
- ✅ Content validation (JSON schemas)
- ✅ Build success

**No additional setup needed!** It will run automatically on your next PR.

### Step 3: Set Up Branch Protection (Optional but Recommended - 5 minutes)

Protect your `main` branch to ensure all changes go through PRs:

- [ ] Go to GitHub repo → **Settings** → **Branches**
- [ ] Click **"Add branch protection rule"**
- [ ] Branch name pattern: `main`
- [ ] Enable: ✅ **Require a pull request before merging**
- [ ] Enable: ✅ **Require status checks to pass before merging**
  - Search for and add: `Quality Checks`
- [ ] Click **"Create"** or **"Save changes"**

---

## 🚀 How to Use

### Standard Workflow

```bash
# 1. Create a feature branch
git checkout -b feat/your-feature

# 2. Make your changes and commit
git add .
git commit -m "feat: add new feature"

# 3. Push to GitHub
git push origin feat/your-feature

# 4. Create a Pull Request on GitHub
# - CI checks will run automatically
# - Vercel will create a preview deployment
# - Preview URL will be posted as a comment

# 5. Once checks pass, merge the PR
# - Vercel will deploy to production automatically
```

### Local Development

Before pushing, run these checks locally:

```bash
pnpm dev               # Test in browser
pnpm format:check      # Check formatting
pnpm lint              # Check linting
pnpm tsc               # Type check
pnpm validate:content  # Validate JSON
pnpm build             # Test build
```

---

## 🎯 What You Get

✅ **Automatic Deployments**: Every push to main goes to production  
✅ **Preview Deployments**: Every PR gets its own preview URL  
✅ **Quality Checks**: Code must pass all checks before merging  
✅ **Zero Configuration**: No manual deployment steps  
✅ **Simple & Reliable**: Vercel handles all the complexity

---

## 🚨 Troubleshooting

### CI Checks Failing

1. Check the **Actions** tab on GitHub for error details
2. Run the same checks locally to debug
3. Fix issues and push new commits - CI will re-run automatically

### Deployments Not Working

1. Verify Vercel is connected to your GitHub repo (Vercel dashboard → Settings → Git)
2. Check Vercel deployment logs in your dashboard
3. Ensure `NEXT_PUBLIC_SITE_URL` is set in Vercel environment variables

### Can't Push to Main

If you set up branch protection, direct pushes to main are blocked (this is correct!):

```bash
# Create a branch instead
git checkout -b fix/my-changes
git push origin fix/my-changes
# Then create a PR on GitHub
```

---

## 📚 Additional Resources

- **[Vercel Documentation](https://vercel.com/docs)** - Deployment guide
- **[GitHub Actions Documentation](https://docs.github.com/en/actions)** - CI/CD guide
- **[QUICK-REFERENCE.md](QUICK-REFERENCE.md)** - Day-to-day development workflow

---

**Status: Ready to Use** ✅

Everything is set up and ready to go. Just connect Vercel and start pushing!
