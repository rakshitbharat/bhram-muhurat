# 🚀 GitHub Actions Setup Guide - Complete Automation

This guide provides comprehensive setup for automated releases, dependency management, and CI/CD for the Brahma Muhurat Calculator library.

## 🎯 Features Overview

- **🔄 Automated Publishing**: Tag-triggered NPM releases
- **🏷️ Smart Tagging**: Automatic git tags on version changes  
- **🧪 Full Testing**: Cross-platform testing on multiple Node.js versions
- **🔒 Security Scanning**: Automated vulnerability detection
- **📦 Dependency Management**: Weekly dependency updates
- **📊 Quality Assurance**: Comprehensive validation pipeline

## 📋 Prerequisites

1. **GitHub Repository**: `https://github.com/rakshitbharat/brahma-muhurat`
2. **NPM Account**: Account with publishing permissions
3. **NPM Token**: Automation token for GitHub Actions

## 🔧 Setup Steps

### 1. 🔑 Generate NPM Token

1. **Log in** to [npmjs.com](https://www.npmjs.com/)
2. **Navigate** to Account Settings → Access Tokens
3. **Generate** new token:
   - **Type**: Automation (recommended for CI/CD)
   - **Scope**: All packages (or specific to your org)
4. **Copy** the token securely (you'll need it for GitHub)

### 2. 🔐 Configure GitHub Secrets

**In your GitHub repository:**
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secrets:

```
Name: NPM_TOKEN
Value: npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Optional secrets for enhanced functionality:**
```
SLACK_WEBHOOK_URL: https://hooks.slack.com/... (for notifications)
CODECOV_TOKEN: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (for coverage)
```

### 3. ⚙️ Repository Settings

**Essential Settings:**
1. **Actions** → **General**:
   - ✅ Enable GitHub Actions
   - ✅ Allow all actions and reusable workflows

2. **Workflow Permissions**:
   - ✅ Read and write permissions
   - ✅ Allow GitHub Actions to create and approve pull requests

3. **Branch Protection** (Recommended):
   - **Settings** → **Branches** → **Add rule**
   - **Branch name pattern**: `main`
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators

## 🔄 Workflow Overview

### 📊 Available Workflows

| Workflow | Trigger | Purpose | Status |
|----------|---------|---------|---------|
| **🔄 CI/CD Pipeline** | Push, PR | Testing & Quality | `ci.yml` |
| **🚀 NPM Publish** | Git Tags | Full Release Process | `publish.yml` |
| **🏷️ Auto Tag** | Version Change | Automatic Tagging | `auto-tag.yml` |
| **🔧 Maintenance** | Weekly/Manual | Dependencies & Security | `maintenance.yml` |

### � Publishing Workflow (`publish.yml`)
**Advanced features:**
- 🔒 Security scanning before publish
- 🧪 Cross-platform testing (Ubuntu, Windows, macOS)
- 📦 Package verification and validation
- 🏷️ Automatic GitHub release creation
- 🔄 NPM publication with verification
- 📋 Comprehensive error handling
- 🎯 Manual and automatic triggers

### 🏷️ Auto-Tag Workflow (`auto-tag.yml`)
**Smart tagging:**
- 📋 Detects version changes in `package.json`
- ✅ Runs full test suite before tagging
- 🏷️ Creates semantic version tags (v1.0.0)
- 🚀 Triggers publishing workflow automatically
- 🔄 Force tag option for manual control

### � Maintenance Workflow (`maintenance.yml`)  
**Automated maintenance:**
- 📅 Weekly dependency checks
- 🔒 Security vulnerability scanning
- 📦 Automated dependency updates
- 🔄 Pull request creation for updates
- 🚨 Priority security fixes

## 🎯 Release Process

### 🚀 Method 1: Automatic Release (Recommended)
```bash
# 1. Update version in package.json
npm version patch  # 1.0.0 → 1.0.1
# OR
npm version minor  # 1.0.0 → 1.1.0  
# OR
npm version major  # 1.0.0 → 2.0.0

# 2. Push to main (triggers auto-tag)
git push origin main

# 3. Auto-tag workflow creates the tag
# 4. Publish workflow handles the rest automatically
```

### 🎯 Method 2: Manual Tag Release
```bash
# 1. Update package.json manually
"version": "1.0.1"

# 2. Commit and push
git add package.json
git commit -m "bump version to 1.0.1"
git push origin main

# 3. Create tag manually
git tag -a v1.0.1 -m "Release version 1.0.1"
git push origin v1.0.1
```

### 🧪 Method 3: Test Release (Dry Run)
```bash
# Use GitHub Actions manual trigger
# 1. Go to Actions → "🚀 Publish to NPM"
# 2. Click "Run workflow"
# 3. Set "Dry run" to true
# 4. Enter version and run
```

### 📋 Pre-Release Checklist
- [ ] All tests passing locally
- [ ] Version number updated in `package.json`
- [ ] No security vulnerabilities (`npm audit`)
- [ ] Dependencies are up to date
- [ ] Documentation updated (if needed)
- [ ] Examples tested and working

## Workflow Files Explanation

### 📁 `.github/workflows/`
- `ci.yml` - Continuous Integration pipeline
- `release.yml` - Release and NPM publishing
- `auto-tag.yml` - Automatic git tag creation
- `auto-update.yml` - Dependency updates

## Security & Best Practices

### 🔒 NPM Token Security
- Use "Automation" tokens (not "Publish" tokens)
- Tokens are scoped to your packages only
- Regularly rotate tokens

### 🛡️ Branch Protection
- Protect main branch from direct pushes
- Require PR reviews for critical changes
- Ensure CI passes before merging

### 📋 Release Checklist
- [ ] All tests passing
- [ ] Version number updated in package.json
- [ ] Changelog/release notes prepared
- [ ] No security vulnerabilities
- [ ] Examples and documentation updated

## Monitoring & Maintenance

### 📊 Regular Checks
- Monitor GitHub Actions runs
- Review dependency update PRs weekly
- Check NPM package download stats
- Respond to security advisories

### 🔧 Troubleshooting

**Common Issues:**

1. **NPM publish fails**
   - Check NPM_TOKEN secret is set correctly
   - Verify token has publish permissions
   - Ensure package name is available

2. **Tests fail in CI**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Test locally with same Node.js version

3. **Tag creation fails**
   - Ensure GitHub Actions has write permissions
   - Check if tag already exists
   - Verify package.json version format

## Support

For issues with the GitHub Actions setup:
1. Check the Actions tab for error logs
2. Verify all secrets are configured
3. Ensure repository permissions are correct
4. Review workflow syntax if making changes

## Next Steps

After setup:
1. Make a test release to verify everything works
2. Set up branch protection rules
3. Configure repository notifications
4. Add status badges to README.md
