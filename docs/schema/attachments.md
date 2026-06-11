# Attachments Schema

Defines the structure for files and images uploaded to Tasks or Comments.

## 1. Attachment DTO (`AttachmentDTO`)

```typescript
export interface AttachmentDTO {
  id: string; // UUID
  
  /** The Profile ID of the user who uploaded the file */
  uploaderId: string;
  
  /** UUID of the task this attachment belongs to */
  taskId: string;
  
  /** UUID of the comment this attachment is embedded in (if applicable) */
  commentId?: string | null;
  
  /** Original name of the uploaded file */
  fileName: string;
  
  /** URL to access or download the file (e.g., Supabase Storage URL) */
  fileUrl: string;
  
  /** File size in bytes */
  fileSize: number;
  
  /** MIME type (e.g., 'image/png', 'application/pdf') */
  mimeType: string;
  
  createdAt: string; // ISO 8601 string
}
```

## 2. Upload Response DTO (`UploadResponseDTO`)

Standard response format when a client successfully uploads a file via the API.

```typescript
export interface UploadResponseDTO {
  id: string;
  fileUrl: string;
  fileName: string;
  success: boolean;
}
```
