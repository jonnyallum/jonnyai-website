---
description: Deploy code to Hostinger via SSH/rsync with zero-downtime and rollback support.
---

# /deploy - Hostinger Deployment Workflow

## Prerequisites
- SSH key configured in GitHub Secrets
- `.github/workflows/deploy-hostinger.yml` exists
- Hostinger SSH access enabled

## Steps

1. **Pre-flight Check** (@Sentinel)
   - Run full test suite: `npm test`
   - Verify build succeeds: `npm run build`
   - Check for secrets in code: `git secrets --scan`

2. **Build Production Assets** (@Jonny AI)
   // turbo
   ```bash
   npm ci && npm run build
   ```

3. **Deploy via GitHub Actions** (@Deploy)
   // turbo
   ```bash
   git push origin main
   ```
   Or trigger manually:
   ```bash
   gh workflow run deploy-hostinger.yml
   ```

4. **Monitor Deployment** (@Deploy)
   // turbo
   ```bash
   gh run watch
   ```

5. **Post-Deploy Health Check** (@Metric)
   - Verify site loads: `curl -I https://your-domain.com`
   - Check Core Web Vitals
   - Monitor error rates for 5 minutes

6. **Rollback if Needed** (@Deploy)
   If issues detected:
   ```bash
   # Find previous deploy tag
   git tag -l "deploy-*" | tail -n 2 | head -n 1
   
   # Redeploy previous version
   gh workflow run deploy-hostinger.yml --ref <previous-tag>
   ```

7. **Document** (@Archivist)
   - Log deployment in `.tmp/deploy_log.md`
   - Update runbook if new learnings

## Secrets Required (GitHub)
| Secret | Description |
| :--- | :--- |
| `SSH_KEY` | Private SSH key |
| `SSH_HOST` | Hostinger server IP |
| `SSH_USER` | SSH username |
| `SSH_PORT` | 65002 (shared) or 22 (VPS) |
| `DEPLOY_PATH` | Full path on server |

## On Failure
1. Check GitHub Actions logs
2. @Deploy investigates
3. @Conductor decides: fix forward or rollback
4. @Archivist documents incident
