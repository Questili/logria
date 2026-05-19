import { demoUser, demoWorkspace } from "./demo-data";
import type { Capability, Role } from "./types";
import { assertCapability } from "./permissions";

export type SessionUser = typeof demoUser;
export type WorkspaceAccess = { workspace: typeof demoWorkspace; role: Role; user: SessionUser };

export async function requireUser(): Promise<SessionUser> {
  return demoUser;
}

export async function requireWorkspaceAccess(workspaceId = demoWorkspace.id): Promise<WorkspaceAccess> {
  const user = await requireUser();
  if (workspaceId !== demoWorkspace.id) {
    throw new Error("Workspace not found or inaccessible");
  }
  return { workspace: demoWorkspace, role: user.role, user };
}

export async function requirePermission(workspaceId: string, permission: Capability): Promise<WorkspaceAccess> {
  const access = await requireWorkspaceAccess(workspaceId);
  assertCapability(access.role, permission);
  return access;
}
