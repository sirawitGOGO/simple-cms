import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [DatePipe],
  template: `
    <article class="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div class="mb-4 flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold text-indigo-700">{{ post.authorName || post.username || 'ไม่ทราบผู้เขียน' }}</p>
          <time class="mt-1 block text-xs text-slate-500" [attr.datetime]="post.createdAt | date: 'yyyy-MM-dd'">
            {{ post.createdAt | date: 'd MMM yyyy, HH:mm' }}
          </time>
        </div>
        <span class="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">โพสต์</span>
      </div>

      <h2 class="text-xl font-bold leading-snug text-slate-900">{{ post.title }}</h2>
      <p class="mt-3 flex-1 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-slate-600">{{ post.content }}</p>

      <div class="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
        <button type="button" (click)="edit.emit(post)"
          class="rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700">
          แก้ไข
        </button>
        <button type="button" (click)="delete.emit(post.id)"
          class="rounded-lg border border-red-200 px-3.5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50">
          ลบ
        </button>
      </div>
    </article>
  `,
})
export class PostCardComponent {
  @Input({ required: true }) post!: Post;
  @Output() edit = new EventEmitter<Post>();
  @Output() delete = new EventEmitter<number>();
}
