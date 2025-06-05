# Backup Restoration Guide

This document explains how to restore your project from a backup tag.

## Available Backups

Currently, we have the following backup tag:
- `backup-main-20250605` - Backup of main branch created on June 5, 2025

## How to Restore from a Backup

### Method 1: Viewing the Backup (Safe Method)
To simply view the backup without making any changes:

```bash
# View the backup
git checkout backup-main-20250605

# When done viewing, return to your working branch
git checkout develop
```

### Method 2: Creating a New Branch from Backup
To restore the backup to a new branch for testing:

```bash
# Create and switch to a new branch from the backup
git checkout -b restore-main-test backup-main-20250605

# Push the new branch to GitHub (optional)
git push -u origin restore-main-test
```

### Method 3: Restoring Main Branch (Use with Caution)
To completely restore main to the backup state:

```bash
# Switch to main branch
git checkout main

# Reset main to the backup state
git reset --hard backup-main-20250605

# Force push to update remote (use with extreme caution)
git push --force origin main
```

⚠️ **WARNING**: Method 3 will overwrite the current state of the main branch. Only use this if you're absolutely sure you want to revert to the backup state.

## Best Practices

1. Always create a new branch from the backup first to verify the state
2. Test thoroughly before restoring to main
3. Communicate with team members before performing any restoration
4. Make sure to backup any current changes before restoration

## Additional Commands

### List All Backups
```bash
git tag -l
```

### Delete a Backup (if no longer needed)
```bash
# Delete locally
git tag -d backup-main-20250605

# Delete from GitHub
git push origin --delete backup-main-20250605
```

## Need Help?

If you encounter any issues during the restoration process, please:
1. Stop and take note of any error messages
2. Do not force push or make irreversible changes
3. Consult with team members or create an issue for assistance 