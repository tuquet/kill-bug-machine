# Activity Log Schema (Audit Trail)

Defines the structure for tracking changes and events related to Tasks and Projects for audit purposes.

## 1. Activity Action Enums

```typescript
export enum ActivityAction {
  // Task Actions
  TASK_CREATED = 'TASK_CREATED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_STATUS_CHANGED = 'TASK_STATUS_CHANGED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_DELETED = 'TASK_DELETED',
  
  // Comment Actions
  COMMENT_ADDED = 'COMMENT_ADDED',
  COMMENT_DELETED = 'COMMENT_DELETED',
  
  // Attachment Actions
  ATTACHMENT_ADDED = 'ATTACHMENT_ADDED',
  ATTACHMENT_REMOVED = 'ATTACHMENT_REMOVED',
  
  // Project Actions
  PROJECT_CREATED = 'PROJECT_CREATED',
  PROJECT_MEMBER_ADDED = 'PROJECT_MEMBER_ADDED',
  PROJECT_MEMBER_REMOVED = 'PROJECT_MEMBER_REMOVED'
}
```

## 2. Activity Log DTO (`ActivityLogDTO`)

```typescript
export interface ActivityLogDTO {
  id: string; // UUID
  
  /** The Profile ID of the user who performed the action */
  actorId: string;
  
  /** The type of action performed */
  action: ActivityAction;
  
  /** UUID of the affected Project */
  projectId?: string;
  
  /** UUID of the affected Task (if applicable) */
  taskId?: string;
  
  /** String representation of the previous state (e.g., "BACKLOG") */
  oldValue?: string | null;
  
  /** String representation of the new state (e.g., "IN_PROGRESS") */
  newValue?: string | null;
  
  /** Any additional metadata (e.g., filename of the deleted attachment) */
  metadata?: Record<string, any>;
  
  createdAt: string; // ISO 8601 string
}
```

## 3. Activity Detail DTO (`ActivityDetailDTO`)

Includes nested information to display human-readable timelines.

```typescript
export interface ActivityDetailDTO extends ActivityLogDTO {
  actor: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
}
```
