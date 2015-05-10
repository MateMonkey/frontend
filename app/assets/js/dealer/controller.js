'use strict';

angular.module('matemonkey.dealer',["ngSanitize", "relativeDate", "ui.bootstrap", "dialogs.main"])
.controller('DealerController', function($scope, $http, DealerService, dialogs, urlfor) {
  $scope.reloadStock = function() {
    $http({
      method: "GET",
      url: urlfor.get("stock", $scope.dealer.id),
      params: {
        current: true
      }
    }).success(function(data) {
      $scope.stock = data['entries'];
    });
  };
  $scope.$on('DealerChanged', function(event, d) {
    $scope.dealer = d;
    $scope.reloadStock();
  });
  $scope.updateStock = function(dealer, stock) {
    var data = null
    if ((typeof stock.price == "undefined") ||
        (stock.price == 0)) {
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

  $scope.showUpdateStock = function(which) {
    var dlg = dialogs.create('js/dealer/update_stock.html', 'UpdateStockController', $scope.dealer, 'lg');
    dlg.result.then(function(data){
      if (data.save == true) {
        $scope.updateStock(data.dealer, data.stock);
      }
    });
  };
})
.controller('UpdateStockController',function($scope, $http, $modalInstance, data, urlfor){
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
    set : function(x) {
      dealer = x;
      $rootScope.$broadcast('DealerChanged', x);
    },
    get : function() {
      return dealer;
    }
  }
});

