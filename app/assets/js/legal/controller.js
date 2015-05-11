'use strict';

angular.module('matemonkey.legal',
               [
                 'ngRoute'
               ])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/legal', {
    templateUrl: 'js/legal/view.html',
    controller: 'LegalController'
  });
}])
.controller('LegalController', ['$scope', function($scope) {

}]);
