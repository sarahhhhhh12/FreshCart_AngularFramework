import { Component, inject, OnDestroy, signal, WritableSignal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { ICategories } from '../../core/interfaces/icategories';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CarouselModule, RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnDestroy {
  /*##################################### Inject Servcies ##################################### */
  private readonly _CategoriesService = inject(CategoriesService)

  /*##################################### Global Properties ##################################### */
  allCategoriesSub!:Subscription
  allCategories:WritableSignal<ICategories[]> = signal([])

  /*##################################### Get All Categories ##################################### */
  ngOnInit(): void {
    this.allCategoriesSub = this._CategoriesService.getAllCategories().subscribe({
      next:(res)=>{
        this.allCategories.set(res.data)
      }
    })
  }

  customOptionsCategory: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoplay:true,
    autoplayTimeout:2000,
    autoplayHoverPause:true,
    dots: false,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 6
      }
    },
    nav: false
  }

  /*##################################### Unsubscrib ##################################### */
  ngOnDestroy(): void {
    this.allCategoriesSub?.unsubscribe()
  }
}
