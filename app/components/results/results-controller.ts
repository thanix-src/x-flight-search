import {SearchStore} from '../search/search-store';

export class ResultsController {

    searchResults: any; 
    searchStore: any;
    resultsStore: any;
    resultsIntercom: any; 

    static $inject = ['$scope', '$attrs', 'searchStore'];

    constructor($scope: any, $attrs: ng.IAttributes, searchStore: SearchStore) {
        this.searchResults = searchStore.searchResults; 
        console.log('this.searchResults:', this.searchResults, $scope); 
        //@TODO: plenty of scope for decoupling this -- could use event emitter.
        this.resultsStore = $scope.$parent.$ctrl.resultsStore;
        this.resultsIntercom = $scope.$parent.$ctrl.resultsIntercom;
        console.log('resultsIntercom:', this.resultsIntercom);
    }

    /**
     * @description update search results get called when search results are available. 
     */
    public updateSearchResults = () => {
        console.log('updae the search results');
    }

}