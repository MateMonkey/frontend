'use strict';

angular.module('matemonkey.filter', [])
.controller('FilterController', ['$scope', '$http', 'FilterService', 'urlfor', function($scope, $http, FilterService, urlfor) {
  $scope.productFilterOpen = false;
  $scope.productFilterModel = {};
  $scope.typeFilterModel = {
    all: true,
    retail: false,
    restaurant: false,
    bar: false,
    club: false,
    community: false,
    hackerspace: false,
    other: false
  };

  $http.get(urlfor.get("products")).success(function(data) {
    $scope.products = data['products'];
  })

  $scope.$watchCollection('typeFilterModel', function(newVal, oldVal) {
    if (oldVal.all == false && newVal.all == true) {
      $scope.typeFilterModel.retail = false;
      $scope.typeFilterModel.restaurant = false;
      $scope.typeFilterModel.bar = false;
      $scope.typeFilterModel.club = false;
      $scope.typeFilterModel.community = false;
      $scope.typeFilterModel.other = false;
      $scope.typeFilterModel.hackerspace = false;
    }
    if ((newVal.retail == false &&
        newVal.restaurant == false &&
        newVal.bar == false &&
        newVal.club == false &&
        newVal.community == false &&
        newVal.other == false &&
        newVal.hackerspace == false) ||
       (newVal.retail == true &&
        newVal.restaurant == true &&
        newVal.bar == true &&
        newVal.club == true &&
        newVal.community == true &&
        newVal.other == true &&
        newVal.hackerspace == true)) {
      $scope.typeFilterModel.all = true;
      $scope.typeFilterModel.retail = false;
      $scope.typeFilterModel.restaurant = false;
      $scope.typeFilterModel.bar = false;
      $scope.typeFilterModel.club = false;
      $scope.typeFilterModel.community = false;
      $scope.typeFilterModel.other = false;
      $scope.typeFilterModel.hackerspace = false;
    }
    if (((newVal.retail |
        newVal.restaurant |
        newVal.bar |
        newVal.club |
        newVal.community |
        newVal.other |
        newVal.hackerspace) == true) && (
       (newVal.retail &
        newVal.restaurant &
        newVal.bar &
        newVal.club &
        newVal.community &
        newVal.other &
        newVal.hackerspace) == false)) {
      $scope.typeFilterModel.all = false;
    }
    FilterService.set({type: $scope.typeFilterModel, product: $scope.productFilterModel});
  });
  $scope.$watchCollection('productFilterModel', function(newVal, oldVal) {
    FilterService.set({type: $scope.typeFilterModel, product: $scope.productFilterModel});
  });

}])
.service('FilterService', ['$rootScope', function($rootScope) {
  var filterOptions = null;
  return {
    set : function(x) {
      filterOptions = x;
      $rootScope.$broadcast('FilterChanged', x);
    },
    get : function() {
      return filterOptions;
    }
  }
}]);

