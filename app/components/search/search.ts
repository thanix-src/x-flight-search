import './search.scss';
import {BaseComponent} from "../../common/component";
import {SearchController} from './search-controller';

class Search extends BaseComponent {
    public scope = true;
    public controllerAs = '$ctrl';
    public controller = SearchController;
    public template = require('./search.html');
}

angular
    .module('app')
    .directive('search', () => new Search());
