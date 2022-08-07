import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CatsService } from '../cats.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  fileArr = [];
  imgArr = [];
  fileObj = [];
  form: FormGroup;
  msg:any;
  progress: number = 0;
  constructor(
    public fb: FormBuilder,
    private sanitizer: DomSanitizer,
    public dragdropService: CatsService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.form = this.fb.group({
      file: [null]
    })
  }
  
  ngOnInit() { }

  upload(e:any) {
    const fileListAsArray = Array.from(e);
    fileListAsArray.forEach((item, i) => {
      const file:HTMLInputElement = (e as HTMLInputElement);
      const url = URL.createObjectURL(file[i]);
      this.imgArr.push(url);
      this.fileArr.push({ item, url: url });
    })
    this.fileArr.forEach((item) => {
      this.fileObj.push(item.item)
    })
    // Set files form control
    this.form.patchValue({
      file: this.fileObj
    })
    this.form.get('file').updateValueAndValidity()
    // Upload to server
    this.dragdropService.addFiles(this.form.value.file)
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event.total * 100);
            console.log(`Uploaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:
            console.log('File uploaded successfully!', event.body);
            this.toastr.success('File uploaded succssfully!','Success');
            setTimeout(() => {
              this.progress = 0;
              this.fileArr = [];
              this.fileObj = [];
              this.router.navigate(['/']);
            }, 1000);
        }
      },(error) =>{
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // Get client-side error
          errorMessage = error.error.message;
        } else {
          // Get server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }  
        this.progress = 0;
        this.fileArr = [];
        this.fileObj = [];

        this.toastr.error(errorMessage,'Error',{
          timeOut: 3000,
        }); 
        
      })
  }
  // Clean Url
  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  errorMgmt(error:any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }  
    this.toastr.error('Error', errorMessage,{
      timeOut: 3000,
    });  
    console.log(errorMessage);
    return throwError(() => errorMessage);
  }
  

}
