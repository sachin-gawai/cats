export class Filters {
    order:string;
    limit:number;
    page:number;

    constructor( order:string,limit:number,page:number){
        this.order = order;
        this.limit = limit;
        this.page = page;
    }
}
