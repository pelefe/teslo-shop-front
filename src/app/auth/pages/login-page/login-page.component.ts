import { AuthService } from '@/auth/services/auth.service';
import { Component, inject, signal } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);

  authService = inject(AuthService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if(this.loginForm.invalid){
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      },2000);
      return;
    }

    this.hasError.set(false);
    const {email = '', password = ''} = this.loginForm.value

    this.authService.login(email! ,password!).subscribe((isValid) =>{
      if(isValid){
        this.router.navigateByUrl('/')
        return;
      }

      this.hasError.set(true);
    })
  }
};
