export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string | Date;
  authorName?: string;
  username?: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
}

export interface UpdatePostDto {
  title: string;
  content: string;
}
