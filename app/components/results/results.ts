import './results.scss';
import {BaseComponent} from "../../common/component";
import {ResultsController} from "./results-controller";

class Results extends BaseComponent {
    public scope = true;
    public controllerAs = '$ctrl';
    public controller = ResultsController;
    public template = require('./results.html');
}

angular
    .module('app')
    .directive('results', () => new Results());
