import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  router = inject(Router);

  http = inject(HttpClient);
  // Define the form structure
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  onSubmit() {
    if (this.loginForm.valid) {
      this.http.post('login', this.loginForm.value).subscribe({
        next: (res:any) => {
          console.log(res);
          localStorage.setItem('token', res.data.access_token);
          this.router.navigateByUrl('/home');
        },
        error: (err) => {
          console.log(err);
        },
      });
      // this.router.navigateByUrl('/home');
      console.log('Form Submitted!', this.loginForm.value);
      // Proceed with your API call here
    } else {
      this.loginForm.markAllAsTouched(); // Show errors if user clicks submit early
    }
  }
}
