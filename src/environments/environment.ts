// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
    token:"b157dc97-b14b-4871-b245-271cbc68723c",
    baseUrl:"https://api.thecatapi.com/v1/",
    catList: "v1/images/search",
    favouritesCatList:"v1/favourites",
    voteIt:"v1/votes",
    upload:"v1/images/upload",
    myCatlist:"v1/images"    
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
