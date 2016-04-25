'use strict';

angular.module('matemonkey.links',
               [
                 'ngRoute'
               ])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/links', {
    templateUrl: 'templates/links/view.html',
    controller: 'LinksController'
  });
}])
.controller('LinksController', ['$scope', '$rootScope', function($scope, $rootScope) {
  $rootScope.title = "Links";
  $rootScope.pageDescription = "Links into the Mate Universe";
}]);
