import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { OrdersService } from '../../core/services/orders.service';
import { AuthService } from '../../core/services/auth.service';
import { IOrders } from '../../core/interfaces/iorders';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-allorders',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss'
})
export class AllordersComponent implements OnInit , OnDestroy {
  /*##################################### Inject Servcies ##################################### */
  private readonly _OrdersService = inject(OrdersService)
  private readonly _AuthService = inject(AuthService)

  /*##################################### Global Properties ##################################### */
  allOrdersSub!:Subscription
  userData!:any
  allUserOrders:WritableSignal<IOrders[]> = signal([])

  /*##################################### Get All Orders From User ##################################### */
  ngOnInit(): void {
    this._AuthService.saveUserData()
    this.userData = this._AuthService.userData

    this.allOrdersSub = this._OrdersService.allOrders(this.userData.id).subscribe({
      next:(res)=>{
        this.allUserOrders.set(res)
      }
    })
  }

  /*##################################### Unsubscrib ##################################### */
  ngOnDestroy(): void {
    this.allOrdersSub?.unsubscribe()
  }
}
