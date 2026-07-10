# /new-api-route

Crée un nouveau endpoint dans le backend NestJS.

## Convention de nommage

Un module NestJS par ressource métier :

```
/backend/src/
  applications/
    applications.module.ts
    applications.controller.ts
    applications.service.ts
    dto/
      create-application.dto.ts
      update-application.dto.ts
```

## Template controller

```typescript
// /backend/src/applications/applications.controller.ts
import { Controller, Get, Post, Patch, Delete, Body, Param, Query, NotFoundException } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
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

  // Privé par défaut — AuthGuard global actif
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

## Template service

```typescript
// /backend/src/applications/applications.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'

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

## Template DTO

```typescript
// /backend/src/applications/dto/create-application.dto.ts
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

## Checklist

- [ ] Route privée par défaut — `@Public()` uniquement si vraiment publique
- [ ] `@CurrentUser()` pour l'utilisateur — jamais `req.user` direct
- [ ] `findFirst({ where: { id, userId } })` — jamais `findUnique({ where: { id } })`
- [ ] `userId` dans tous les `findMany`, `create`, `update`, `delete`
- [ ] DTO via `createZodDto(SchemaDepuisShared)` — jamais de Zod inline
- [ ] Décorateurs Swagger (`@ApiTags`, `@ApiOperation`, `@ApiProperty`) présents
- [ ] Catch `P2025` sur `update()` et `delete()`
- [ ] Zéro logique métier dans le controller — tout dans le service
- [ ] Module déclaré et importé dans `AppModule`
- [ ] TypeScript strict — zéro `any`
