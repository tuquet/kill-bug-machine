export interface Person {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  email?: string;
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
}

export interface Comment {
  id: string;
  author: Person;
  body: string;
  bodyHtml?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RepositoryInfo {
  name: string;
  owner: string;
  url: string;
  platform: import('../enums/bug-source.enum').BugSource;
}

export interface PaginationParams {
  limit: number;
  offset: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}
