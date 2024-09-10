import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoriesService } from '../../core/services/categories.service';
import { Subscription } from 'rxjs';
import { ISubCategory } from '../../core/interfaces/isub-category';

@Component({
  selector: 'app-sub-category',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sub-category.component.html',
  styleUrl: './sub-category.component.scss'
})
export class SubCategoryComponent implements OnInit, OnDestroy {
  /*##################################### Inject Servcies ##################################### */
  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _CategoriesService = inject(CategoriesService)

  /*##################################### Global Properties ##################################### */
  subCateSub!:Subscription
  allSubCategory:WritableSignal<ISubCategory[]> = signal([])
  categoryName:WritableSignal<string | null> = signal(null)
  msgUndefind:WritableSignal<string> = signal('')

  /*##################################### Get All SubCategories ##################################### */
  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next:(params)=>{
        let categoryID:string | null = params.get('id')
        this.categoryName.set( params.get('name') )
        this.subCateSub = this._CategoriesService.getSubCategory(categoryID).subscribe({
          next:(res)=>{
          if(res.data.length > 0){
            this.allSubCategory.set(res.data)
          } else{
            this.msgUndefind.set('Sorry, There is no subcategories for this Category')
          }
          }
        })
      }
    })
  }

  /*##################################### Unsubscrib ##################################### */
  ngOnDestroy(): void {
    this.subCateSub?.unsubscribe()
  }
}
