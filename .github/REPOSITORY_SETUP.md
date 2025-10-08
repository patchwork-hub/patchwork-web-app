# Repository Configuration Guide

This document provides step-by-step instructions for configuring your GitHub repository for open source development with security and quality gates.

## Repository Settings

### 1. General Settings

1. Go to your repository settings
2. Under "General":
   - ✅ Enable "Issues"
   - ✅ Enable "Discussions" 
   - ✅ Enable "Projects"
   - ✅ Enable "Wiki" (optional)
   - ✅ Enable "Sponsorships" (if applicable)

### 2. Security Settings

1. Go to "Settings" → "Security" → "Code security and analysis"
2. Enable the following:
   - ✅ **Dependency graph**
   - ✅ **Dependabot alerts**
   - ✅ **Dependabot security updates**
   - ✅ **Dependabot version updates** (configured via `.github/dependabot.yml`)
   - ✅ **Code scanning** → "Set up" → "CodeQL Analysis"
   - ✅ **Secret scanning**
   - ✅ **Secret scanning push protection**

### 3. Branch Protection Rules

Go to "Settings" → "Branches" → "Add rule"

#### Main Branch Protection

**Branch name pattern**: `main`

✅ **Require a pull request before merging**
- ✅ Require approvals (minimum: 1)
- ✅ Dismiss stale PR approvals when new commits are pushed
- ✅ Require review from code owners

✅ **Require status checks to pass before merging**
- ✅ Require branches to be up to date before merging
- Required status checks:
  - `test-and-build (18.x)`
  - `test-and-build (20.x)`
  - `unit-tests`
  - `lint-and-format`
  - `build-test`
  - `CodeQL`

✅ **Require conversation resolution before merging**

✅ **Require signed commits** (recommended)

✅ **Require linear history** (optional)

✅ **Restrict pushes that create files**
- ✅ Restrict pushes that create files larger than 100 MB

#### Include administrators
- ❌ Do not include administrators (recommended for main branch)

### 4. Repository Topics

Add relevant topics to help with discoverability:
- `nextjs`
- `typescript`
- `react`
- `tailwindcss`
- `pnpm`
- `vitest`
- `open-source`
- `web-app`
- `patchwork`

### 5. Collaboration Settings

1. Go to "Settings" → "Manage access"
2. Set up teams and permissions as needed
3. Consider creating teams for:
   - **Maintainers**: Admin access
   - **Contributors**: Write access
   - **Reviewers**: Triage access

### 6. Notifications

1. Go to "Settings" → "Notifications"
2. Configure email notifications for:
   - Security alerts
   - Dependabot alerts
   - Failed actions

## GitHub Actions Permissions

1. Go to "Settings" → "Actions" → "General"
2. Actions permissions:
   - ✅ "Allow all actions and reusable workflows"
   - OR "Allow select actions and reusable workflows" with trusted publishers

3. Workflow permissions:
   - ✅ "Read and write permissions"
   - ✅ "Allow GitHub Actions to create and approve pull requests"

## Environment Setup (if using deployments)

1. Go to "Settings" → "Environments"
2. Create environments:
   - `development`
   - `staging` 
   - `production`

3. For each environment:
   - Add required reviewers for production
   - Set deployment branch rules
   - Add environment secrets

## Repository Secrets

Go to "Settings" → "Secrets and variables" → "Actions"

Add the following secrets if needed:
- `CODECOV_TOKEN` (if using Codecov)
- `NPM_TOKEN` (if publishing to npm)
- Any deployment-specific secrets

## Code Owners

Create a `.github/CODEOWNERS` file:

```
# Global owners
* @patchwork-hub/maintainers

# Frontend components
/src/components/ @patchwork-hub/frontend-team

# API routes
/src/app/api/ @patchwork-hub/backend-team

# Documentation
/docs/ @patchwork-hub/docs-team
*.md @patchwork-hub/docs-team

# CI/CD
/.github/ @patchwork-hub/devops-team

# Configuration files
package.json @patchwork-hub/maintainers
pnpm-lock.yaml @patchwork-hub/maintainers
tsconfig.json @patchwork-hub/maintainers
```

## Labels Setup

Create these labels for better issue and PR management:

### Type Labels
- `bug` (🐛 red)
- `enhancement` (✨ blue)
- `feature` (🚀 green)
- `documentation` (📚 blue)
- `security` (🔒 red)

### Status Labels
- `needs-triage` (🏷️ gray)
- `in-progress` (🔄 yellow)
- `ready-for-review` (👀 green)
- `blocked` (🚫 red)

### Priority Labels
- `priority-low` (📉 green)
- `priority-medium` (📊 yellow)
- `priority-high` (📈 orange)
- `priority-critical` (🚨 red)

### Size Labels
- `size-xs` (🤏 light blue)
- `size-s` (📏 blue)
- `size-m` (📐 purple)
- `size-l` (📏 orange)
- `size-xl` (📊 red)

## Automated Checks Summary

After setup, every PR will automatically run:

1. **CodeQL Security Analysis** - Scans for security vulnerabilities
2. **Unit Tests** - Runs all tests with coverage reporting
3. **Linting** - ESLint checks for code quality
4. **Type Checking** - TypeScript compilation checks
5. **Build Test** - Ensures the application builds successfully
6. **Dependency Scanning** - Dependabot checks for vulnerabilities

## Release Process

1. Create a new tag following semantic versioning:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. The release workflow will automatically:
   - Run all tests and checks
   - Build the application
   - Generate changelog
   - Create GitHub release
   - Upload build artifacts

## Monitoring and Maintenance

### Weekly Tasks
- Review Dependabot PRs
- Check security alerts
- Review failed workflows

### Monthly Tasks
- Update dependencies
- Review and update documentation
- Analyze repository insights
- Update branch protection rules if needed

## Support

For questions about repository configuration:
- Open an issue with the `question` label
- Check GitHub documentation
- Contact repository maintainers