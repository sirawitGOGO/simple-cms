import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [DatePipe],
  template: `
    <article role="button" tabindex="0" (click)="openDetails()" (keydown.enter)="openDetails()"
      (keydown.space)="$event.preventDefault(); openDetails()"
      aria-label="ดูรายละเอียดโพสต์"
      class="flex h-full cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-100">
      <div class="mb-4 flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold text-indigo-700">{{ post.username || 'ไม่ทราบผู้เขียน' }}</p>
          <time class="mt-1 block text-xs text-slate-500" [attr.datetime]="post.createdAt | date: 'yyyy-MM-dd'">
            {{ post.createdAt | date: 'd MMM yyyy, HH:mm' }}
          </time>
        </div>
        <span class="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">โพสต์</span>
      </div>

      <h2 class="text-xl font-bold leading-snug text-slate-900">{{ post.title }}</h2>
      <p class="mt-3 flex-1 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-slate-600">{{ post.content }}</p>

      @if (isOwner()) {
        <div class="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
          <button type="button" (keydown.enter)="$event.stopPropagation()" (keydown.space)="$event.stopPropagation()"
            (click)="$event.stopPropagation(); edit.emit(post)"
            class="rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700">
            แก้ไข
          </button>
          <button type="button" (keydown.enter)="$event.stopPropagation()" (keydown.space)="$event.stopPropagation()"
            (click)="$event.stopPropagation(); delete.emit(post.id)"
            class="rounded-lg border border-red-200 px-3.5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50">
            ลบ
          </button>
        </div>
      }
    </article>

    @if (detailsOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4"
        (click)="closeDetails()" (keydown.escape)="closeDetails()">
        <section role="dialog" aria-modal="true" aria-labelledby="post-detail-title"
          class="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8" (click)="$event.stopPropagation()">
          <button type="button" aria-label="ปิดหน้ารายละเอียด" (click)="closeDetails()"
            class="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-100">×</button>

          @if (detailsLoading()) {
            <div class="flex min-h-48 items-center justify-center text-sm font-medium text-slate-500">กำลังโหลดรายละเอียดโพสต์…</div>
          } @else if (detailsError()) {
            <div role="alert" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ detailsError() }}</div>
          } @else if (detailPost(); as detail) {
            <div class="pr-10">
              <p class="text-sm font-semibold text-indigo-700">{{ detail.username || 'ไม่ทราบผู้เขียน' }}</p>
              <time class="mt-1 block text-sm text-slate-500">{{ detail.createdAt | date: 'd MMM yyyy, HH:mm' }}</time>
              <h2 id="post-detail-title" class="mt-5 text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">{{ detail.title }}</h2>
              <p class="mt-5 whitespace-pre-wrap wrap-break-word text-base leading-7 text-slate-700">{{ detail.content }}</p>
            </div>
          }
        </section>
      </div>
    }
  `,
})
export class PostCardComponent {
  private readonly auth = inject(AuthService);
  private readonly postService = inject(PostService);
  @Input({ required: true }) post!: Post;
  @Output() edit = new EventEmitter<Post>();
  @Output() delete = new EventEmitter<number>();
  readonly detailsOpen = signal(false);
  readonly detailsLoading = signal(false);
  readonly detailsError = signal('');
  readonly detailPost = signal<Post | null>(null);

  isOwner(): boolean {
    const currentUsername = this.auth.currentUser()?.username;
    return !!currentUsername && currentUsername === this.post.username;
  }

  openDetails(): void {
    if (this.detailsLoading()) return;
    this.detailsOpen.set(true);
    this.detailsLoading.set(true);
    this.detailsError.set('');
    this.postService.getPost(this.post.id).subscribe({
      next: (post) => {
        this.detailPost.set(post);
        this.detailsLoading.set(false);
      },
      error: () => {
        this.detailsLoading.set(false);
        this.detailsError.set('โหลดรายละเอียดโพสต์ไม่สำเร็จ กรุณาปิดแล้วลองใหม่อีกครั้ง');
      },
    });
  }

  closeDetails(): void {
    this.detailsOpen.set(false);
    this.detailPost.set(null);
    this.detailsError.set('');
  }
}
