# GitHub Actions Setup Guide

This guide will walk you through setting up GitHub Actions for automated CI/CD with branch protection on the `main` branch.

## Overview

The new workflow enforces pull requests before merging to `main` and includes:

- **CI Checks**: Automated linting, formatting, type checking, content validation, and builds on every PR
- **Preview Deployments**: Automatic preview deployments for every PR
- **Production Deployments**: Automatic deployment to production when PRs are merged to `main`

## Step 1: Configure Vercel Integration

### Get Your Vercel Credentials

1. **Install Vercel CLI** (if not already installed):

   ```bash
   npm i -g vercel
   ```

2. **Link your project** (run from your project root):

   ```bash
   vercel link
   ```

3. **Get your project details**:

   ```bash
   vercel project ls
   ```

   Note your **Project ID**

4. **Get your Vercel Token**:
   - Go to https://vercel.com/account/tokens
   - Click "Create Token"
   - Name it "GitHub Actions" or similar
   - Copy the token immediately (you won't see it again)

5. **Get your Org ID**:
   - Go to your Vercel project settings
   - Navigate to "General" tab
   - Find your Organization ID in the project details

### Alternative: Use Vercel's GitHub Integration

If you prefer using Vercel's built-in GitHub integration (simpler option):

1. Go to your Vercel project dashboard
2. Navigate to Settings → Git
3. Connect your GitHub repository
4. Enable "Vercel for GitHub" integration

This will automatically handle deployments, and you can **skip the Deploy and PR Preview workflows** - just keep the CI workflow for quality checks.

## Step 2: Add GitHub Secrets

Navigate to your GitHub repository settings:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click "New repository secret"
3. Add the following secrets:

| Secret Name            | Description                 | Where to Find                            |
| ---------------------- | --------------------------- | ---------------------------------------- |
| `VERCEL_TOKEN`         | Your Vercel API token       | Created in Step 1.4                      |
| `VERCEL_ORG_ID`        | Your Vercel organization ID | From Step 1.5 or run `vercel project ls` |
| `VERCEL_PROJECT_ID`    | Your Vercel project ID      | From Step 1.3 or run `vercel project ls` |
| `NEXT_PUBLIC_SITE_URL` | Your production URL         | e.g., `https://builder.van`              |

## Step 3: Set Up Branch Protection Rules

This is the crucial step that enforces the PR workflow:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Branches**
3. Click **Add branch protection rule**
4. Configure the following:

### Branch Name Pattern

```
main
```

### Required Settings

✅ **Require a pull request before merging**

- Check "Require approvals" (optional, set to 1 if you want review approval)
- Check "Dismiss stale pull request approvals when new commits are pushed"
- Check "Require review from Code Owners" (optional)

✅ **Require status checks to pass before merging**

- Check "Require branches to be up to date before merging"
- Add required status checks:
  - `Quality Checks` (from CI workflow)
  - `Deploy Preview` (from PR Preview workflow, if using)

✅ **Require conversation resolution before merging** (optional but recommended)

✅ **Do not allow bypassing the above settings** (recommended)

❌ **Allow force pushes**: Leave UNCHECKED

❌ **Allow deletions**: Leave UNCHECKED

### Additional Recommended Settings

✅ **Lock branch**: Optional, if you want to make main completely read-only
✅ **Require linear history**: Enforces a clean commit history
✅ **Require deployments to succeed before merging**: Optional
✅ **Require signed commits**: Optional, for additional security

5. Click **Create** or **Save changes**

## Step 4: Configure Default Branch Settings

1. Go to **Settings** → **General**
2. Scroll to **Pull Requests** section
3. Configure:
   - ✅ Allow merge commits (or choose your preferred merge strategy)
   - ✅ Allow squash merging (recommended for clean history)
   - ❌ Allow rebase merging (optional)
   - ✅ Automatically delete head branches (recommended)

## Step 5: Test the Workflow

### Create a Test Pull Request

```bash
# Create a new branch
git checkout -b test/github-actions

# Make a small change
echo "# Test PR" >> TEST.md

# Commit and push
git add TEST.md
git commit -m "test: verify GitHub Actions workflow"
git push origin test/github-actions
```

### Create the Pull Request

1. Go to your GitHub repository
2. Click "Pull requests" → "New pull request"
3. Select `test/github-actions` as the compare branch
4. Click "Create pull request"

### Verify

You should see:

- ✅ CI checks running automatically
- ✅ Preview deployment being created (if configured)
- ✅ Status checks must pass before merging is allowed
- ✅ Comment with preview URL (if configured)

### Merge the PR

Once all checks pass:

1. Click "Squash and merge" (or your preferred merge method)
2. Confirm the merge
3. Verify that production deployment starts automatically

### Clean Up Test

```bash
# Delete the test file
git checkout main
git pull
git rm TEST.md
git commit -m "chore: remove test file"
git push origin main
```

## Workflow Files

Your repository now includes three workflow files:

### 1. `.github/workflows/ci.yml`

- Runs on every PR and push to main
- Executes: format check, lint, type check, content validation, build
- Required to pass before merging

### 2. `.github/workflows/deploy.yml`

- Runs when changes are pushed/merged to main
- Deploys to Vercel production
- Only runs after CI passes

### 3. `.github/workflows/pr-preview.yml`

- Runs on every PR
- Creates a preview deployment on Vercel
- Posts preview URL as a comment on the PR

## Alternative: Vercel GitHub Integration Only

If you chose to use Vercel's built-in GitHub integration in Step 1, you can:

1. **Keep only** `.github/workflows/ci.yml`
2. **Delete** `.github/workflows/deploy.yml` and `.github/workflows/pr-preview.yml`
3. Vercel will handle all deployments automatically

In this case, update your branch protection rules to only require the `Quality Checks` status.

## New Development Workflow

From now on, follow this process:

1. **Create a feature branch**:

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes** and commit:

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Push to GitHub**:

   ```bash
   git push origin feat/your-feature-name
   ```

4. **Create a Pull Request** on GitHub

5. **Wait for CI checks** to pass

6. **Review the preview deployment** (if enabled)

7. **Get approval** (if required by branch protection)

8. **Merge the PR** - this triggers production deployment

9. **Branch is automatically deleted** (if configured)

## Troubleshooting

### CI Checks Failing

- Check the GitHub Actions logs for specific errors
- Run the same commands locally: `pnpm format:check`, `pnpm lint`, `pnpm tsc`, `pnpm build`
- Fix issues and push new commits to the PR

### Deployment Failing

- Verify all Vercel secrets are correctly set
- Check Vercel dashboard for deployment logs
- Ensure `NEXT_PUBLIC_SITE_URL` environment variable is set

### Can't Push to Main

This is by design! If you accidentally try to push directly to main:

```bash
# You'll see an error like:
# remote: error: GH006: Protected branch update failed
```

**Solution**: Create a branch and PR instead:

```bash
git checkout -b fix/my-changes
git push origin fix/my-changes
# Then create a PR on GitHub
```

### Bypass Branch Protection (Emergency Only)

If you absolutely must push directly to main (not recommended):

1. Go to Settings → Branches → Branch protection rules
2. Temporarily disable the rule
3. Make your emergency push
4. **Immediately re-enable the protection rule**

## Benefits of This Workflow

✅ **Code Quality**: All changes are validated before reaching production
✅ **Change History**: Clear record of what changed and why
✅ **Rollback Safety**: Easy to identify and revert problematic changes
✅ **Team Collaboration**: Built-in review process for teams
✅ **Preview Testing**: Test changes in a production-like environment before merging
✅ **Automated Deployments**: No manual deployment steps needed
✅ **Conventional Commits**: Enforces consistent commit message format

## Monitoring

### View Workflow Runs

- GitHub: **Actions** tab shows all workflow runs
- Vercel: Dashboard shows all deployments

### Notifications

Configure notifications in:

- **GitHub**: Settings → Notifications
- **Vercel**: Project Settings → Notifications

## Next Steps

1. Consider adding automated testing workflows
2. Set up status badges in your README
3. Configure code owners (CODEOWNERS file)
4. Add semantic-release for automated versioning
5. Set up Dependabot for dependency updates

---

## Questions?

If you encounter issues or have questions about the GitHub Actions setup, please refer to:

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
