export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  bio: string;
  password?: string; // Dodane dla rejestracji
}

export interface Story {
  id: string;
  authorId: string;
  title: string;
  description: string;
  genre: string;
  tags: string[];
  coverUrl: string;
  createdAt: string;
  views: number;
  likes: number;
}

export interface Chapter {
  id: string;
  storyId: string;
  title: string;
  content: string;
  publishedAt: string;
}

export interface Comment {
  id: string;
  storyId: string;
  userId: string;
  username?: string; // Dodane pole
  content: string;
  createdAt: string;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
}

export interface Rating {
  id: string;
  raterId: string;
  ratedUserId: string;
  score: number;
}

export interface UserLike {
  id: string;
  userId: string;
  storyId: string;
}