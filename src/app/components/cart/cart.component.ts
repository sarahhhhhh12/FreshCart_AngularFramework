import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { ICart } from '../../core/interfaces/icart';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe,RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit , OnDestroy{
  /*##################################### Inject Servcies ##################################### */
  private readonly _CartService = inject(CartService)
  private readonly _ToastrService = inject(ToastrService)

  /*##################################### Global Properties ##################################### */
  allProductsCart!:Subscription
  productsCart:WritableSignal<ICart> = signal({} as ICart)
  // totalItems:number = 0
  totalItems:WritableSignal<number> = signal(0)
  displayBtn:boolean = true

  /*##################################### Display Products In Cart ##################################### */
  ngOnInit(): void {
    this.allProductsCart = this._CartService.displayCart().subscribe({
      next:(res)=>{
        this.totalItems.set(res.numOfCartItems)
        this.productsCart.set(res.data)
        if(this.totalItems() > 0){
          this.displayBtn = false
        }
      }
    })
  }

  /*##################################### Update Product Quantity In Cart ##################################### */
  updateProductQuantity(id:string, count:number):void{
    if(count > 0){
      this._CartService.updateCartQuabtity(id, count).subscribe({
        next:(res)=>{
          this.productsCart.set(res.data)
          this._ToastrService.success('Done !')
        }
      })
    }
  }

  /*##################################### Delete Product In Cart ##################################### */
  deleteCartItem(id:string):void{
    this._CartService.removeSpecificItem(id).subscribe({
      next:(res)=>{
        if(res.status == "success"){
          this.productsCart.set(res.data)
          this.totalItems.set(res.numOfCartItems)
          // this._CartService.cartNumber.next(res.numOfCartItems)
          this._CartService.cartNumber.set(res.numOfCartItems)
          if(this.totalItems() == 0){
            this.displayBtn = true
          }
          this._ToastrService.error('Deleted !')
        }
      }
    })
  }

  /*##################################### Clear Cart ##################################### */
  clearCart():void{
    this._CartService.clearAllProducrCart().subscribe({
      next:(res)=>{
        if(res.message == 'success'){
          this.productsCart = signal({} as ICart)
          this.totalItems.set(0)
          // this._CartService.cartNumber.next(0)
          this._CartService.cartNumber.set(0)
          this.displayBtn = true
        }
      }
    })
  }

  /*##################################### Hint Alert Before Clear Cart ##################################### */
  alertBeforeDelete(){
    Swal.fire({title: 'Are Your Sure Want To Remove?', position: 'center', showCancelButton:true, confirmButtonText: 'Yes, Delete it !', cancelButtonText: 'No, Keep It' ,icon: 'warning', }).then((result)=>{
      if(result.value){
        this.clearCart()
      }
    });
  }

  /*##################################### Unsubscrib ##################################### */
  ngOnDestroy(): void {
    this.allProductsCart?.unsubscribe()
  }

}
