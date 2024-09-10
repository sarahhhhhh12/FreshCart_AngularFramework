import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrdersService } from './../../core/services/orders.service';
import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [ReactiveFormsModule,NgClass],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnDestroy {
  /*##################################### Inject Servcies ##################################### */
  private readonly _OrdersService = inject(OrdersService)
  private readonly _FormBuilder = inject(FormBuilder)
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _Router = inject(Router)

  /*##################################### Global Properties ##################################### */
  checkOutSub!:Subscription
  cashSub!:Subscription


  /*##################################### FormGroup And Validattion Form ##################################### */
  paymentForm:FormGroup = this._FormBuilder.group({
    details: [null, [Validators.required]],
    phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    city: [null, [Validators.required]]
  })

  /*##################################### Electronic payment ##################################### */
  checkOut():void{
    if(this.paymentForm.valid){
      this._ActivatedRoute.paramMap.subscribe({
        next:(params)=>{
          let cartId:string | null = params.get('id')
          this.checkOutSub = this._OrdersService.checkOutCart(cartId, this.paymentForm.value).subscribe({
            next:(res)=>{
              if(res.status == 'success'){
                window.open(res.session.url, '_self')
              }
            }
          })
        }
      })
    }
  }

  /*##################################### Payment Cash ##################################### */
  orderCash():void{
    if(this.paymentForm.valid){
      this._ActivatedRoute.paramMap.subscribe({
        next:(params)=>{
          let cartId = params.get('id')
          this.cashSub = this._OrdersService.orderCash(cartId, this.paymentForm.value).subscribe({
            next:(res)=>{
              if(res.status == 'success'){
                this._ToastrService.success(`Total Price : ${res.data.totalOrderPrice}`, res.data.paymentMethodType)
                this._Router.navigate(['/allorders'])
              }
            }
          })
        }
      })
    }
  }

  /*##################################### Unsubscrib ##################################### */
  ngOnDestroy(): void {
    this.checkOutSub?.unsubscribe()
    this.cashSub?.unsubscribe()
  }
}
