---
name: ship
description: Verify a portfolio production deploy after a PR merge to main. Use when the user asks to ship, deploy, or release the portfolio site.
---

There is no manual deploy: **merging a PR to `main` auto-deploys prod** via Cloudflare Pages (project `rcarhart-github-io`) to https://rosscarhart.com.

## After a PR merge

1. Sync local: `git checkout main && git pull`
2. Verify the live site: `curl -sI https://rosscarhart.com` returns 200
3. Spot-check that the merged change is visible on the live page (grep the fetched HTML for something the change introduced)
4. If the deploy seems stale, check deployment status via the CF API (creds in `~/projects/pittsburghdivorce/.env`, account `0e84061cdb103bc2895fc03547a1e5fa`):
   `GET /accounts/<acct>/pages/projects/rcarhart-github-io/deployments`

## Rollback

Revert the merge commit on a branch, PR it, and have Ross merge — the revert deploys automatically. Emergency: Cloudflare dashboard → Pages → rcarhart-github-io → Deployments → rollback.
