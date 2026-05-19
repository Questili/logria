import { demoUser, demoWorkspace } from "./demo-data";
import type { Capability, Role } from "./types";
import { assertCapability } from "./permissions";
import { readSession } from "./session";

export type SessionUser = typeof demoUser;
export type WorkspaceAccess = { workspace: typeof demoWorkspace; role: Role; user: SessionUser };

export async function requireUser(): Promise<SessionUser> {
  const session = await readSession();
  return { ...demoUser, id: session.userId, email: session.email, role: session.role };
}

export async function requireWorkspaceAccess(workspaceId = demoWorkspace.id): Promise<WorkspaceAccess> {
  const session = await readSession();
  const user = await requireUser();
  if (workspaceId !== session.workspaceId) {
    throw new Error("Workspace not found or inaccessible");
  }
  return { workspace: { ...demoWorkspace, id: session.workspaceId }, role: session.role, user };
}

export async function requirePermission(workspaceId: string, permission: Capability): Promise<WorkspaceAccess> {
  const access = await requireWorkspaceAccess(workspaceId);
  assertCapability(access.role, permission);
  return access;
}
