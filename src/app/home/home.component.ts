import { Component, OnInit } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { CatsService } from '../cats.service';
import { Filters } from '../filters';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public catService:CatsService,public toastr:ToastrService,private spinner: NgxSpinnerService) { }
  cats:any = [];
  limit:number = 25;
  page:number = 0;
  order:string = "desc";
  FiltersParam:Filters;
  noRecord:boolean = false;
  isPaginationOn = false;
  totalResult:any;
  ngOnInit(): void {

    this.list();
   
  }  

  list()
  {
    this.spinner.show();
   this.FiltersParam = new Filters(this.order,this.limit,this.page);
   const catlist = this.catService.getCats(this.FiltersParam);
   const favCatlist = this.catService.getFavCats();
   const voteList = this.catService.getVotesIt();
   forkJoin([catlist,favCatlist,voteList]).pipe(
    map((data: any) => {
      console.log("data",data);
      return data[0].map((catArr: any,index:number)=> {
        if(data[1].length > 0)
        {
         data[1].forEach((e:any) => {
         if(e.image_id == catArr.id)
          {
           data[0][index]["favId"] = e.id;   
          }
          
          }) 
        }
        data[0][index]["vote"] = [];
        if(data[2].length > 0)
        {
         data[2].forEach((e:any) => {
         if(e.image_id == catArr.id)
          {
            data[0][index]["vote"].push(e);
            data[0][index]["voteId"] = e.id; 
            data[0][index]["voteCount"] = data[0][index]["vote"].length;  
          }
          
          }) 
        }

       return catArr;
      })
      
    })).subscribe((Response)=>{
      this.spinner.hide();
      console.log("Response",Response);
      this.totalResult = Response;
      if(this.isPaginationOn)
      {
        this.cats.push(...Response);
      }
      else
      {
        this.cats = Response;
        if(this.cats.length == 0)
        {
           this.noRecord = true;
        }
      }
     
      
   });

   
  }


  favIt(id:any,index:number,isFav:any)
  {
      let favData = {
        "image_id": id,
        "sub_id": "myfav"
      };

      if(isFav)
      {
          this.catService.unFavIt(isFav).subscribe((Response)=>{
            this.cats[index]["favId"] = '';
            this.toastr.success('Unfavourite successfully', 'Success');
            });
      }
      else
      {
        this.catService.FavIt(favData).subscribe((Response:any)=>{
          this.cats[index]["favId"] = Response.id;
          console.log("Response",Response);
          this.toastr.success('Favourite successfully', 'Success');
        });
     }
  }

  voteIt(id:any,index:number,vote:any)
  {
    const catlist = this.catService.getVotesIt().subscribe((Response:any)=>{
      console.log("Response",Response);
    });;
  }

  saveVote(id:any,index:number,vote:any)
  {

    let voteData = {
      "image_id":id,
      "sub_id": "my-user-1234",
      "value":1
    };

   
          this.catService.saveVotes(voteData).subscribe((Response:any)=>{
            this.cats[index]["vote"].push(Response);
            this.cats[index]["voteId"] = Response.id;
            this.cats[index]["voteCount"] = this.cats[index]["vote"].length;
            console.log("Response",Response);
            this.toastr.success('Vote added successfully', 'Success');
          });
     
  }

  deleteVote(id:any,index:number,vote:any)
  {
    if(vote && vote.length > 0)
    {
      this.catService.deleteVote(vote[vote.length - 1].id).subscribe((Response)=>{
          this.cats[index]["vote"].pop();
          this.cats[index]["vote"] = this.cats[index]["vote"];
          this.cats[index]["voteCount"] = this.cats[index]["vote"].length;
          this.toastr.success('Vote remove successfully', 'Success');
                });
    }
  }

  trackByCatsId(index: number, cats: any) {  
    return cats.image_id;  
  } 

  loadMore()
  {
    this.isPaginationOn =true;
    this.page++;
    this.list();
     console.log(this.page);
  }

}
