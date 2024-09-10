import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart.service';
import { IWishlist } from '../../core/interfaces/iwishlist';
import { CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-whishlist',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './whishlist.component.html',
  styleUrl: './whishlist.component.scss'
})
export class WhishlistComponent implements OnInit, OnDestroy {
  /*##################################### Inject Servcies ##################################### */
  private readonly _WishlistService = inject(WishlistService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _CartService = inject(CartService)

  /*##################################### Global Properties ##################################### */
  cartSub!:Subscription
  deleteSub!:Subscription
  // countWishList:number = 0
  countWishList:WritableSignal<number> = signal(0)
  wishList:WritableSignal<IWishlist[]> = signal([])
  allProductInWishlist!:Subscription

  /*##################################### Get All Product In WishList ##################################### */
  ngOnInit(): void {
    this.allProductInWishlist = this._WishlistService.getProductWishlist().subscribe({
      next:(res)=>{
        this.countWishList.set(res.count)
        this.wishList.set(res.data)
      }
    })
  }

  /*##################################### Add Product In Cart ##################################### */
  addToCart(productId:string):void{
    this.cartSub = this._CartService.addProductCart(productId).subscribe({
      next:(res)=>{
        if(res.status == 'success'){
          console.log(res);
          this.deleteAfterAdd(productId)
          this._ToastrService.success(res.message)
          // this._CartService.cartNumber.next(res.numOfCartItems)
          this._CartService.cartNumber.set(res.numOfCartItems)
        }
      }
    })
  }

  /*##################################### Delete Product When Add In Cart Without Toastr ##################################### */
  deleteAfterAdd(id:string):void{
    this.deleteSub = this._WishlistService.removeProductWishlist(id).subscribe({
      next:(res)=>{
        if(res.status == 'success'){
          this.allProductInWishlist = this._WishlistService.getProductWishlist().subscribe({
            next:(res)=>{
              this.wishList.set(res.data)
              this.countWishList.set(res.count)
              this._WishlistService.countWishItems.set(res.count)
            }
          })
        }
      }
    })
  }

  /*##################################### Delete Product In WishList ##################################### */
  deletewishlistItem(id:string):void{
    this.deleteSub = this._WishlistService.removeProductWishlist(id).subscribe({
      next:(res)=>{
        if(res.status == 'success'){
          this._ToastrService.error('Deleted !')
          this.allProductInWishlist = this._WishlistService.getProductWishlist().subscribe({
            next:(res)=>{
              this.wishList.set(res.data)
              this.countWishList.set(res.count)
              this._WishlistService.countWishItems.set(res.count)
            }
          })
        }
      }
    })
  }

  /*##################################### Unsubscrib ##################################### */
  ngOnDestroy(): void {
    this.allProductInWishlist?.unsubscribe()
    this.cartSub?.unsubscribe()
    this.deleteSub?.unsubscribe()
  }
}
