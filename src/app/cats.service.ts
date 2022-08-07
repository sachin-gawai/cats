import { Inject, Injectable, Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CatsService {

  constructor(public http:HttpClient,@Inject(Injector) private injector: Injector) 
  {   }
  
  private get toastrService(): ToastrService {
    return this.injector.get(ToastrService);
  }

  httpOptions = {
    headers: new HttpHeaders(
      {
        'Accept':'application/json', 
        'Content-Type': 'application/json',
        "x-api-key" : environment.token,
        "Access-Control-Allow-Origin":"*"
       }),
    withCredentials: true 
  };
  
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    //window.alert(errorMessage);
    return throwError(() => errorMessage);
  }

  getCats(filterData:any)
  {
    
    let url = environment.myCatlist+"?format=json&limit="+filterData.limit+"&page="+filterData.page+"&order=desc";
   return this.http.get(url,this.httpOptions).pipe(catchError(this.handleError));
  }


  getFavCats()
  {    
     let url = environment.favouritesCatList;
    
     return this.http.get(url,this.httpOptions).pipe(catchError(this.handleError));
  }

  FavIt(favData:any)
  {    
     let url = environment.favouritesCatList;
    return this.http.post(url,favData,this.httpOptions).pipe(catchError(this.handleError));
  }

  unFavIt(favId:any)
  {    
     let url = environment.favouritesCatList+"/"+favId;
    
     return this.http.delete(url,this.httpOptions).pipe(catchError(this.handleError));
  }

  getVotesIt()
  {
    let url = environment.voteIt;
    
     return this.http.get(url,this.httpOptions).pipe(catchError(this.handleError));
  }

  saveVotes(voteData:any)
  {
    let url = environment.voteIt;
    
    return this.http.post(url,voteData,this.httpOptions).pipe(catchError(this.handleError));
  }

  deleteVote(voteId:any)
  {
    let url = environment.voteIt+"/"+voteId;
    
    return this.http.delete(url,this.httpOptions).pipe(catchError(this.handleError));
  }


  addFiles(images: File) {
    let url = environment.upload;
    var arr:any = []
    var formData = new FormData();
    arr.push(images);
    arr[0].forEach((item:any, i:any) => {
      formData.append('file', arr[0][i]);
    })
    return this.http.post(url, formData, {
      headers: { "x-api-key" : environment.token},
      reportProgress: true,
      observe: 'events',      
    });
    // .pipe(
    //   catchError(this.errorMgmt)
    // )
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }    
    console.log(errorMessage);
    return throwError(() => errorMessage);
  }

  
}
