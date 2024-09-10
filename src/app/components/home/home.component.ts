import { Component, computed, ElementRef, inject, OnDestroy, OnInit, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { IProduct } from '../../core/interfaces/iproduct';
import { CurrencyPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../core/services/categories.service';
import { ICategories } from '../../core/interfaces/icategories';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist.service';
import { SearchPipe } from '../../core/pipes/search.pipe';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HeartDirective } from '../../core/directive/heart.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CurrencyPipe,RouterLink,CarouselModule, SearchPipe,FormsModule, HeartDirective, NgClass],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit , OnDestroy {
  /*##################################### Inject Servcies ##################################### */
  private readonly _ProductsService = inject(ProductsService)
  private readonly _CategoriesService = inject(CategoriesService)
  private readonly _CartService = inject(CartService)
  private readonly _WishlistService = inject(WishlistService)
  private readonly _ToastrService = inject(ToastrService)

  /*##################################### Global Properties ##################################### */
  allProducts:WritableSignal<IProduct[]> = signal([])
  allCategories:WritableSignal<ICategories[]> = signal([])
  getAllProductSub!:Subscription
  getALlCategoriesSub!:Subscription
  dataSearch:WritableSignal<string> = signal('')
  wishListIds:Signal<string[]> = computed(()=> this._WishlistService.wishListId())

  /*##################################### Get All Product And Categories ##################################### */
  ngOnInit(): void {
    this.getAllProductSub = this._ProductsService.getAllProducts().subscribe({
      next:(res)=>{
        this.allProducts.set(res.data)
      }
    })

    this.getALlCategoriesSub = this._CategoriesService.getAllCategories().subscribe({
      next:(res)=>{
        this.allCategories.set(res.data)
      }
    })

    this._WishlistService.getProductWishlist().subscribe({
      next:(res)=>{
        this._WishlistService.wishListId.set(res.data.map((item:any)=> item._id ))
      }
    })

  }

  /*##################################### Slider Options Categories ##################################### */
  customOptionsCategory: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoplay:true,
    autoplayTimeout:2000,
    autoplayHoverPause:true,
    dots: false,
    navText:['',''],
    navSpeed: 700,
    responsive: {
      0: {
        items: 2
      },
      400: {
        items: 3
      },
      740: {
        items: 4
      },
      940: {
        items: 6
      }
    },
    nav: true
  }

  customMainCategory: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoplay:true,
    autoplayTimeout:1500,
    autoplayHoverPause:true,
    dots: false,
    navSpeed: 700,
    items: 1,
    nav: false
  }

  /*##################################### Add Products To Cart ##################################### */
  addCart(productId:string):void{
    this._CartService.addProductCart(productId).subscribe({
      next:(res)=>{
        if(res.status == "success"){
          this._ToastrService.success(res.message)
          // this._CartService.cartNumber.next(res.numOfCartItems)
          this._CartService.cartNumber.set(res.numOfCartItems)
        }
      }
    })
  }

  /*##################################### Add Products To WishList ##################################### */
  addWishList(productId:string):void{
    this._WishlistService.addProductToWishlist(productId).subscribe({
      next:(res)=>{
        console.log(res.data.length);

        if(res.status == 'success'){
          this._ToastrService.success(res.message)
          this._WishlistService.wishListId.set(res.data)
          this._WishlistService.countWishItems.set(res.data.length)
        }
      }
    })
  }

  /*##################################### Delete Product In WishList ##################################### */
  deletewishlistItem(productId:string):void{
    this._WishlistService.removeProductWishlist(productId).subscribe({
      next:(res)=>{
        if(res.status == 'success'){
          this._ToastrService.error('Deleted !')
          this._WishlistService.wishListId.set(res.data)
          this._WishlistService.countWishItems.set(res.data.length)
        }
      }
    })
  }

  /*##################################### Unsubscrib ##################################### */
  ngOnDestroy(): void {
    this.getAllProductSub?.unsubscribe()
    this.getALlCategoriesSub?.unsubscribe()
  }
}
