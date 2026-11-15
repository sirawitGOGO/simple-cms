import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreatePostDto, Post, UpdatePostDto } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly postsUrl = `${environment.apiBaseUrl}/post`;

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsUrl);
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.postsUrl}/${id}`);
  }

  createPost(dto: CreatePostDto): Observable<Post> {
    return this.http.post<Post>(this.postsUrl, dto);
  }

  updatePost(id: number, dto: UpdatePostDto): Observable<Post> {
    return this.http.put<Post>(`${this.postsUrl}/${id}`, dto);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.postsUrl}/${id}`);
  }
}
