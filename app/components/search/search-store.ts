export class SearchStore {

    searchResults: any[] = []; 

    constructor() {
        return this; 
    }

}

angular.module('app.services').factory('searchStore', SearchStore); 