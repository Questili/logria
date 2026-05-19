import { getPrisma } from "./prisma";
import { demoUser, demoWorkspace } from "./demo-data";
import type { AuditEvent } from "./audit";
import type { RiskLevel } from "./types";

export async function ensureDemoPersistence() {
  const prisma = getPrisma();
  if (!prisma) return null;
  const workspace = await prisma.workspace.upsert({
    where: { slug: demoWorkspace.slug },
    update: { name: demoWorkspace.name },
    create: { id: demoWorkspace.id, slug: demoWorkspace.slug, name: demoWorkspace.name },
  });
  const user = await prisma.user.upsert({
    where: { email: demoUser.email },
    update: { name: demoUser.name },
    create: { id: demoUser.id, email: demoUser.email, name: demoUser.name },
  });
  await prisma.membership.upsert({
    where: { workspaceId_userId: { workspaceId: workspace.id, userId: user.id } },
    update: { role: demoUser.role, status: "active" },
    create: { workspaceId: workspace.id, userId: user.id, role: demoUser.role, status: "active" },
  });
  return { workspace, user };
}

export async function persistAuditEvent(event: Omit<AuditEvent, "id" | "createdAt">): Promise<AuditEvent | null> {
  const prisma = getPrisma();
  if (!prisma) return null;
  await ensureDemoPersistence();
  const created = await prisma.auditEvent.create({
    data: {
      workspaceId: event.workspaceId,
      actorUserId: event.actorUserId,
      eventType: event.eventType,
      riskLevel: event.riskLevel,
      targetType: event.targetType,
      targetId: event.targetId,
      reason: event.reason,
      metadata: event.metadata ? JSON.parse(JSON.stringify(event.metadata)) : undefined,
    },
  });
  return { ...event, id: created.id, createdAt: created.createdAt.toISOString() };
}

export async function listPersistedAuditEvents(workspaceId = demoWorkspace.id): Promise<AuditEvent[] | null> {
  const prisma = getPrisma();
  if (!prisma) return null;
  await ensureDemoPersistence();
  const events = await prisma.auditEvent.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" }, take: 100 });
  return events.map((event) => ({
    id: event.id,
    workspaceId: event.workspaceId,
    actorUserId: event.actorUserId ?? demoUser.id,
    eventType: event.eventType,
    riskLevel: event.riskLevel as RiskLevel,
    targetType: event.targetType,
    targetId: event.targetId ?? undefined,
    reason: event.reason ?? undefined,
    metadata: event.metadata && typeof event.metadata === "object" ? event.metadata as Record<string, unknown> : undefined,
    createdAt: event.createdAt.toISOString(),
  }));
}

export async function persistAIExchange(input: { prompt: string; answer: string; toolCalls: { toolId: string; inputHash: string; outputSummary: string; riskLevel: RiskLevel }[] }) {
  const prisma = getPrisma();
  if (!prisma) return null;
  await ensureDemoPersistence();
  const thread = await prisma.aIOperatorThread.create({ data: { workspaceId: demoWorkspace.id, title: input.prompt.slice(0, 80) || "Merlin conversation" } });
  await prisma.aIMessage.createMany({ data: [
    { threadId: thread.id, authorUserId: demoUser.id, role: "user", content: input.prompt, redactionStatus: "redacted" },
    { threadId: thread.id, role: "assistant", content: input.answer, redactionStatus: "redacted" },
  ] });
  for (const call of input.toolCalls) {
    await prisma.aIToolCall.create({ data: { workspaceId: demoWorkspace.id, toolId: call.toolId, inputHash: call.inputHash, outputSummary: call.outputSummary, riskLevel: call.riskLevel } });
  }
  return thread.id;
}
