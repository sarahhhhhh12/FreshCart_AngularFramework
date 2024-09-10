import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { AuthService } from './auth.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly _HttpClient = inject(HttpClient)

  checkOutCart(cartId:string | null, data:object):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}/api/v1/orders/checkout-session/${cartId}?url=${environment.serverURL}`,
      {
        "shippingAddress": data
      }
    )
  }

  orderCash(cartId:string | null ,data:object):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}/api/v1/orders/${cartId}`,
      {
        "shippingAddress": data
      }
    )
  }

  allOrders(userId:string | null):Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}/api/v1/orders/user/${userId}`)
  }
}
