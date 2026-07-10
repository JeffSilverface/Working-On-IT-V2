# Agent : @devops

Expert déploiement — o2switch, CI/CD GitHub Actions, PM2, Next.js, NestJS.

## Domaine de compétence

- Déploiement NestJS + Next.js sur o2switch (Node.js persistant + PM2)
- GitHub Actions (CI/CD)
- Configuration serveur (reverse proxy, env vars, SSH)
- PWA (manifest, service worker)

## Déploiement o2switch

### Architecture sur o2switch

```
o2switch/
  ~/working-on-it/
    backend/          → NestJS buildé (dist/)
    pwa/              → Next.js buildé (.next/)
    ecosystem.config.js
    .env.production
```

### PM2 ecosystem.config.js

```javascript
// ~/working-on-it/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'woi-backend',
      script: './backend/dist/main.js',
      env: { NODE_ENV: 'production', PORT: 3002 },
      instances: 1,
      autorestart: true,
    },
    {
      name: 'woi-pwa',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: './pwa',
      env: { NODE_ENV: 'production', PORT: 3000 },
      instances: 1,
      autorestart: true,
    },
  ],
}
```

### Variables d'environnement production

```bash
# ~/working-on-it/.env.production
NODE_ENV=production
PORT=3002

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/workingonit"

# Better Auth
BETTER_AUTH_URL="https://app.working-on-it.fr"
BETTER_AUTH_SECRET="<secret-32-chars-minimum>"

# Google OAuth
GOOGLE_CLIENT_ID="<client-id>"
GOOGLE_CLIENT_SECRET="<client-secret>"

# SMTP o2switch
SMTP_HOST="mail.working-on-it.fr"
SMTP_PORT="465"
SMTP_USER="no-reply@working-on-it.fr"
SMTP_PASSWORD="<password>"

# CORS
ALLOWED_ORIGINS="https://app.working-on-it.fr,https://working-on-it.fr"
```

### Script de déploiement manuel

```bash
#!/bin/bash
# scripts/deploy.sh

set -e

echo "Build backend..."
pnpm --filter backend build

echo "Build PWA..."
pnpm --filter pwa build

echo "Upload sur o2switch..."
rsync -avz --exclude node_modules --exclude .env \
  ./backend/dist/ user@o2switch:~/working-on-it/backend/dist/

rsync -avz --exclude node_modules --exclude .env \
  ./pwa/.next/ user@o2switch:~/working-on-it/pwa/.next/

echo "Migrations Prisma..."
ssh user@o2switch "cd ~/working-on-it && pnpm --filter backend prisma:migrate"

echo "Restart PM2..."
ssh user@o2switch "pm2 restart ecosystem.config.js"

echo "Déployé !"
```

## GitHub Actions

### CI — Qualité + sécurité (sur chaque push / PR)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm -r typecheck
      - run: pnpm -r lint

  test:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm -r test --coverage

  build:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter backend build
      - run: pnpm --filter pwa build
        env:
          NEXT_PUBLIC_API_URL: https://app.working-on-it.fr
      - run: pnpm --filter landing build

  security:
    runs-on: ubuntu-latest
    needs: [test, build]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile

      - name: pnpm audit
        run: pnpm audit --audit-level=high

      - name: Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

      - name: SonarCloud
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### PWA manifest (next.config.ts)

```typescript
// /pwa/next.config.ts
import withPWA from 'next-pwa'

const config = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})({
  // next config
})

export default config
```

## Checklist de validation

- [ ] PM2 ecosystem.config.js configuré pour backend + pwa
- [ ] Toutes les variables d'env dans GitHub Secrets
- [ ] `.env.production` jamais commité (`.gitignore`)
- [ ] CI passe (quality → test + build → security) avant tout merge main
- [ ] Migrations Prisma exécutées au déploiement (`prisma migrate deploy`)
- [ ] `pm2 startup` configuré sur o2switch (redémarrage après reboot)
- [ ] `pnpm audit` sans vulnérabilité HIGH ou CRITICAL
