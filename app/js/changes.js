'use strict';

angular.module('matemonkey.changes',
               [
                 'infinite-scroll',
                 'ngRoute'
               ])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/changes', {
    templateUrl: 'templates/changes/view.html',
    controller: 'ChangesController'
  });
}])
.controller('ChangesController', ['$scope', '$rootScope', '$http', 'urlfor', function($scope, $rootScope, $http, urlfor) {
  $scope.changes = []
  $scope.isBusy = false;
  $scope.isEnd = false;
  $scope.page = 1;

  $rootScope.title = "Recent Changes";
  $rootScope.pageDescription = "The latest changes on MateMonkey.com, a service to look up the current stock and prices of mate drinks in your area.";

  $scope.loadMore = function() {
    if ($scope.isEnd) return;
    if ($scope.isBusy) return;

    $scope.isBusy = true;
    $http({
      url: urlfor.get("changes"),
      method: "GET",
      params: {
        per_page: 50,
        page: $scope.page
      }
    }).success(function(data) {
      $scope.isBusy = false;
      $scope.page += 1;
      for (var i =0; i < data.count; i++) {
        $scope.changes.push(data.changes[i])
      }
    }).error(function(data) {
      $scope.isBusy = false;
    });
  }
}]);

