'use strict';

angular.module('matemonkey.about',
               [
                 'ngRoute'
               ])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/about', {
    templateUrl: 'templates/about/view.html',
    controller: 'AboutController'
  });
}])
.controller('AboutController', ['$scope', '$rootScope', function($scope, $rootScope) {
  $rootScope.title = "About";
  $rootScope.pageDescription = "About MateMonkey.com, a service to find mate dealers in your area.";
}]);
