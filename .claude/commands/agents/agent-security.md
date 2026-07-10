# Agent : @security

Expert sécurité — auth, validation, protection API, bonnes pratiques.

## Domaine de compétence

- Better Auth (sessions, CSRF, cookies sécurisés, email verification)
- NestJS Guards (AuthGuard global, routes privées par défaut)
- Validation Zod (schémas partagés `@working-on-it/shared`)
- Isolation des données par userId (IDOR prevention)
- Variables d'environnement
- Headers de sécurité HTTP (Helmet)
- Rate limiting (`@nestjs/throttler`)
- SSRF (prefill service)

## Règles de sécurité non-négociables

### 1 — Routes privées par défaut

`AuthGuard` est enregistré globalement dans `AppModule`. Toute route est privée par défaut. Une route publique doit être explicitement décorée.

```typescript
// ✅ Route privée — rien à faire
@Get()
findAll(@CurrentUser() user: AuthUser) {}

// ✅ Route publique — @Public() obligatoire
@Public()
@Post('register')
register(@Body() dto: RegisterDto) {}

// ❌ JAMAIS de route sans @Public() qui serait réellement publique par accident
```

### 2 — Isolation des données : toujours filtrer par userId

```typescript
// ✅ TOUJOURS — double condition id + userId
const app = await prisma.application.findFirst({
  where: { id, userId: user.id }
})
if (!app) throw new NotFoundException()

// ✅ TOUJOURS sur findMany
await prisma.application.findMany({
  where: { userId: user.id }
})

// ❌ JAMAIS — expose les données de tous les users
await prisma.application.findMany()

// ❌ JAMAIS — un user peut accéder aux données d'un autre
await prisma.application.findUnique({ where: { id } })
```

### 3 — Validation Zod sur tous les inputs

Schémas définis dans `@working-on-it/shared`, DTOs via `nestjs-zod`.

```typescript
// ✅ DTO hérite du schéma partagé — validation automatique via ZodValidationPipe global
export class CreateApplicationDto extends createZodDto(CreateApplicationSchema) {}

@Post()
create(@CurrentUser() user: AuthUser, @Body() dto: CreateApplicationDto) {
  return this.service.create(user.id, dto)  // dto déjà validé
}

// ❌ JAMAIS utiliser le body raw sans validation
@Post()
create(@Body() body: any) {
  return this.service.create(user.id, body)
}
```

### 4 — Configuration Better Auth sécurisée

```typescript
export const auth = betterAuth({
  baseURL: requireEnv('BETTER_AUTH_URL'),
  secret: requireEnv('BETTER_AUTH_SECRET', 32),  // min 32 chars, crash si absent
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,  // bloque login avant vérification email
  },
  socialProviders: {
    google: {
      clientId: requireEnv('GOOGLE_CLIENT_ID'),
      clientSecret: requireEnv('GOOGLE_CLIENT_SECRET'),
    },
  },
  account: {
    accountLinking: { enabled: true, trustedProviders: ['google'] },
  },
})
```

### 5 — Headers de sécurité HTTP

Helmet configuré dans `main.ts` :

```typescript
app.use(helmet())
app.getHttpAdapter().getInstance().set('trust proxy', 1)
```

### 6 — Rate limiting

`AppThrottlerGuard` enregistré globalement, lit `X-Forwarded-For` pour les IP correctes derrière proxy.

```typescript
// Rate limit plus strict sur les routes auth
@Throttle({ short: { ttl: 60_000, limit: 10 }, medium: { ttl: 900_000, limit: 30 } })
@Controller('api/auth')
export class AuthController {}
```

### 7 — Variables d'environnement

```typescript
// ✅ Crash au démarrage si variable manquante
function requireEnv(key: string, minLength?: number): string {
  const value = process.env[key]
  if (!value) throw new Error(`Variable manquante : ${key}`)
  if (minLength && value.length < minLength)
    throw new Error(`${key} trop court — minimum ${minLength} chars`)
  return value
}

// ❌ JAMAIS de fallback hardcodé
const url = process.env.BETTER_AUTH_URL ?? 'http://localhost:3002'
```

### 8 — SSRF (prefill service)

Résoudre le DNS avant de vérifier l'IP — pas seulement vérifier le hostname :

```typescript
async function isPrivateUrl(rawUrl: string): Promise<boolean> {
  try {
    const { hostname } = new URL(rawUrl)
    if (PRIVATE_IP_RE.test(hostname)) return true
    const { address } = await dns.promises.lookup(hostname)  // résolution DNS
    return PRIVATE_IP_RE.test(address)  // vérification sur l'IP résolue
  } catch { return true }
}
```

### 9 — Hop-by-hop headers (proxy auth)

Filtrer les hop-by-hop headers avant de forwarder vers Better Auth :

```typescript
const HOP_BY_HOP = new Set(['connection', 'keep-alive', 'transfer-encoding', 'upgrade', 'proxy-authorization', 'te', 'trailer'])
for (const [key, value] of Object.entries(req.headers)) {
  if (HOP_BY_HOP.has(key.toLowerCase())) continue
  headers.set(key, value)
}
```

## Checklist d'audit sécurité

### Routes API
- [ ] Routes privées par défaut — `@Public()` uniquement sur les routes réellement publiques
- [ ] `@CurrentUser()` utilisé — jamais `req.user` direct
- [ ] `findFirst({ where: { id, userId } })` — jamais `findUnique({ where: { id } })` seul
- [ ] `userId` dans tous les `findMany`, `create`, `update`, `delete`
- [ ] DTOs via `createZodDto` — schéma depuis `@working-on-it/shared`
- [ ] Catch `P2025` sur `update()` et `delete()` pour éviter les fuites d'existence
- [ ] Pas de données sensibles dans les logs ni dans les réponses d'erreur

### Configuration
- [ ] `BETTER_AUTH_SECRET` ≥ 32 caractères via `requireEnv()`
- [ ] Toutes les variables d'env critiques via `requireEnv()` — crash au boot si manquantes
- [ ] `requireEmailVerification: true` dans Better Auth
- [ ] Helmet activé + `trust proxy 1`
- [ ] ThrottlerGuard global + rate limit renforcé sur `/api/auth`
- [ ] `GlobalExceptionFilter` — stack traces masquées dans les réponses

### Frontend (Next.js)
- [ ] Middleware Next.js protège toutes les routes dashboard
- [ ] Pas de données sensibles dans Zustand (état UI seulement)
- [ ] Variables d'env sensibles uniquement côté serveur (pas de `NEXT_PUBLIC_` sur secrets)
- [ ] Pas d'ID utilisateur exposé dans les URLs publiques
