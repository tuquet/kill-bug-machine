# Project Members Schema

Defines the structure for the many-to-many join between **Projects** and **Profiles**, including per-project roles.

## 1. Project Member DTO (`ProjectMemberDTO`)

```typescript
export interface ProjectMemberDTO {
  /** Composite PK: references Project.id */
  projectId: string; // UUID

  /** Composite PK: references Profile.id */
  profileId: string; // UUID

  /** Role within this specific project (distinct from global RBAC role) */
  role: ProjectRole;

  /** Timestamp when the user was added to the project */
  joinedAt: string; // ISO 8601 string
}

export type ProjectRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
```

## 2. Project Member Detail DTO (`ProjectMemberDetailDTO`)

Includes nested profile information for rendering member lists.

```typescript
export interface ProjectMemberDetailDTO extends ProjectMemberDTO {
  profile: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
  };
}
```

## 3. Add Member DTO (`AddProjectMemberDTO`)

```typescript
export interface AddProjectMemberDTO {
  profileId: string;
  role: ProjectRole;
}
```

## 4. Update Member Role DTO (`UpdateProjectMemberRoleDTO`)

```typescript
export interface UpdateProjectMemberRoleDTO {
  role: ProjectRole;
}
```

## Notes

- This is a **join table** with its own `role` field, making it more than a simple pivot.
- Deletion of a membership is performed via `DELETE /projects/:projectId/members/:profileId`.
- The `OWNER` role is assigned to the project creator and cannot be changed through the standard member update API.
