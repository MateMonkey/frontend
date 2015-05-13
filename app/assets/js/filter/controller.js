'use strict';

angular.module('matemonkey.filter', [])
.controller('FilterController', function($scope, $http, FilterService, urlfor) {
  $scope.productFilterOpen = false;
  $scope.productFilterModel = {};
  $scope.typeFilterModel = {
    all: true,
    retail: true,
    restaurant: true,
    bar: true,
    club: true,
    community: true,
    hackerspace: true,
    other: true
  };

  $http.get(urlfor.get("products")).success(function(data) {
    $scope.products = data['products'];
  })

  $scope.$watchCollection('typeFilterModel', function(newVal, oldVal) {
    if (oldVal.all == false && newVal.all == true) {
      $scope.typeFilterModel.retail = true;
      $scope.typeFilterModel.restaurant = true;
      $scope.typeFilterModel.bar = true;
      $scope.typeFilterModel.club = true;
      $scope.typeFilterModel.community = true;
      $scope.typeFilterModel.other = true;
      $scope.typeFilterModel.hackerspace = true;
    }
    if (newVal.retail == false &&
        newVal.restaurant == false &&
        newVal.bar == false &&
        newVal.club == false &&
        newVal.community == false &&
        newVal.other == false &&
        newVal.hackerspace == false) {
      $scope.typeFilterModel.all = true;
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

})
.service('FilterService', function($rootScope) {
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
});

