# GitHub Actions Setup Checklist

This checklist will guide you through setting up the PR-based deployment workflow.

## ✅ Prerequisites Completed

- [x] GitHub Actions workflow files created
- [x] Pull request template created
- [x] Documentation updated

## 📋 Your Action Items

### Step 1: Get Vercel Credentials (5 minutes)

**Option A: Use Vercel GitHub Integration (Recommended - Simpler)**

- [ ] Go to your Vercel project dashboard
- [ ] Navigate to Settings → Git
- [ ] Connect your GitHub repository
- [ ] Enable "Vercel for GitHub" integration
- [ ] ✨ **If you choose this option, you can skip Step 2** (GitHub Actions will only run quality checks, Vercel handles deployments)

**Option B: Manual Setup with Vercel CLI**

- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Link project: `vercel link` (from project root)
- [ ] Get project ID: `vercel project ls`
- [ ] Get token: Create at https://vercel.com/account/tokens
- [ ] Get org ID: From Vercel project settings → General tab

### Step 2: Add GitHub Secrets (3 minutes)

**Required only if you chose Option B above**

- [ ] Go to GitHub repo → Settings → Secrets and variables → Actions
- [ ] Add `VERCEL_TOKEN` (from Vercel)
- [ ] Add `VERCEL_ORG_ID` (from Vercel)
- [ ] Add `VERCEL_PROJECT_ID` (from Vercel)
- [ ] Add `NEXT_PUBLIC_SITE_URL` (e.g., `https://builder.van`)

**If you chose Option A (Vercel GitHub Integration):**

- [ ] Only add `NEXT_PUBLIC_SITE_URL` secret
- [ ] Delete `.github/workflows/deploy.yml` (not needed)
- [ ] Delete `.github/workflows/pr-preview.yml` (Vercel handles this)

### Step 3: Commit and Push Setup Files (2 minutes)

⚠️ **Important:** Complete this step BEFORE setting up branch protection!

```bash
# Navigate to your project root (if not already there)
# cd /path/to/your/project

# Check what files were created
git status

# Add all the new workflow files
git add .github/ docs/GITHUB-ACTIONS-SETUP.md QUICK-REFERENCE.md SETUP-CHECKLIST.md README.md

# Commit with conventional commit message
git commit -m "feat: add GitHub Actions CI/CD workflow with branch protection"

# Push to main (this is the LAST time you can do this!)
git push origin main
```

### Step 4: Set Up Branch Protection (5 minutes)

🔒 **Now we protect the `main` branch** - no more direct pushes after this!

This is **required** regardless of which deployment option you chose.

- [ ] Go to GitHub repo → Settings → Branches
- [ ] Click "Add branch protection rule"
- [ ] Set branch name pattern: `main`
- [ ] Enable: ✅ **Require a pull request before merging**
- [ ] Enable: ✅ **Require status checks to pass before merging**
  - If using Option A (Vercel integration): Add status check `Quality Checks`
  - If using Option B (manual): Add status checks `Quality Checks` and `Deploy Preview`
- [ ] Enable: ✅ **Require conversation resolution before merging**
- [ ] Enable: ✅ **Require linear history** (recommended)
- [ ] Disable: ❌ **Allow force pushes**
- [ ] Disable: ❌ **Allow deletions**
- [ ] Click "Create" or "Save changes"

### Step 5: Configure Pull Request Settings (2 minutes)

- [ ] Go to Settings → General → Pull Requests section
- [ ] Enable: ✅ **Allow squash merging** (recommended)
- [ ] Enable: ✅ **Automatically delete head branches**
- [ ] Configure default merge commit message format (your choice)

### Step 6: Verify Branch Protection (5 minutes)

🧪 **Test that branch protection is working correctly**

```bash
# Create a test branch
git checkout -b test/github-actions

# Make a small change
echo "# Test" >> TEST.md

# Commit and push
git add TEST.md
git commit -m "test: verify GitHub Actions"
git push origin test/github-actions
```

- [ ] Go to GitHub and create a Pull Request
- [ ] Verify CI checks run automatically ✅
- [ ] Verify preview deployment is created (if configured)
- [ ] Wait for all checks to pass
- [ ] Merge the PR (squash and merge)
- [ ] Verify production deployment runs (check Actions tab)
- [ ] Clean up: Delete TEST.md with a new PR or via GitHub web interface

### Step 7: Confirm Direct Push is Blocked (1 minute)

🚫 **Verify that direct pushes to `main` are now blocked**

```bash
# This should FAIL (which is correct!)
git checkout main
git pull
echo "# Test" >> BLOCKED.md
git add BLOCKED.md
git commit -m "test: this should be blocked"
git push origin main

# Expected result: Error saying main is protected
```

If you see an error, **congratulations!** 🎉 Branch protection is working.

Clean up the test commit:

```bash
git reset --hard HEAD~1
```

## 🎯 What You've Achieved

After completing this checklist:

✅ **Code Quality Enforced**: All code must pass linting, formatting, type checking, and build tests
✅ **Change History**: Every change goes through a PR with clear description
✅ **Review Process**: Optional approval process before merging
✅ **Preview Deployments**: Test changes in production-like environment
✅ **Automated Deployments**: No manual deployment steps
✅ **Rollback Safety**: Easy to identify and revert problematic changes
✅ **Team Ready**: Built-in collaboration workflow

## 📚 Documentation Available

- **[QUICK-REFERENCE.md](QUICK-REFERENCE.md)** - Day-to-day workflow reference
- **[docs/GITHUB-ACTIONS-SETUP.md](docs/GITHUB-ACTIONS-SETUP.md)** - Complete setup guide with troubleshooting
- **[README.md](README.md)** - Updated with deployment workflow

## 🚨 Important Notes

### After Setup is Complete

1. **No more direct pushes to main** - They will be blocked by GitHub
2. **Always create a branch first** - `git checkout -b feat/your-feature`
3. **Push your branch** - `git push origin feat/your-feature`
4. **Create a PR on GitHub** - Let CI run and check the preview
5. **Merge when ready** - Production deploys automatically

### Team Communication

Make sure to inform your team about:

- The new PR-based workflow
- Link to [QUICK-REFERENCE.md](QUICK-REFERENCE.md)
- Link to [docs/GITHUB-ACTIONS-SETUP.md](docs/GITHUB-ACTIONS-SETUP.md)
- Any approval requirements you've set up

### Monitoring

- **GitHub Actions Tab**: View all workflow runs
- **Vercel Dashboard**: View all deployments
- **PR Comments**: Preview URLs posted automatically

## 🤝 Next Steps (Optional)

Consider adding:

- [ ] Code owners (CODEOWNERS file)
- [ ] Status badges in README
- [ ] Dependabot for dependency updates
- [ ] Semantic release for versioning
- [ ] Additional test automation

## ❓ Need Help?

- Check [docs/GITHUB-ACTIONS-SETUP.md](docs/GITHUB-ACTIONS-SETUP.md) for troubleshooting
- Review [QUICK-REFERENCE.md](QUICK-REFERENCE.md) for common commands
- GitHub Actions docs: https://docs.github.com/en/actions
- Vercel docs: https://vercel.com/docs

---

**Status: Ready to Deploy** ✅

Once you complete the checklist above, your new workflow will be fully operational.

Good luck, and enjoy your improved deployment workflow! 🎉
