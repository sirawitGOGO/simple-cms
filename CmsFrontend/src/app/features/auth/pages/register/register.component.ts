import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <section class="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/70">
        <header class="mb-8 text-center">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Simple CMS</p>
          <h1 class="mt-3 text-3xl font-bold tracking-tight text-slate-900">สร้างบัญชีใหม่</h1>
          <p class="mt-2 text-sm text-slate-500">สมัครสมาชิกเพื่อเริ่มจัดการโพสต์</p>
        </header>

        @if (errorMessage()) {
          <div role="alert" class="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ errorMessage() }}</div>
        }

        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5" novalidate>
          <div>
            <label for="username" class="mb-1.5 block text-sm font-medium text-slate-700">Username</label>
            <input id="username" type="text" formControlName="username" autocomplete="username"
              class="w-full rounded-lg border border-slate-300 px-3.5 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              [class.border-red-400]="showError('username')" />
            @if (showError('username')) { <p class="mt-1.5 text-sm text-red-600">กรุณากรอก Username</p> }
          </div>
          <div>
            <label for="password" class="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
            <input id="password" type="password" formControlName="password" autocomplete="new-password"
              class="w-full rounded-lg border border-slate-300 px-3.5 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              [class.border-red-400]="showError('password')" />
            @if (showError('password')) { <p class="mt-1.5 text-sm text-red-600">รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร</p> }
          </div>
          <button type="submit" [disabled]="form.invalid || submitting()"
            class="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-50">
            {{ submitting() ? 'กำลังสมัครสมาชิก…' : 'สมัครสมาชิก' }}
          </button>
        </form>

        <p class="mt-7 text-center text-sm text-slate-600">มีบัญชีอยู่แล้ว?
          <a routerLink="/login" class="font-semibold text-indigo-600 hover:text-indigo-700">กลับไปเข้าสู่ระบบ</a>
        </p>
      </section>
    </main>
  `,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly submitting = signal(false);
  readonly errorMessage = signal('');
  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  showError(field: 'username' | 'password'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.dirty || control.touched);
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting()) return;
    this.errorMessage.set('');
    this.submitting.set(true);
    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        void this.router.navigate(['/login']);
      },
      error: () => {
        this.submitting.set(false);
        this.errorMessage.set('สมัครสมาชิกไม่สำเร็จ กรุณาตรวจสอบข้อมูลแล้วลองอีกครั้ง');
      },
    });
  }
}
