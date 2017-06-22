import {SearchStore} from '../search/search-store';

export class ResultsController {

    searchResults: any; 
    searchStore: any;
    resultsStore: any; 

    static $inject = ['$scope', '$attrs', 'searchStore'];

    constructor($scope: any, $attrs: ng.IAttributes, searchStore: SearchStore) {
        this.searchResults = searchStore.searchResults; 
        console.log('this.searchResults:', this.searchResults); 
        this.resultsStore = $scope.$parent.$ctrl.resultsStore;
        console.log('resultsStore:', this.resultsStore);
    }

    /**
     * @description update search results get called when search results are available. 
     */
    public updateSearchResults = () => {
        console.log('updae the search results');
    }

}