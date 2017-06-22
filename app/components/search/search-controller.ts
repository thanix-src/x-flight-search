import {SearchService} from './search-service';
import {SearchStore} from './search-store';
import * as _ from 'lodash';

interface searchTerms {
    origin: string,
    destination: string,
    departureDate: string,
    returnDate:  string,
    numAdult: number,
    numChild: number,
    numInfant: number
};

interface travelSegment {
    flight: string, 
    leg: travelLeg[]
};

interface travelLeg {
    origin: string,
    destination: string,
    duration: string,
    connectionDuration: string
};

interface searchResult {
    saleTotal: string,
    durationTotal: string, 
    segments: travelSegment[]
};

export class SearchController {

    resultsStore: any; //is an object that holds the result for child access 
    searchInput: searchTerms;
    searchService: SearchService; 
    searchStore: SearchStore; 
    searchResults: searchResult[]; 
    tripData: any; 

    static $inject = ['$scope', '$attrs', 'searchService', 'searchStore'];

    constructor($scope: ng.IScope, $attrs: ng.IAttributes, searchService: SearchService, searchStore: SearchStore) {
        this.searchService = searchService; 
        this.searchStore = searchStore; 
        this._initSearchInput();
        this.resultsStore = {
            searchResults: []
        };
    }

    /**
     * @description initialize input search terms
     */
    private _initSearchInput = () => {
        this.searchInput = <searchTerms> {
            origin: 'YYZ',
            destination: 'MAA',
            departureDate: '2017-10-01', 
            returnDate: '2017-12-01', 
            numAdult: 1,
            numChild: 0, 
            numInfant: 0
        };
    }

    /**
     * @description search for flights when users hits the search button
     */
    public searchFlights = () => {
        console.log('searching for flights with:', this.searchInput);
        let req = {
                "request": {
                    "slice": [
                    {
                        "origin": "YYZ",
                        "destination": "NYC",
                        "date": "2017-08-31"
                    }
                    ],
                    "passengers": {
                        "adultCount": 1,
                        "infantInLapCount": 0,
                        "infantInSeatCount": 0,
                        "childCount": 0,
                        "seniorCount": 0
                    },
                    "solutions": 20,
                    "refundable": false
                }
        };
        console.log('this.searchService:', this.searchService);
        this.searchService.searchRequest(req).then( (resp: any) => {
            console.log('response is:', resp, resp.data);
            this.searchResults = this.prepareSearchResults(resp.data);
            console.log('Final Search Result is:', this.searchResults);
            this.searchStore.searchResults = this.searchResults; 
            this.resultsStore.searchResults = this.searchResults; 
        }).catch( (resp: any) => {
            if (_.has(resp, 'data.error.code')) {
                console.log('Received error code: ', resp.data.error.code);
            } 
            if (_.has(resp, 'data.error.message')) {
                console.log('Error fetching response: ', resp.data.error.message);
            } else {
                console.log('Unknown error fetching response:', resp); 
            }
        });
    }

    /**
     * @description prepare search result for display
     */
    public prepareSearchResults = (data: any) => {
        let results = [];
        this.tripData = data.trips.data;
        if (_.has(data, 'trips.tripOption')) {
            _.forEach(data.trips.tripOption, (tripOption) => {
                let result = <searchResult>{};
                result.saleTotal = tripOption.saleTotal; 
                result.durationTotal = tripOption.slice[0].duration; 
                console.log('tripOption saleTotal --', result.saleTotal);
                result.segments = this.prepareTravelSegment(tripOption);
                results.push(result); 
            });  
        }
        return results;
    }

    /**
     * @description prepare travel segment data
     */
    public prepareTravelSegment = (data: any) => {
        let segments = [];
        if (_.has(data, 'slice[0].segment')) {
            //NOTE: considering only first slice for display, further slices TBD
            _.forEach(data.slice[0].segment, (segment: any) => {
                let tSegment = <travelSegment>{};
                tSegment.flight = this.getCarrierName(segment.flight);
                tSegment.leg = this.prepareTravelLeg(segment); 
                segments.push(tSegment); 
            });
        }
        return segments; 
    }

    /**
     * @description prepare travel leg for display
     */
    public prepareTravelLeg = (data: any): travelLeg[] => {
        let legs = [];
        if (_.has(data, 'leg')) {
            _.forEach(data.leg, (leg: any) => {
                let tLeg = <travelLeg>{};
                tLeg.origin = leg.origin; 
                tLeg.destination = leg.destination; 
                tLeg.duration = leg.duration; 
                tLeg.connectionDuration = leg.connectionDuration ? leg.connectionDuration : 0; 
                legs.push(tLeg); 
            });
        }
        return legs; 
    }

    /**
     * @description get flight name/carrier info
     */
    public getCarrierName = (flight: any): string => {
        let flightArr = _.filter(this.tripData.carrier, (o: any) => {
            return o.code === flight.carrier; 
        });
        return flightArr[0].name;
    }

}

angular.module('app.controllers').controller('searchCtrl', SearchController);
