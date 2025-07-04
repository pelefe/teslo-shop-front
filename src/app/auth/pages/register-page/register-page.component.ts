import { AuthService } from '@/auth/services/auth.service';
import { Component, inject, signal } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import { Router } from '@angular/router';

@Component({
  selector: 'register-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  fb = inject(FormBuilder)
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);

   authService = inject(AuthService);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    fullName: ['', [Validators.required, Validators.minLength(6)]],
  });


  onSubmit() {
    if(this.registerForm.invalid){
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      },2000);
      return;
    }
    const {email = '', password = '',fullName = ''} = this.registerForm.value

    this.authService.register(email! ,password!, fullName!).subscribe((isValid) =>{

       if(isValid){
        this.router.navigateByUrl('/')
        return;
      }

      this.hasError.set(true);
    })
  }
}

