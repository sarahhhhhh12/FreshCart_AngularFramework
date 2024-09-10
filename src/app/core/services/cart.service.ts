import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService{

  private readonly _HttpClient = inject(HttpClient)

  // cartNumber: BehaviorSubject<number> = new BehaviorSubject(0)
  cartNumber:WritableSignal<number> = signal(0)


  addProductCart(productId:string):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}/api/v1/cart`,
      {
        "productId": productId
      }
    )
  }

  displayCart():Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}/api/v1/cart`)
  }

  updateCartQuabtity(id:string, count:number):Observable<any>{
    return this._HttpClient.put(`${environment.baseURL}/api/v1/cart/${id}`,
      {
        'count' : count
      }
    )
  }

  removeSpecificItem(id:string):Observable<any>{
    return this._HttpClient.delete(`${environment.baseURL}/api/v1/cart/${id}`)
  }

  clearAllProducrCart():Observable<any>{
    return this._HttpClient.delete(`${environment.baseURL}/api/v1/cart`)
  }

}
