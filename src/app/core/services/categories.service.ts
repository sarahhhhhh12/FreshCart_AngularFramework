import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly _HttpClient = inject(HttpClient)

  getAllCategories():Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}/api/v1/categories`)
  }

  specificCategory(id:string | null):Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}/api/v1/categories/${id}`)
  }

  getSubCategory(id:string | null):Observable<any>{
    return this._HttpClient.get(`${environment.baseURL}/api/v1/categories/${id}/subcategories`)
  }
}
