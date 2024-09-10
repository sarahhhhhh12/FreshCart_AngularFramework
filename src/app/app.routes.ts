import { Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProductsComponent } from './components/products/products.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { logedGuard } from './core/guards/loged.guard';
import { AuthComponent } from './layouts/auth/auth.component';
import { BlankComponent } from './layouts/blank/blank.component';

export const routes: Routes = [
  {path:'',component:AuthComponent,canActivate:[logedGuard] ,title:"Login",children:[
    {path:'', redirectTo:'login', pathMatch:'full'},
    {path:"login", component:LoginComponent, title:'Login'},
    {path:"register", component:RegisterComponent, title:'Register'},
    {path:"forget", loadComponent:()=>import('./components/forget/forget.component').then((c)=> c.ForgetComponent), title:'Forget Password'}
  ]},

  {path:'',component:BlankComponent,canActivate:[authGuard] , title: 'home',children:[
    {path: 'home', component:HomeComponent,title:'Home'},
    {path: 'cart', component:CartComponent,title:'Cart'},
    {path: 'products', component:ProductsComponent,title:'Products'},
    {path: 'categories', component:CategoriesComponent ,title:'Categories'},
    {path: 'wishlist', loadComponent:()=>import('./components/whishlist/whishlist.component').then((c)=> c.WhishlistComponent),title:'whish Lsit'},
    {path: 'brands', loadComponent: ()=>import('./components/brands/brands.component').then((c)=> c.BrandsComponent),title:'Brands'},
    {path: 'details/:id', loadComponent:()=> import('./components/details/details.component').then((c)=> c.DetailsComponent),title:'Details'},
    {path: 'orders/:id', loadComponent: ()=>import('./components/orders/orders.component').then((c)=> c.OrdersComponent),title:'Check Out'},
    {path: 'allorders', loadComponent: ()=>import('./components/allorders/allorders.component').then((c)=> c.AllordersComponent),title:'All Orders'},
    {path: 'subCategory/:id/:name', loadComponent: ()=>import('./components/sub-category/sub-category.component').then((c)=> c.SubCategoryComponent), title:'Spacific Category'}
  ]},

  {path:'**', loadComponent: ()=>import('./components/notfound/notfound.component').then((c)=> c.NotfoundComponent), title:'Not Found'}
];
