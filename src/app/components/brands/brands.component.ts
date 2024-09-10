import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { BrandsService } from '../../core/services/brands.service';
import { IBrands } from '../../core/interfaces/ibrands';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ISpaceifiBrand } from '../../core/interfaces/ispaceifi-brand';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit, OnDestroy {
  /*##################################### Inject Servcies ##################################### */
  private readonly _BrandsService = inject(BrandsService)

  /*##################################### Global Properties ##################################### */
  allBrandsSub!:Subscription
  spacificBrandSub!:Subscription
  allBrands:WritableSignal<IBrands[]> = signal([])
  getSpacificBrand:WritableSignal<ISpaceifiBrand> = signal({} as ISpaceifiBrand)

  /*##################################### Get All Brands ##################################### */
  ngOnInit(): void {
    this.allBrandsSub = this._BrandsService.getAllBrands().subscribe({
      next:(res)=>{
        this.allBrands.set(res.data)
      }
    })
  }

  /*##################################### Get SpacificBrands ##################################### */
  spacificBrand(id:string):void{
    this.spacificBrandSub = this._BrandsService.getSpecificBrand(id).subscribe({
      next:(res)=>{
        this.getSpacificBrand.set(res.data)
      }
    })
  }

  /*##################################### Unsubscrib ##################################### */
  ngOnDestroy(): void {
    this.allBrandsSub?.unsubscribe()
  }

}
