import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { Post } from '../../models/post.model';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { PostModalComponent } from '../../components/post-modal/post-modal.component';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [PostCardComponent, PostModalComponent, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50">
      <header class="border-b border-slate-200 bg-white">
        <nav class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a routerLink="/posts" class="text-xl font-bold tracking-tight text-slate-900">Simple <span class="text-indigo-600">CMS</span></a>
          <div class="flex items-center gap-3">
            <button type="button" (click)="openCreateModal()"
              class="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200">
              + สร้างโพสต์
            </button>
            <button type="button" (click)="logout()" [disabled]="loggingOut()"
              class="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50">
              {{ loggingOut() ? 'กำลังออก…' : 'ออกจากระบบ' }}
            </button>
          </div>
        </nav>
      </header>

      <main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div class="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">พื้นที่ของคุณ</p>
            <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">โพสต์ทั้งหมด</h1>
          </div>
          <p class="text-sm text-slate-500">{{ posts().length }} รายการ</p>
        </div>

        @if (errorMessage()) {
          <div role="alert" class="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{{ errorMessage() }}</span>
            <button type="button" (click)="loadPosts()" class="font-semibold underline">ลองอีกครั้ง</button>
          </div>
        }

        @if (loading()) {
          <div class="flex min-h-48 items-center justify-center text-sm font-medium text-slate-500">กำลังโหลดโพสต์…</div>
        } @else if (posts().length) {
          <section aria-label="รายการโพสต์" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            @for (post of posts(); track post.id) {
              <app-post-card [post]="post" (edit)="openEditModal($event)" (delete)="deletePost($event)" />
            }
          </section>
        } @else {
          <section class="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">✎</div>
            <h2 class="mt-5 text-lg font-semibold text-slate-900">ยังไม่มีโพสต์</h2>
            <p class="mt-2 text-sm text-slate-500">เริ่มต้นเขียนโพสต์แรกของคุณได้เลย</p>
            <button type="button" (click)="openCreateModal()" class="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">+ สร้างโพสต์</button>
          </section>
        }
      </main>

      <app-post-modal [isOpen]="modalOpen()" [editingPost]="editingPost()" (close)="closeModal()" (save)="savePost($event)" />
    </div>
  `,
})
export class PostListComponent implements OnInit {
  private readonly postsService = inject(PostService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly posts = signal<Post[]>([]);
  readonly loading = signal(true);
  readonly loggingOut = signal(false);
  readonly modalOpen = signal(false);
  readonly editingPost = signal<Post | null>(null);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.postsService.getPosts().subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('โหลดรายการโพสต์ไม่สำเร็จ กรุณาลองอีกครั้ง');
        this.loading.set(false);
      },
    });
  }

  openCreateModal(): void {
    this.editingPost.set(null);
    this.modalOpen.set(true);
  }

  openEditModal(post: Post): void {
    this.editingPost.set(post);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
    this.editingPost.set(null);
  }

  savePost(value: { title: string; content: string }): void {
    const editing = this.editingPost();
    const request = editing
      ? this.postsService.updatePost(editing.id, value)
      : this.postsService.createPost(value);

    request.subscribe({
      next: () => {
        this.closeModal();
        this.loadPosts();
      },
      error: () => this.errorMessage.set('บันทึกโพสต์ไม่สำเร็จ กรุณาลองอีกครั้ง'),
    });
  }

  deletePost(id: number): void {
    if (!window.confirm('ยืนยันการลบโพสต์นี้หรือไม่?')) return;

    this.postsService.deletePost(id).subscribe({
      next: () => this.posts.update((posts) => posts.filter((post) => post.id !== id)),
      error: () => this.errorMessage.set('ลบโพสต์ไม่สำเร็จ กรุณาลองอีกครั้ง'),
    });
  }

  logout(): void {
    if (this.loggingOut()) return;
    this.loggingOut.set(true);
    this.auth.logout().subscribe({
      next: () => {
        this.loggingOut.set(false);
        void this.router.navigate(['/login']);
      },
      error: () => {
        this.loggingOut.set(false);
        this.errorMessage.set('ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง');
      },
    });
  }
}
