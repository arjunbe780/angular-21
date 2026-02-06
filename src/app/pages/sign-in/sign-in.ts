import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { AppInput } from '../../sharedComponent/app-input/app-input';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, AppInput, CommonModule, DatePipe],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignIn implements OnInit {
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

  userData = signal([
    {
      name: 'Arjunan',
      age: 22,
      isSelected: true,
    },
    {
      name: 'Arjunan',
      age: 21,
      isSelected: false,
    },
    {
      name: 'Arjunan',
      age: 20,
      isSelected: false,
    },
  ]);
  today = new Date();
  isSpecial = true;

  hero = {
    name: 'Superman',
  };

  m = [1, 2, 3, 3, 4, 4, 44, 4, 4, 4, 4, 55, 5, 66, 6];

  ngOnInit() {
    const data = this.navigationState();
    console.log(Math.max(...this.m));
    const max = this.findLargest(this.m);
    console.log('Max:', max);

    // Safety check for the object path
    if (data?.loginForm) {
      this.reactForm.patchValue({
        email: data.loginForm.email,
        password: data.loginForm.password,
      });

      // ESSENTIAL: For OnPush to reflect these changes immediately
      this.cdr.markForCheck();
    }
    const b = this.userData().map(({ age, ...rest }) => rest);
    console.log(b);
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
  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Template Form Success:', form.value);
    }
  }

  generate(name: string) {
    console.log('asada', name);
  }
  inputChange(name: any) {
    console.log('sadsa', name);
  }
  handleCheckboxChange(user: any) {
    console.log(this.userData());
  }
  handleSubmit() {
    this.userData.update((users) => users.filter((user) => !user.isSelected));
    console.log('Form submitted');
  }
  findLargest(arr: any) {
    //Suppose first element is the largest
    let largest = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > largest) {
        // Update the largest if a bigger element is found
        largest = arr[i];
      }
    }
    return largest;
  }
}
