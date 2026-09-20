import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'

export type AuditLogWhere = Prisma.AuditLogWhereInput

export async function writeAuditLog(input: {
  actorId?: string
  action: string
  entityType: string
  entityId?: string
  metadata?: Prisma.InputJsonValue
}) {
  return prisma.auditLog.create({
    data: {
      actorId: input.actorId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      metadata: input.metadata,
    },
  })
}

/** Normalized filter for the SUPER_ADMIN audit log viewer. */
export function buildAuditLogFilter(params: {
  action?: string
  entityType?: string
  actorId?: string
  from?: Date
  to?: Date
}): AuditLogWhere {
  const where: AuditLogWhere = {}
  if (params.action) where.action = params.action
  if (params.entityType) where.entityType = params.entityType
  if (params.actorId) where.actorId = params.actorId
  if (params.from || params.to) {
    where.createdAt = {}
    if (params.from) where.createdAt.gte = params.from
    if (params.to) where.createdAt.lte = params.to
  }
  return where
}
