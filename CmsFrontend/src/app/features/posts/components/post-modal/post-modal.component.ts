import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4"
        (click)="close.emit()" (keydown.escape)="close.emit()">
        <section role="dialog" aria-modal="true" [attr.aria-labelledby]="'post-modal-title'"
          class="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8" (click)="$event.stopPropagation()">
          <div class="mb-6 flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Simple CMS</p>
              <h2 id="post-modal-title" class="mt-2 text-2xl font-bold text-slate-900">
                {{ editingPost ? 'แก้ไขโพสต์' : 'สร้างโพสต์ใหม่' }}
              </h2>
            </div>
            <button type="button" aria-label="ปิด" (click)="close.emit()"
              class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">✕</button>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5" novalidate>
            <div>
              <label for="post-title" class="mb-1.5 block text-sm font-medium text-slate-700">หัวข้อ</label>
              <input id="post-title" type="text" formControlName="title" maxlength="160"
                class="w-full rounded-lg border border-slate-300 px-3.5 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" />
              @if (form.controls.title.invalid && form.controls.title.touched) {
                <p class="mt-1.5 text-sm text-red-600">กรุณากรอกหัวข้อ (ไม่เกิน 160 ตัวอักษร)</p>
              }
            </div>
            <div>
              <label for="post-content" class="mb-1.5 block text-sm font-medium text-slate-700">เนื้อหา</label>
              <textarea id="post-content" rows="7" formControlName="content"
                class="w-full resize-y rounded-lg border border-slate-300 px-3.5 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"></textarea>
              @if (form.controls.content.invalid && form.controls.content.touched) {
                <p class="mt-1.5 text-sm text-red-600">กรุณากรอกเนื้อหา</p>
              }
            </div>
            <div class="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button type="button" (click)="close.emit()"
                class="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">ยกเลิก</button>
              <button type="submit" [disabled]="form.invalid"
                class="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
                {{ editingPost ? 'บันทึกการแก้ไข' : 'สร้างโพสต์' }}
              </button>
            </div>
          </form>
        </section>
      </div>
    }
  `,
})
export class PostModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() editingPost: Post | null = null;
  @Output() save = new EventEmitter<{ title: string; content: string }>();
  @Output() close = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(160)]],
    content: ['', Validators.required],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] || changes['editingPost']) {
      this.form.reset({
        title: this.editingPost?.title ?? '',
        content: this.editingPost?.content ?? '',
      });
    }
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.save.emit(this.form.getRawValue());
  }
}
