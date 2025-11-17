# Quick Reference - Development Workflow

## 🚀 Standard Development Flow

### 1. Start a New Feature

```bash
# Update your local main branch
git checkout main
git pull origin main

# Create a new feature branch
git checkout -b feat/your-feature-name
# or for fixes: git checkout -b fix/bug-name
```

### 2. Make Your Changes

```bash
# Make changes to files...

# Check your changes locally
pnpm dev               # Test in browser
pnpm tsc               # Type check
pnpm validate:content  # Validate JSON content
pnpm format:check      # Check formatting
pnpm lint              # Check linting
pnpm build             # Test build
```

### 3. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with conventional commits format
git commit -m "feat: add new event page"
# or: fix:, docs:, refactor:, style:, test:, chore:
```

### 4. Push and Create PR

```bash
# Push your branch to GitHub
git push origin feat/your-feature-name

# Go to GitHub and click "Create Pull Request"
# Or use the link in the terminal output
```

### 5. Wait for CI Checks ✓

**GitHub Actions** will automatically run:

- ✅ Check formatting
- ✅ Run linting
- ✅ Run type checking
- ✅ Validate content
- ✅ Build the project

**Vercel** will automatically:

- ✅ Create a preview deployment
- ✅ Comment on PR with preview URL

### 6. Review and Merge

1. Review the preview deployment (URL in PR comments)
2. Wait for any required approvals
3. Once all checks pass ✓, click "Squash and merge"
4. Delete the branch (automatic if configured)

### 7. Production Deployment 🎉

- Vercel automatically deploys to production
- Check Vercel dashboard to monitor deployment

---

## 📝 Commit Message Format

Use conventional commits:

```
feat: add user authentication
fix: resolve header alignment issue
docs: update README with setup instructions
style: format code with prettier
refactor: reorganize content loaders
test: add unit tests for schemas
chore: update dependencies
```

**Format:** `<type>: <description>`

**Common types:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

---

## 🔧 Common Commands

### Development

```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
```

### Quality Checks

```bash
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting
pnpm tsc              # Type check
pnpm validate:content # Validate JSON content
pnpm content:check    # Run all validation
```

### Git Workflow

```bash
git status            # Check current changes
git diff              # See changes
git log --oneline     # View commit history
git checkout main     # Switch to main
git pull origin main  # Update main
git branch -d feat/x  # Delete local branch
```

---

## 🚨 Troubleshooting

### "Can't push to main" Error

**This is correct!** Main is protected. Create a branch instead:

```bash
git checkout -b fix/my-changes
git push origin fix/my-changes
# Then create a PR on GitHub
```

### CI Checks Failing

1. Check the Actions tab on GitHub for details
2. Run the same checks locally to debug
3. Fix issues and push new commits to your PR
4. CI will automatically re-run

### Build Fails Locally

```bash
# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

### Content Validation Errors

1. Check the error message
2. Review schema in `lib/schemas.ts`
3. Fix the JSON in `content/*.json`
4. Run `pnpm validate:content` to verify

### Merge Conflicts

```bash
# Update your branch with latest main
git checkout main
git pull origin main
git checkout your-branch
git merge main

# Resolve conflicts in files
# Then commit the merge
git add .
git commit -m "chore: resolve merge conflicts"
git push origin your-branch
```

---

## 📚 Documentation

- **[SETUP-CHECKLIST.md](SETUP-CHECKLIST.md)** - Quick CI/CD setup guide
- **[docs/GITHUB-ACTIONS-SETUP.md](docs/GITHUB-ACTIONS-SETUP.md)** - Detailed setup and troubleshooting
- **[Architecture](docs/ARCHITECTURE.md)** - System architecture and patterns
- **[Content Guide](docs/CONTENT-GUIDE.md)** - Content authoring guide
- **[Schema Development](docs/SCHEMA-DEVELOPMENT.md)** - Creating schemas
- **[Formatting & Linting](docs/FORMATTING-LINTING.md)** - Code quality standards

---

## 🎯 Best Practices

1. **Always** create a branch - never commit directly to main
2. **Always** run local checks before pushing
3. **Always** write descriptive commit messages
4. **Always** test your changes in the preview deployment
5. **Keep PRs focused** - one feature or fix per PR
6. **Update documentation** when changing functionality
7. **Review your own PR** before requesting review from others
8. **Delete branches** after merging

---

## ⚡ Quick Tips

- **Preview your changes**: The PR preview deployment URL is posted as a comment
- **CI is fast**: Most checks complete in 2-3 minutes
- **Auto-completion**: GitHub will suggest closing issues if you use "Closes #123" in PR description
- **Draft PRs**: Use draft PRs for work-in-progress changes
- **Squash merging**: Keeps main branch history clean
- **Keyboard shortcuts**: Press `?` on GitHub to see all shortcuts

---

**Questions?** Check the [full documentation](docs/) or ask the team!
