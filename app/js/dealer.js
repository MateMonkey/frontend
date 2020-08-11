'use strict';

angular.module('matemonkey.dealer',["ngSanitize", "relativeDate", "ui.bootstrap", "dialogs.main", "isoCurrency", "leaflet-directive"])
  .controller('DealerController', ['$scope', '$rootScope', '$http', '$route', '$location', 'DealerService', 'dialogs', 'urlfor', 'iso4217',
                                   function($scope, $rootScope, $http, $route, $location, DealerService, dialogs, urlfor, iso4217) {
  $scope.showDiscontinued = {
    value: false
  };

  $scope.reloadStock = function() {
    $http({
      method: "GET",
      url: urlfor.get("stock", $scope.dealer.id),
      params: {
        current: true
      }
    }).success(function(data) {
      $scope.stock = data['entries'];
      var showDiscontinued = true;
      angular.forEach($scope.stock, function(entry, key) {
        if (entry.status !== 'discontinued') {
          showDiscontinued = false;
        }
      });
      $scope.showDiscontinued.value = showDiscontinued;
    }).error(function(data) {
      $scope.stock = {};
    });
  };

  $scope.setDealer = function(d) {
    $scope.dealer = d;
    $scope.dealer.currencyCode = "EUR";
    /* Hack for isoCurrency */
    var currencies = iso4217.getCurrencies();
    for (const key in currencies) {
      if (currencies[key].symbol === $scope.dealer.currency) {
        $scope.dealer.currencyCode = key;
        break;
      }
    }
    /* Hack to prevent angular from reloading the page */
    $route.current.pathParams['dealer_slug'] = d.slug;
    $location.path('/map/dealer/'+d.slug);
    $scope.reloadStock();
    $rootScope.title = d.name + " | " + d.address.city;
    $rootScope.pageDescription = "Look up the current stock and prices of mate drinks on MateMonkey.com for " +
      d.name + ", " + d.address.street + " " + d.address.number + " in " +
      d.address.city;
  };

  $scope.$on('DealerSelected', function(event, d) {
    $scope.setDealer(d);
  });


  $scope.updateStock = function(dealer, stock) {
    var data = null;
    if ((typeof stock.price == "undefined")) {
      data = {
        status: stock.status,
        product: stock.product,
        quantity: stock.quantity
      };
    } else {
      data = {
        status: stock.status,
        product: stock.product,
        price: parseFloat(stock.price)*100,
        quantity: stock.quantity,
        special: stock.special
      };
    }
    $http({
      url: urlfor.get("stock", dealer.id),
      method: "POST",
      data: data
    }).success(function(data) {
      $scope.reloadStock();
    });
  };

  $scope.updateDealer = function(dealer) {
    $http({
      url: urlfor.get("updateDealer", dealer.id),
      method: "PUT",
      data: dealer
    }).success(function(data) {
      $scope.setDealer(data);
      DealerService.update(data);
    });
  };

  $scope.createDealer = function(dealer) {
    $http({
      url: urlfor.get("dealers"),
      method: "POST",
      data: dealer
    }).success(function(data) {
      $scope.setDealer(data);
      DealerService.create(data);
    });
  };

  $scope.showUpdateStock = function() {
    var dlg = dialogs.create('templates/dealer/update_stock.html', 'UpdateStockController', $scope.dealer, 'lg');
    dlg.result.then(function(data){
      if (data.save == true) {
        $scope.updateStock(data.dealer, data.stock);
      }
    });
  };

  $scope.showEditDealer = function() {
    var dlg = dialogs.create('templates/dealer/edit_dealer.html', 'EditDealerController', angular.copy($scope.dealer), 'lg');
    dlg.result.then(function(data) {
      if (data.save == true) {
        $scope.updateDealer(data.dealer);
      }
    });
  };

  $scope.showLocationSetter = function() {
    var dlg = dialogs.create('templates/dealer/change_location.html', 'ChangeLocationController', angular.copy($scope.dealer), 'lg');
    dlg.result.then(function(data) {
      if (data.save == true) {
        $scope.updateDealer(data.dealer);
      }
    });
  };

  $scope.createNewDealer = function() {
    var dlg = dialogs.create('templates/dealer/edit_dealer.html', 'EditDealerController', null, 'lg');
    dlg.result.then(function(data) {
      if (data.save == true) {
        $scope.createDealer(data.dealer);
      }
    });
  };

  $scope.$on('DealerAddRequest', function (event) {
    $scope.createNewDealer();
  });
}])
.controller('EditDealerController', ['$scope', '$http', '$modalInstance', 'data', 'urlfor',
            function($scope, $http, $modalInstance, data, urlfor){
  $scope.typeOptions = [
    {
      displayText: "Retail",
      value: "retail"
    },
    {
      displayText: "Club",
      value: "club"
    },
    {
      displayText: "Bar/Café",
      value: "bar"
    },
    {
      displayText: "Restaurant",
      value: "restaurant"
    },
    {
      displayText: "Hackerspace",
      value: "hackerspace"
    },
    {
      displayText: "Community",
      value: "community"
    },
    {
      displayText: "Other",
      value: "other"
    }
  ];

  if (data == null) {
    $scope.dealer = {};
    $scope.title = "Create new dealer";
  } else {
    $scope.dealer = data;
    $scope.title = "Update " + $scope.dealer.name;
  }
  $scope.save = function() {
    $modalInstance.close({save: true , dealer: $scope.dealer});
  };
  $scope.cancel = function(){
    $modalInstance.close({save: false, dealer: null});
  };

}])
.controller('UpdateStockController',['$scope', '$http', '$modalInstance', 'data', 'urlfor',
            function($scope, $http, $modalInstance, data, urlfor) {
  $scope.statusOptions = [
    {
      displayText: "Discontinued",
      value: "discontinued"
    },
    {
      displayText: "Full",
      value: "full"
    },
    {
      displayText: "Low",
      value: "low"
    },
    {
      displayText: "Sold-Out",
      value: "sold-out"
    },
    {
      displayText: "Unknown",
      value: "unknown"
    }
  ];
  $scope.quantityOptions = [
    {
      displayText: "Crate",
      value: "crate"
    },
    {
      displayText: "Piece",
      value: "piece"
    },
    {
      displayText: "kg",
      value: "kg"
    }
  ];

  $http.get(urlfor.get("products")).success(function(data) {
    $scope.products = data['products'];
  });
  $scope.dealer = data;
  $scope.stock = {};

  $scope.save = function() {
    $modalInstance.close({save: true , dealer: $scope.dealer, stock: $scope.stock});
  };
  $scope.cancel = function(){
    $modalInstance.close({save: false, dealer: null, stock: null});
  };
}])
.controller('ChangeLocationController', ['$scope', '$http', '$modalInstance', 'data', 'urlfor',
            function($scope, $http, $modalInstance, data, urlfor) {
  $scope.dealer = data;
  $scope.title = "Change Position of " + $scope.dealer.name;

  angular.extend($scope, {
    layers: {
      baselayers: {
          osm: {
            name: 'OSM',
            type: 'xyz',
            url: 'https:///tiles{s}.freifunk-jena.de/{z}/{x}/{y}.png',
            layerParams: {
              noWrap: true,
              subdomains: '01234',
              attribution: "© <a href=\"http://www.openstreetmap.org/copyright\" target=\"_blank\">OpenStreetMap</a> contributors | Tiles Courtesy of <a href=\"https://github.com/egon0\" target=\"_blank\">egon0</a>",
              prefix: false
            }
          }
      }
    },
    center: {
      lat: angular.copy($scope.dealer.address.lat),
      lng: angular.copy($scope.dealer.address.lon),
      zoom: 18
    },
    markers: {
      dealer: {
        lat: $scope.dealer.address.lat,
        lng: $scope.dealer.address.lon,
        draggable: true
      }
    },
    defaults: {
      zoomControlPosition: 'topright',
      controls: {
        layers: {
          visible: false
        }
      }
    }
  });

  $scope.$on('leafletDirectiveMarker.dragend', function(event, o) {
    $scope.dealer.address.lat = o.model.lat;
    $scope.dealer.address.lon = o.model.lng;
  });

  $scope.save = function() {
    $modalInstance.close({save: true , dealer: $scope.dealer, stock: $scope.stock});
  };
  $scope.cancel = function(){
    $modalInstance.close({save: false, dealer: null, stock: null});
  };
}])
.service('DealerService', ['$rootScope', function($rootScope) {
  var dealer = null;
  return {
    select: function(d) {
      $rootScope.$broadcast('DealerSelected', d);
    },
    focus: function(d) {
      $rootScope.$broadcast('DealerFocused', d);
    },
    update: function(d) {
      $rootScope.$broadcast('DealerUpdated', d);
    },
    create: function(d) {
      $rootScope.$broadcast('DealerCreated', d);
    },
    add: function() {
      $rootScope.$broadcast('DealerAddRequest');
    }
  }
}]);

