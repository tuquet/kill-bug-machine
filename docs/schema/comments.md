# Comments Schema

Defines the structure for discussion threads attached to Tasks.

## 1. Comment DTO (`CommentDTO`)

```typescript
export interface CommentDTO {
  id: string; // UUID
  taskId: string; // UUID of the parent task
  authorId: string; // UUID of the Profile who wrote the comment
  
  /** Content of the comment in Markdown format */
  content: string;
  
  /** True if the comment has been edited since creation */
  isEdited: boolean;
  
  /** Array of attachment IDs if the comment contains files/images */
  attachmentIds?: string[];
  
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}
```

## 2. Comment Detailed DTO (`CommentDetailDTO`)

Includes nested information to display the author's details directly.

```typescript
export interface CommentDetailDTO extends CommentDTO {
  author: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
  attachments?: {
    id: string;
    fileName: string;
    fileUrl: string;
    mimeType: string;
  }[];
}
```

## 3. Create Comment DTO (`CreateCommentDTO`)

```typescript
export interface CreateCommentDTO {
  taskId: string;
  content: string;
  attachmentIds?: string[]; // Optional file uploads linked to this comment
}
```

## 4. Update Comment DTO (`UpdateCommentDTO`)

```typescript
export interface UpdateCommentDTO {
  content: string;
}
```
