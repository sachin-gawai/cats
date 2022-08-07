import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavouritesComponent } from './favourites/favourites.component';
import { HomeComponent } from './home/home.component';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch:'full',
  },
  {
    path: 'favourites',
    component: FavouritesComponent,
    pathMatch:'full',
  },
  {
    path: 'uploads',
    component: UploadComponent,
    pathMatch:'full',
  },
  {
    path: '**',
    redirectTo: '',    
  }  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
