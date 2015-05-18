'use strict';

angular.module('matemonkey.navbar',
               [
                 'ui.bootstrap'
               ])
.controller('NavBarController', ['$scope', '$http', '$rootScope', '$location', 'urlfor', 'MapService', 'DealerService', NavBarController]);

function NavBarController($scope, $http, $rootScope, $location, urlfor, MapService, DealerService) {
  $scope.isCollapsed = true;
  $scope.isMap = false;
  $scope.query = "";
  $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
    var mapRoute = '/map'
    if ($location.path().substring(0, mapRoute.length) === mapRoute) {
      $scope.isMap = true;
    } else {
      $scope.isMap = false;
    }
  });

  $scope.addDealer = function() {
    DealerService.add();
  }

  $scope.searchLocation = function() {
    $http({
      method: "GET",
      url: urlfor.get("search"),
      params: {
        query: $scope.query
      }
    }).success(function(data) {
      MapService.focus(data)
    });
  }

};
