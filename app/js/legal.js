'use strict';

angular.module('matemonkey.legal',
               [
                 'ngRoute'
               ])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/legal', {
    templateUrl: 'templates/legal/view.html',
    controller: 'LegalController'
  });
}])
.controller('LegalController', ['$scope', '$rootScope', function($scope, $rootScope) {
  $rootScope.title = "Legal/Imprint";
  $rootScope.pageDescription = "Legal information for MateMonkey.com, a service to look up the current stock and prices of mate drinks in your area.";
}]);
