import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { AppInput } from '../../sharedComponent/app-input/app-input';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule,AppInput],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignIn implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  @Input() username!: string;

  // Modern Timer typing
  intervalId: ReturnType<typeof setInterval> | null = null;
  count = signal(0);

  // FIXED: Validators are grouped in an array at index 1
  reactForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // Reactive Navigation State
  private state$ = this.route.paramMap.pipe(map(() => window.history.state));
  navigationState = toSignal(this.state$);

  ngOnInit() {
    const data = this.navigationState();

    // Safety check for the object path
    if (data?.loginForm) {
      this.reactForm.patchValue({
        email: data.loginForm.email,
        password: data.loginForm.password,
      });

      // ESSENTIAL: For OnPush to reflect these changes immediately
      this.cdr.markForCheck();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Input changed:', changes);
  }

  reactFormSubmit() {
    if (this.reactForm.valid) {
      console.log('Reactive Form Success:', this.reactForm.value);
    } else {
      this.reactForm.markAllAsTouched();
    }
  }

  startTimer() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      this.count.update((v) => v + 1);
    }, 1000);
  }

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  onSubmit(form:NgForm) {
    if (form.valid) {
      console.log('Template Form Success:', form.value);
    }

  }
}
