# Deployment Guide - KPILY Monorepo

## Quick Deployment Strategy

```
GitHub (Push) → GitHub Actions → Vercel + Netlify + Railway
```

## Prerequisites

1. **GitHub Repo** (push this monorepo)
2. **Vercel Account** (free tier) - for Next.js web
3. **Netlify Account** (free tier) - for React dashboard
4. **Railway Account** (~$5/month) - for Node API
5. **Supabase Account** (free tier) - for PostgreSQL database

## Step 1: GitHub Secrets Setup

In your GitHub repo settings, add these secrets:

```
VERCEL_TOKEN         → Get from Vercel (Settings → Tokens)
NETLIFY_AUTH_TOKEN   → Get from Netlify (User → Applications)
NETLIFY_SITE_ID      → Get from Netlify (Site settings)
RAILWAY_TOKEN        → Get from Railway (Account → API Tokens)
```

## Step 2: Deploy Web (Next.js) to Vercel

```bash
npm install -g vercel
vercel login
cd packages/web
vercel deploy --prod
```

Set environment variables in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://api.kpily.com/api
NEXT_PUBLIC_DASHBOARD_URL=https://dashboard.kpily.com
```

## Step 3: Deploy Dashboard (React) to Netlify

```bash
npm install -g netlify-cli
netlify login
cd packages/dashboard
netlify deploy --prod --dir=build
```

Set environment variables in Netlify:
```
REACT_APP_API_URL=https://api.kpily.com/api
```

## Step 4: Deploy API (Node) to Railway

```bash
npm install -g @railway/cli
railway login
cd packages/api
railway up
```

Set environment variables in Railway:
```
NODE_ENV=production
PORT=8000
DATABASE_URL=<from-supabase>
JWT_SECRET=<generate-random-string>
```

## Step 5: Database (Supabase)

1. Create project on supabase.com (free PostgreSQL)
2. Get `DATABASE_URL` from Connection Pooler settings
3. Add to Railway environment as `DATABASE_URL`

## Step 6: Enable CI/CD

Push to `main` branch:
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

GitHub Actions will automatically:
- Build all packages
- Deploy web to Vercel
- Deploy dashboard to Netlify
- Deploy API to Railway

## Cost Estimate (Production)

- Vercel: $20/mo (or free hobby tier)
- Netlify: $20/mo (or free hobby tier)
- Railway: $7/mo
- Supabase: $25/mo (or free with limits)
- **Total: ~$72/mo** (or $0 with free tiers)

## Domains Setup

Get domains from Namecheap/GoDaddy:
- app.kpily.com → Point to Vercel
- dashboard.kpily.com → Point to Netlify
- api.kpily.com → Point to Railway

Or use platform subdomains during development.

## Monitoring

- **Vercel**: vercel.com/dashboard
- **Netlify**: netlify.com/sites
- **Railway**: railway.app/dashboard

## Rollback

If something breaks:
```bash
# Revert last commit
git revert HEAD
git push origin main
# CI/CD redeploys automatically
```

## Testing Before Deployment

```bash
# Build everything locally
npm run build

# Test locally
npm run dev

# Check for errors
npm run typecheck  # TypeScript check
```

## FAQ

**Q: How do I update code?**
A: Make changes → git commit → git push → CI/CD handles deployment

**Q: How do I access logs?**
A: Vercel/Netlify/Railway dashboards have logs section

**Q: Can I use free tiers?**
A: Yes! Vercel and Netlify free tiers work for small projects

**Q: How do I connect domains?**
A: Add DNS records pointing to Vercel/Netlify IPs (they'll provide)

---

**Ready to deploy?** Follow steps 1-6 above. CI/CD handles the rest!
