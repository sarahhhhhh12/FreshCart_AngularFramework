import { Component, ElementRef, HostListener, inject, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy {
/*########################################## Inject Services ############################################# */
  private readonly _FormBuilder= inject(FormBuilder)
  private readonly _AuthService = inject(AuthService)
  private readonly _Router = inject(Router)

/*########################################## Global Properties ############################################# */
  isLoading:boolean = false
  allLoginSubmit!:Subscription

/*########################################## FormGroup And Validtion Form ############################################# */
  loginForm:FormGroup = this._FormBuilder.group({
    email:[null, [Validators.required, Validators.email]],
    password:[null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/)]]
  })

/*########################################## Submit login Form ############################################# */
  loginSubmit():void{
    if(this.loginForm.valid){
      this.isLoading = true
      this.allLoginSubmit = this._AuthService.setLoginFrom(this.loginForm.value).subscribe({
        next:(res)=>{
          this.isLoading = false
          if(res.message == 'success'){
            // Save Token
            localStorage.setItem("userToken", res.token)
            //Decode Token
            this._AuthService.saveUserData()
            // Navigate To Home
            this._Router.navigate(['/home'])
          }
        },
        error:(err)=>{
          this.isLoading = false
        }
      })
    } else{
      this.isLoading = false
      this.loginForm.markAllAsTouched()
    }
  }

/*########################################## Show And Hide Password ############################################# */
  @ViewChild('inputPassword') myElement!:ElementRef
  @ViewChild('showIcone') showIcon!:ElementRef
  @ViewChild('hideIcone') hideIcone!:ElementRef

  show(){
    this.myElement.nativeElement.setAttribute('type', 'text')
    this.showIcon.nativeElement.classList.add('d-none')
    this.hideIcone.nativeElement.classList.remove('d-none')
  }

  hide():void{
    this.myElement.nativeElement.setAttribute('type', 'password')
    this.showIcon.nativeElement.classList.remove('d-none')
    this.hideIcone.nativeElement.classList.add('d-none')
  }

/*########################################## Unsubscrib ########################################## */
  ngOnDestroy(): void {
    this.allLoginSubmit?.unsubscribe()
  }
}
