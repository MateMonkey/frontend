'use strict';

angular.module('matemonkey.about',
               [
                 'ngRoute'
               ])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/about/', {
    templateUrl: 'js/about/view.html',
    controller: 'AboutController'
  });
}])
.controller('AboutController', ['$scope', function($scope) {

}]);


