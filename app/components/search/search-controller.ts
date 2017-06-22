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
    resultsIntercom: any;
    searchInput: searchTerms;
    searchService: SearchService; 
    searchStore: SearchStore; 
    searchResults: searchResult[]; 
    tripData: any; 
    passengerCountArr: number[];

    static $inject = ['$scope', '$attrs', 'searchService', 'searchStore'];

    constructor($scope: ng.IScope, $attrs: ng.IAttributes, searchService: SearchService, searchStore: SearchStore) {
        this.searchService = searchService; 
        this.searchStore = searchStore; 
        this._initSearchInput();
        this.resultsIntercom = {
            searchResults: [],
            loadingResults: false
        };
        this.passengerCountArr = _.range(10); 
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
     * @description initialize request object
     */
    private _initSearchRequestObj = () => {
        //default request object, assumes some default values
        return {
                "request": {
                    "slice": [
                    {
                        "origin": "",
                        "destination": "",
                        "date": ""
                    }
                    ],
                    "passengers": {
                        "adultCount": 0,
                        "infantInLapCount": 0,
                        "infantInSeatCount": 0,
                        "childCount": 0,
                        "seniorCount": 0
                    },
                    "solutions": 10,
                    "refundable": false
                }
        };
    }

    /**
     * @description search for flights when users hits the search button
     */
    public searchFlights = () => {
        console.log('searching for flights with:', this.searchInput);
        let req = this._initSearchRequestObj();
        let slice = req.request.slice[0]; 
        slice.origin = this.searchInput.origin; 
        slice.destination = this.searchInput.destination; 
        slice.date = this.searchInput.departureDate; 
        let passengers = req.request.passengers; 
        passengers.adultCount = this.searchInput.numAdult; 
        passengers.childCount = this.searchInput.numChild;
        this.resultsIntercom.loadingResults = true; 
        this.searchService.searchRequest(req).then( (resp: any) => {
            this.searchResults = this.prepareSearchResults(resp.data);
            console.log('Final Search Result is:', this.searchResults);
            this.resultsIntercom.loadingResults = false; 
            this.resultsIntercom.searchResults = this.searchResults; 
        }).catch( (resp: any) => {
            this.resultsIntercom.loadingResults = false; 
            if (_.has(resp, 'data.error.code')) {
                console.log('Received error code: ', resp.data.error.code);
            } 
            if (_.has(resp, 'data.error.message')) {
                //@TODO: ideally should be shown to the user
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
