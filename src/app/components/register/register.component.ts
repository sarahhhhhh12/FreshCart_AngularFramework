import { Component, ElementRef, inject, OnDestroy, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnDestroy {
  /*##################################### Inject Servcies ##################################### */
  private readonly _FormBuilder= inject(FormBuilder)
  private readonly _AuthService = inject(AuthService)
  private readonly _Router = inject(Router)

  /*##################################### Global Properties ##################################### */
  allRegisterSubmit!:Subscription
  isLoading:boolean = false

  /*##################################### FormGroup And Validattion Form ##################################### */
  registerForm:FormGroup = this._FormBuilder.group({
    name:[null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    phone:[null, [Validators.required, Validators.pattern(/^(?:\+20|0)?1[0125]\d{8}$/) ]],
    email:[null, [Validators.required, Validators.email]],
    password:[null,[Validators.required, Validators.pattern( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/) ]],
    rePassword:[null],
  }, {validators:this.confirmPassword} )
  confirmPassword(g:AbstractControl){
    if(g.get('password')?.value === g.get('rePassword')?.value ){
      return null
    } else{
      return {mismatch:true}
    }
  }

  /*##################################### Submit Register Form ##################################### */
  registerSubmit():void{
    if(this.registerForm.valid){
      this.isLoading = true
      this.allRegisterSubmit = this._AuthService.setRegisterForm(this.registerForm.value).subscribe({
        next:(res)=>{
          this.isLoading = false
          if(res.message == 'success'){
            this._Router.navigate(['/login'])
          } else{
            this.isLoading = false
          }
        },
        error:(err)=>{
          this.isLoading = false
        }
      })
    } else{
      this.registerForm.markAllAsTouched()
      this.registerForm.setErrors({mismatch: true})
    }
  }

  /*##################################### Show And Hide Password And Repassword ##################################### */
  @ViewChild('inputPassword') myPassword!:ElementRef
  @ViewChild('inputRepassword') myRepassword!:ElementRef
  @ViewChild('showPasswordIcone') showPasswordIcone!:ElementRef
  @ViewChild('hidePasswordIcone') hidePasswordIcone!:ElementRef
  @ViewChild('showRepasswordIcone') showRepasswordIcone!:ElementRef
  @ViewChild('hideRepasswordIcone') hideRepasswordIcone!:ElementRef

  showPassword():void{
    this.myPassword.nativeElement.setAttribute('type', 'text')
    this.showPasswordIcone.nativeElement.classList.add('d-none')
    this.hidePasswordIcone.nativeElement.classList.remove('d-none')
  }

  hidePassword():void{
    this.myPassword.nativeElement.setAttribute('type', 'password')
    this.showPasswordIcone.nativeElement.classList.remove('d-none')
    this.hidePasswordIcone.nativeElement.classList.add('d-none')
  }

  showRepassword():void{
    this.myRepassword.nativeElement.setAttribute('type', 'text')
    this.showRepasswordIcone.nativeElement.classList.add('d-none')
    this.hideRepasswordIcone.nativeElement.classList.remove('d-none')
  }

  hideRepassword():void{
    this.myRepassword.nativeElement.setAttribute('type', 'password')
    this.showRepasswordIcone.nativeElement.classList.remove('d-none')
    this.hideRepasswordIcone.nativeElement.classList.add('d-none')
  }

  /*##################################### Unsubscrib ##################################### */
  ngOnDestroy(): void {
    this.allRegisterSubmit?.unsubscribe()
  }

}
