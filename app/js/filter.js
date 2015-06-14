'use strict';

angular.module('matemonkey.filter', [])
.controller('FilterController', ['$scope', '$route', '$routeParams', '$http', 'FilterService', 'urlfor', function($scope, $route, $routeParams, $http, FilterService, urlfor) {
  $scope.productFilterOpen = false;
  $scope.productFilterModel = {};
  $scope.products = {};
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

  if ($routeParams.hasOwnProperty('products')) {
    var productsregex = /((\d*),?)*/;
    var result = $routeParams['products'].match(productsregex);
    if (result != null) {
      angular.forEach(result[0].split(','), function(value, key) {
        if (value !== "") {
          $scope.productFilterModel[value] = true;
        }
      });
      $scope.productFilterOpen = true;
    } else {
      $scope.productFilterModel = {};
      $scope.productFilterOpen = false;
    }
  } else {
    $scope.productFilterModel = {};
    $scope.productFilterOpen = false;
  }

  if ($routeParams.hasOwnProperty('types')) {
    var typesregex = /((retail|restaurant|bar|club|community|hackerspace|other),?)*/;
    var result = $routeParams['types'].match(typesregex);
    if (result != null) {
      angular.forEach(result[0].split(','), function(value, key) {
        if (value !== "") {
          $scope.typeFilterModel[value] = true;
        }
      });
    }
  } else {
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
  }

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

  $scope.$on('FilterChanged', function(event, f) {
    var pCount = 0;
    var products = "";
    var types = "";
    angular.forEach(f.product, function(value, key) {
      if (value == true) {
        pCount += 1;
        if (products.length == 0) {
          products = key;
        } else {
          products += "," + key;
        }
      }
    });
    if (pCount == 0) {
      products = null;
    }
    if (f.type.all == true) {
      types = null
    } else {
      types = ""
      angular.forEach(f.type, function(value, key) {
        if (value == true) {
          if (types.length == 0) {
            types = key;
          } else {
            types += "," + key;
          }
        }
      });
    }
    $route.updateParams({products: products, types: types});
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

