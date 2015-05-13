'use strict';

angular.module('matemonkey.dealer',["ngSanitize", "relativeDate", "ui.bootstrap", "dialogs.main"])
.controller('DealerController', function($scope, $http, $route, $location, DealerService, dialogs, urlfor) {
  $scope.showDiscontinued = false;
  $scope.reloadStock = function() {
    $http({
      method: "GET",
      url: urlfor.get("stock", $scope.dealer.id),
      params: {
        current: true
      }
    }).success(function(data) {
      $scope.stock = data['entries'];
    }).error(function(data) {
      $scope.stock = {};
    });
  };

  $scope.setDealer = function(d) {
    $scope.dealer = d;
    /* Hack to prevent angular from reloading the page */
    $route.current.pathParams['dealer_slug'] = d.slug;
    $location.path('/map/dealer/'+d.slug);
    $scope.reloadStock();
  }

  $scope.$on('DealerSelected', function(event, d) {
    $scope.setDealer(d);
  });


  $scope.updateStock = function(dealer, stock) {
    var data = null
    if ((typeof stock.price == "undefined")) {
      data = {
        status: stock.status,
        product: stock.product,
        quantity: stock.quantity
      }
    } else {
      data = {
        status: stock.status,
        product: stock.product,
        price: parseFloat(stock.price)*100,
        quantity: stock.quantity,
        special: stock.special
      }
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
  }

  $scope.createDealer = function(dealer) {
    $http({
      url: urlfor.get("dealers"),
      method: "POST",
      data: dealer
    }).success(function(data) {
      $scope.setDealer(data);
      DealerService.create(data);
    });
  }

  $scope.showUpdateStock = function() {
    var dlg = dialogs.create('js/dealer/update_stock.html', 'UpdateStockController', $scope.dealer, 'lg');
    dlg.result.then(function(data){
      if (data.save == true) {
        $scope.updateStock(data.dealer, data.stock);
      }
    });
  };

  $scope.showEditDealer = function() {
    var dlg = dialogs.create('js/dealer/edit_dealer.html', 'EditDealerController', angular.copy($scope.dealer), 'lg');
    dlg.result.then(function(data) {
      if (data.save == true) {
        $scope.updateDealer(data.dealer);
      }
    });
  };

  $scope.createNewDealer = function() {
    var dlg = dialogs.create('js/dealer/edit_dealer.html', 'EditDealerController', null, 'lg');
    dlg.result.then(function(data) {
      if (data.save == true) {
        $scope.createDealer(data.dealer);
      }
    });
  };
})
.controller('EditDealerController', function($scope, $http, $modalInstance, data, urlfor){
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
      displayText: "Bar",
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
    $scope.title = "Create new dealer"
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

})
.controller('UpdateStockController',function($scope, $http, $modalInstance, data, urlfor) {
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
    },
    {
      displayText: "Unknown",
      value: "unknown"
    }
  ];

  $http.get(urlfor.get("products")).success(function(data) {
    $scope.products = data['products'];
  })
  $scope.dealer = data;
  $scope.stock = {};

  $scope.save = function() {
    $modalInstance.close({save: true , dealer: $scope.dealer, stock: $scope.stock});
  };
  $scope.cancel = function(){
    $modalInstance.close({save: false, dealer: null, stock: null});
  };
})
.service('DealerService', function($rootScope) {
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
    }
  }
});

