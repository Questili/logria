import type { RiskLevel } from "./types";
import { demoWorkspace, demoUser } from "./demo-data";
import { listPersistedAuditEvents, persistAuditEvent } from "./persistence";

export type AuditEvent = {
  id: string;
  workspaceId: string;
  actorUserId: string;
  eventType: string;
  riskLevel: RiskLevel;
  targetType: string;
  targetId?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

const auditEvents: AuditEvent[] = [
  {
    id: "audit_seed_1",
    workspaceId: demoWorkspace.id,
    actorUserId: demoUser.id,
    eventType: "workspace.demo_seeded",
    riskLevel: "read",
    targetType: "workspace",
    targetId: demoWorkspace.id,
    reason: "Demo data initialized",
    metadata: { source: "seed" },
    createdAt: new Date("2026-05-19T00:00:00.000Z").toISOString(),
  },
];

export function emitAuditEvent(event: Omit<AuditEvent, "id" | "createdAt">): AuditEvent {
  const created: AuditEvent = {
    ...event,
    id: `audit_${auditEvents.length + 1}`,
    createdAt: new Date().toISOString(),
  };
  auditEvents.unshift(created);
  void persistAuditEvent(event).catch(() => undefined);
  return created;
}

export async function emitAuditEventAsync(event: Omit<AuditEvent, "id" | "createdAt">): Promise<AuditEvent> {
  const persisted = await persistAuditEvent(event).catch(() => null);
  if (persisted) return persisted;
  return emitAuditEvent(event);
}

export function listAuditEvents(workspaceId = demoWorkspace.id): AuditEvent[] {
  return auditEvents.filter((event) => event.workspaceId === workspaceId);
}

export async function listAuditEventsAsync(workspaceId = demoWorkspace.id): Promise<AuditEvent[]> {
  const persisted = await listPersistedAuditEvents(workspaceId).catch(() => null);
  return persisted ?? listAuditEvents(workspaceId);
}

export function resetAuditEventsForTests(): void {
  auditEvents.splice(1);
}
