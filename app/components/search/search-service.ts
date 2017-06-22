import {HttpService} from "../../common/service";

export class SearchService extends HttpService {

    //@TODO: this better come from a config
    public apiKey: string = 'AIzaSyCtd5a1B_LTTsGVDdUYdj2aNpG244ZzkGk';
    public url: string = 'https://www.googleapis.com/qpxExpress/v1/trips/search';

    public searchRequest(reqBody: any): ng.IPromise<any> {
        let apiUrl = this.url + '?key=' + this.apiKey;
        return this.post(apiUrl, reqBody);
    }

}

angular.module('app.services').service('searchService', SearchService);
