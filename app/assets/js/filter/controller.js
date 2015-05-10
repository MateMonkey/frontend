'use strict';

angular.module('matemonkey.filter', [])
.controller('FilterController', function($scope, $http, FilterService) {
  $scope.filterModel = {
    all: true,
    retail: true,
    restaurant: true,
    bar: true,
    club: true,
    hackerspace: true
  };
  $scope.$watchCollection('filterModel', function(newVal, oldVal) {
    if (oldVal.all == false && newVal.all == true) {
      $scope.filterModel.retail = true;
      $scope.filterModel.restaurant = true;
      $scope.filterModel.bar = true;
      $scope.filterModel.club = true;
      $scope.filterModel.hackerspace = true;
    }
    if (newVal.retail == false &&
        newVal.restaurant == false &&
        newVal.bar == false &&
        newVal.club == false &&
        newVal.hackerspace == false) {
      $scope.filterModel.all = true;
    }
    if (((newVal.retail |
        newVal.restaurant |
        newVal.bar |
        newVal.club |
        newVal.hackerspace) == true) && (
       (newVal.retail &
        newVal.restaurant &
        newVal.bar &
        newVal.club &
        newVal.hackerspace) == false)) {
      $scope.filterModel.all = false;
    }
    FilterService.set($scope.filterModel);
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

