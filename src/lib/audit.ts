import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'

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
