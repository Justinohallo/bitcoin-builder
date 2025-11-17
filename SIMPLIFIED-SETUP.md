# Simplified CI/CD Setup ✨

## What Changed

We've **dramatically simplified** your deployment setup. No more complex workflows!

### ❌ Removed (Complicated)

- `.github/workflows/pr-preview.yml` - Custom preview deployment workflow
- `.github/workflows/deploy.yml` - Custom production deployment workflow
- `GITHUB-ACTIONS-FIX.md` - No longer needed

### ✅ Kept (Simple)

- `.github/workflows/ci.yml` - Quality checks only (lint, format, type check, build)
- Vercel handles **ALL** deployments automatically

---

## New Architecture

**Ultra-Simple Setup:**

```
┌─────────────────────────────────────────────────────┐
│  YOU: Push code to GitHub                           │
└─────────────────────────────────────────────────────┘
                      ↓
        ┌─────────────────────────────┐
        │  GitHub Actions             │
        │  - Format check ✓           │
        │  - Lint ✓                   │
        │  - Type check ✓             │
        │  - Build ✓                  │
        └─────────────────────────────┘
                      ↓
        ┌─────────────────────────────┐
        │  Vercel (automatic)         │
        │  - Build & Deploy           │
        │  - Preview for PRs          │
        │  - Production for main      │
        └─────────────────────────────┘
```

---

## What You Need to Do

### One-Time Setup (5 minutes)

**1. Connect Vercel to GitHub**

Go to [Vercel Dashboard](https://vercel.com/dashboard):

- Click "Add New Project" (or select existing)
- Import your GitHub repository
- Set framework to **Next.js**
- Add environment variable: `NEXT_PUBLIC_SITE_URL` = `https://builder.van`
- Click "Deploy"

**That's it!** 🎉

Vercel will now:

- ✅ Deploy to production on every merge to `main`
- ✅ Create preview deployments for every PR
- ✅ Comment on PRs with preview URLs
- ✅ Handle everything automatically

### Optional: Branch Protection (Recommended)

GitHub → Settings → Branches → Add branch protection rule:

- Branch name: `main`
- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
  - Add required check: `Quality Checks`

---

## How to Use

### Standard Workflow

```bash
# 1. Create branch
git checkout -b feat/my-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add something cool"

# 3. Push
git push origin feat/my-feature

# 4. Create PR on GitHub
# - CI checks run automatically ✓
# - Vercel creates preview automatically ✓
# - Preview URL posted in comments ✓

# 5. Merge when ready
# - Vercel deploys to production automatically ✓
```

**No manual steps. No secrets to configure. No workflows to debug.** 🚀

---

## Benefits

✅ **10x Simpler**: Removed ~100 lines of complex workflow code  
✅ **More Reliable**: Vercel's native integration is battle-tested  
✅ **Zero Maintenance**: No GitHub secrets to manage or rotate  
✅ **Faster**: Vercel's optimized build pipeline  
✅ **Better DX**: Clear separation - GitHub = quality checks, Vercel = deployments

---

## Troubleshooting

### "How do I see my deployments?"

- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- All deployments are listed with logs

### "CI checks are failing"

- Click "Details" on the failed check
- Run the command locally: `pnpm lint`, `pnpm format:check`, `pnpm tsc`, or `pnpm build`
- Fix and push again

### "No preview deployment"

- Make sure you connected Vercel to GitHub (see setup above)
- Check Vercel dashboard → Settings → Git

### "Still have questions?"

- See [SETUP-CHECKLIST.md](SETUP-CHECKLIST.md) for quick setup
- See [docs/GITHUB-ACTIONS-SETUP.md](docs/GITHUB-ACTIONS-SETUP.md) for detailed guide

---

**Ready to deploy!** Just connect Vercel and you're done. 🎊
