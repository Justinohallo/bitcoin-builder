# Simplified CI/CD Setup Guide

This guide covers the simplified deployment setup using Vercel's built-in GitHub integration plus GitHub Actions for quality checks.

## Overview

**Simple Architecture:**

- **Vercel**: Handles all deployments (preview + production) automatically
- **GitHub Actions**: Runs quality checks (lint, format, type check, build) on PRs

This is the simplest and most reliable approach - no complex workflow files to maintain.

---

## Step 1: Connect Vercel to GitHub (5 minutes)

### Initial Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"** or select your existing project
3. Click **"Import"** and select your GitHub repository
4. **Configure Project:**
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `pnpm build` (or leave default)
   - Output Directory: `.next` (or leave default)
   - Install Command: `pnpm install` (or leave default)

5. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add: `NEXT_PUBLIC_SITE_URL` = `https://builder.van` (your actual URL)
6. Click **"Deploy"**

### What This Enables

Once connected, Vercel automatically:

- ✅ Deploys to production when you merge to `main`
- ✅ Creates preview deployments for every PR
- ✅ Comments on PRs with preview URLs
- ✅ Provides deployment status in GitHub

**No GitHub Action secrets needed!** Vercel handles authentication automatically.

---

## Step 2: Verify CI Workflow (Already Done!)

Your repository already has `.github/workflows/ci.yml` which runs quality checks:

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  quality-checks:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup pnpm
      - Install dependencies
      - Format check
      - Lint
      - Type check
      - Validate content
      - Build
```

This runs automatically on every PR. **No additional setup required.**

---

## Step 3: Set Up Branch Protection (Recommended)

Protect your `main` branch to enforce the PR workflow:

1. Go to **GitHub repo → Settings → Branches**
2. Click **"Add branch protection rule"**
3. **Branch name pattern:** `main`

4. **Enable these settings:**
   - ✅ **Require a pull request before merging**
     - Optional: Require approvals (set to 1 for solo projects)
   - ✅ **Require status checks to pass before merging**
     - Check "Require branches to be up to date before merging"
     - Search for and add: `Quality Checks` (from GitHub Actions)
     - Optional: Add `vercel` checks if you want Vercel builds to complete before merging
   - ✅ **Require conversation resolution before merging** (optional)
   - ❌ **Allow force pushes** (keep disabled)
   - ❌ **Allow deletions** (keep disabled)

5. Click **"Create"** or **"Save changes"**

---

## Development Workflow

### Standard Process

```bash
# 1. Create a feature branch
git checkout main
git pull origin main
git checkout -b feat/your-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add new feature"

# 3. Push to GitHub
git push origin feat/your-feature

# 4. Create Pull Request on GitHub
# - GitHub Actions will run quality checks
# - Vercel will create a preview deployment
# - Preview URL will appear in PR comments

# 5. Review and merge
# - Wait for checks to pass
# - Review the preview deployment
# - Click "Squash and merge"
# - Vercel deploys to production automatically
```

### Local Checks

Run these before pushing to catch issues early:

```bash
pnpm format:check      # Check formatting
pnpm lint              # Run linting
pnpm tsc               # Type check
pnpm validate:content  # Validate JSON content
pnpm build             # Test build
```

---

## Monitoring & Management

### View Deployments

- **Vercel Dashboard**: https://vercel.com/dashboard
  - See all deployments (production + previews)
  - View build logs
  - Manage environment variables
  - Configure domains

- **GitHub Actions Tab**: https://github.com/your-repo/actions
  - See all CI check runs
  - View detailed logs for any failures

### PR Comments

Vercel will automatically comment on your PRs with:

- ✅ Preview deployment URL
- 📊 Deployment status
- 🔍 Build logs link

---

## Troubleshooting

### CI Checks Failing

**Symptoms:** Red X on your PR, "Quality Checks" failing

**Solutions:**

1. Click "Details" on the failed check to see logs
2. Run the failing command locally: `pnpm format:check`, `pnpm lint`, `pnpm tsc`, or `pnpm build`
3. Fix the issues
4. Commit and push - checks will re-run automatically

### Preview Deployment Not Created

**Symptoms:** No preview URL comment on PR

**Solutions:**

1. Check Vercel dashboard → Settings → Git
2. Ensure your GitHub repo is connected
3. Check that the repository is not paused in Vercel
4. Verify you have deployments enabled for your plan

### Production Deployment Not Triggering

**Symptoms:** Merged to main but no production deployment

**Solutions:**

1. Check Vercel dashboard for deployment status
2. Go to Settings → Git and verify production branch is set to `main`
3. Check that "Production Branch" deployments are enabled
4. Review deployment logs in Vercel dashboard

### Can't Push to Main

**Symptoms:** `error: GH006: Protected branch update failed`

**This is correct!** Branch protection is working. Always use the PR workflow:

```bash
git checkout -b fix/my-changes
git push origin fix/my-changes
# Then create a PR on GitHub
```

### Environment Variables Not Working

**Symptoms:** App works locally but not in deployment

**Solutions:**

1. Go to Vercel dashboard → Your Project → Settings → Environment Variables
2. Add missing variables
3. Ensure they're enabled for the correct environments (Production, Preview, Development)
4. Redeploy (Vercel → Deployments → click "..." → Redeploy)

---

## Benefits of This Approach

✅ **Simple**: No complex GitHub Action workflows to maintain  
✅ **Reliable**: Vercel's native integration is battle-tested  
✅ **Fast**: Optimized deployment process  
✅ **Automated**: Everything happens automatically  
✅ **Quality**: CI checks ensure code quality  
✅ **Previews**: Test every change before production  
✅ **Zero Secrets**: No GitHub secrets to manage for deployments

---

## Advanced Configuration (Optional)

### Customize Build Settings

In Vercel dashboard → Settings → General:

- Adjust Node.js version
- Customize build command
- Configure output directory
- Add build environment variables

### Configure Domains

In Vercel dashboard → Settings → Domains:

- Add custom domains
- Configure SSL certificates
- Set up redirects

### Deployment Protection

In Vercel dashboard → Settings → Deployment Protection:

- Require authentication for preview deployments
- Set up deployment hooks
- Configure branch deploy settings

---

## Migration from Complex Setup

If you previously had custom deployment workflows:

1. ✅ Delete `.github/workflows/deploy.yml` (done)
2. ✅ Delete `.github/workflows/pr-preview.yml` (done)
3. ✅ Keep `.github/workflows/ci.yml` for quality checks
4. ✅ Remove GitHub secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (optional, but no longer needed)
5. ✅ Connect Vercel to GitHub (see Step 1)
6. ✅ Update branch protection to only require `Quality Checks`

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel GitHub Integration](https://vercel.com/docs/concepts/git)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)

---

**Questions?** Check the [Vercel Support](https://vercel.com/support) or [GitHub Docs](https://docs.github.com).
