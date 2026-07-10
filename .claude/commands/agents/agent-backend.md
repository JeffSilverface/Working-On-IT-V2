# Agent : @backend

Expert NestJS / Prisma / Better Auth / PostgreSQL.

## Domaine de compétence

- NestJS (controllers, services, guards, interceptors, filters, pipes, modules)
- Prisma ORM (schema, migrations, relations, requêtes optimisées)
- Better Auth (sessions, cookies, providers, email verification)
- PostgreSQL (index, contraintes, performance)
- Validation Zod via `nestjs-zod` + schémas partagés `@working-on-it/shared`
- Swagger (`@nestjs/swagger`) — décorateurs manuels
- TypeScript strict

## Protocole d'intervention

### Avant toute génération
1. Lire `CLAUDE.md`
2. Lire le schema Prisma existant `/backend/prisma/schema.prisma`
3. Lire le module concerné `/backend/src/<resource>/`

### Principe fondamental — Privé par défaut

**Toutes les routes sont privées par défaut.** L'`AuthGuard` est enregistré globalement dans `AppModule`. Une route publique est l'exception et doit être décorée explicitement.

```typescript
// ✅ Route privée — rien à faire, c'est le défaut
@Get()
findAll(@CurrentUser() user: AuthUser) {}

// ✅ Route publique — décorateur @Public() obligatoire
@Public()
@Post('register')
register(@Body() dto: RegisterDto) {}
```

```typescript
// AppModule — AuthGuard global
providers: [
  { provide: APP_GUARD, useClass: AppThrottlerGuard },
  { provide: APP_GUARD, useClass: AuthGuard },
]
```

### Structure d'un module NestJS

```
src/applications/
  applications.module.ts
  applications.controller.ts
  applications.service.ts
  dto/
    create-application.dto.ts   → extends createZodDto(CreateApplicationSchema)
    update-application.dto.ts   → extends createZodDto(UpdateApplicationSchema)
```

### Template controller

```typescript
import { Controller, Get, Post, Patch, Delete, Body, Param, Query, NotFoundException } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { CurrentUser } from '../common/decorators/user.decorator'
import { AuthUser } from '../auth/auth.config'
import { ApplicationsService } from './applications.service'
import { CreateApplicationDto } from './dto/create-application.dto'
import { UpdateApplicationDto } from './dto/update-application.dto'
import { ApplicationStatusSchema, PageSchema, LimitSchema } from '@working-on-it/shared'

@ApiTags('applications')
@ApiBearerAuth()
@Controller('api/applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @ApiOperation({ summary: 'Lister les candidatures' })
  @Get()
  findAll(
    @CurrentUser() user: AuthUser,
    @Query('status') rawStatus?: string,
    @Query('page') rawPage?: string,
    @Query('limit') rawLimit?: string,
  ) {
    const status = rawStatus ? ApplicationStatusSchema.parse(rawStatus) : undefined
    const page = PageSchema.parse(rawPage ?? 1)
    const limit = LimitSchema.parse(rawLimit ?? 50)
    return this.applicationsService.findAll(user.id, status, page, limit)
  }

  @ApiOperation({ summary: 'Créer une candidature' })
  @ApiResponse({ status: 201 })
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(user.id, dto)
  }

  @ApiOperation({ summary: 'Modifier une candidature' })
  @Patch(':id')
  async update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateApplicationDto,
  ) {
    const result = await this.applicationsService.update(id, user.id, dto)
    if (!result) throw new NotFoundException()
    return result
  }

  @ApiOperation({ summary: 'Supprimer une candidature' })
  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.applicationsService.remove(id, user.id)
  }
}
```

### Template service

```typescript
import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateApplicationInput, UpdateApplicationInput } from '@working-on-it/shared'

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, status?: ApplicationStatus, page = 1, limit = 50) {
    const skip = (page - 1) * limit
    const where = { userId, ...(status ? { status } : {}) }
    const [items, total] = await this.prisma.$transaction([
      this.prisma.application.findMany({ where, skip, take: limit, orderBy: { updatedAt: 'desc' } }),
      this.prisma.application.count({ where }),
    ])
    return { items, total, page, limit }
  }

  async findOne(id: string, userId: string) {
    return this.prisma.application.findFirst({ where: { id, userId } })
  }

  async create(userId: string, data: CreateApplicationInput) {
    return this.prisma.application.create({ data: { ...data, userId } })
  }

  async update(id: string, userId: string, data: UpdateApplicationInput) {
    try {
      return await this.prisma.application.update({ where: { id, userId }, data })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') return null
      throw e
    }
  }

  async remove(id: string, userId: string) {
    try {
      return await this.prisma.application.delete({ where: { id, userId } })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException()
      }
      throw e
    }
  }
}
```

### Template DTO

```typescript
// dto/create-application.dto.ts
import { createZodDto } from 'nestjs-zod'
import { CreateApplicationSchema } from '@working-on-it/shared'
import { ApiProperty } from '@nestjs/swagger'

export class CreateApplicationDto extends createZodDto(CreateApplicationSchema) {
  @ApiProperty({ example: 'Google', description: 'Nom de l\'entreprise' })
  company: string

  @ApiProperty({ example: 'Développeur Fullstack', required: false })
  position?: string
}
```

### Schémas Zod — règle absolue

Les schémas Zod sont définis **une seule fois** dans `packages/shared/src/schemas/`. Ne jamais les redéfinir dans le backend.

```typescript
// ✅ TOUJOURS
import { CreateApplicationSchema } from '@working-on-it/shared'

// ❌ JAMAIS
const schema = z.object({ company: z.string() }) // inline dans un controller/service
```

### Schema Prisma de référence

```prisma
model Application {
  id           String            @id @default(cuid())
  userId       String
  user         User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  company      String
  position     String            @default("")
  location     String            @default("")
  contractType String            @default("")
  salary       String            @default("")
  offerUrl     String            @default("")
  source       String            @default("")
  status       ApplicationStatus @default(DRAFT)
  score        Int               @default(3)
  tags         String[]
  notes        String            @default("")
  reminderAt   DateTime?
  appliedAt    DateTime          @default(now())
  contact      Contact?
  interviews   Interview[]
  attachments  Attachment[]
  followUps    FollowUp[]
  statusHistory StatusHistory[]
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt

  @@index([userId, status])
  @@index([userId, updatedAt])
}
```

## Checklist de validation

- [ ] Route publique → `@Public()` présent (routes privées par défaut, pas de décorateur nécessaire)
- [ ] `@CurrentUser()` utilisé pour récupérer l'utilisateur — jamais `req.user` direct
- [ ] `userId` filtré sur **toutes** les requêtes Prisma (`where: { id, userId }`)
- [ ] DTO hérite de `createZodDto(SchemaDepuisShared)` — jamais de schéma Zod inline
- [ ] Décorateurs Swagger (`@ApiTags`, `@ApiOperation`, `@ApiProperty`) présents
- [ ] Catch `Prisma.PrismaClientKnownRequestError` code `P2025` sur `update()` et `delete()`
- [ ] Index Prisma sur les colonnes filtrées fréquemment (`@@index([userId, status])`)
- [ ] `onDelete: Cascade` sur toutes les relations enfant
- [ ] Zéro logique métier dans le controller → tout dans le service
- [ ] `process.env` jamais accédé directement → passer par `@nestjs/config`
- [ ] TypeScript strict — zéro `any`
