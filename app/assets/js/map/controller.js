'use strict';

angular.module('matemonkey.map',
               [
                 'ngRoute',
                 'leaflet-directive'
               ])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/map/', {
    templateUrl: 'js/map/view.html',
    controller: 'MapController',
    reloadOnSearch: false
  });
  $routeProvider.when('/map/dealer/:dealer_slug', {
    templateUrl: 'js/map/view.html',
    controller: 'MapController',
    reloadOnSearch: false
  });
}])

.controller('MapController', function($scope, $http, $routeParams, DealerService, leafletBoundsHelpers, urlfor) {
  $scope.dealerToMarker = function(dealers) {
    return dealers.map(function(dealer) {
      return {
        layer: 'dealers',
        dealer: dealer,
        lat: dealer['address']['lat'],
        lng: dealer['address']['lon'],
        icon: $scope.icons[dealer.type]
      };
    });
  };
  $scope.ready = false;
  $scope.loadDealers = function() {
    var requestBounds = angular.copy($scope.bounds);
    if (requestBounds.southWest.lat < -90.00) {
      requestBounds.southWest.lat = -90.00;
    }
    if (requestBounds.southWest.lat > 90.00) {
      requestBounds.southWest.lat = 90.00;
    }
    if (requestBounds.southWest.lng < -180.00) {
      requestBounds.southWest.lng = -180.00;
    }
    if (requestBounds.southWest.lng > 180.00) {
      requestBounds.southWest.lng = 180.00;
    }
    if (requestBounds.northEast.lat < -90.00) {
      requestBounds.northEast.lat = -90.00;
    }
    if (requestBounds.northEast.lat > 90.00) {
      requestBounds.northEast.lat = 90.00;
    }
    if (requestBounds.northEast.lng < -180.00) {
      requestBounds.northEast.lng = -180.00;
    }
    if (requestBounds.northEast.lng > 180.00) {
      requestBounds.northEast.lng = 180.00;
    }
    $http({
        url: urlfor.get("dealers"),
        method: "GET",
        params: {bbox: requestBounds.southWest.lat + "," +
                       requestBounds.southWest.lng + "," +
                       requestBounds.northEast.lat + "," +
                       requestBounds.northEast.lng,
                type: $scope.types}
      }).success(function(data) {
        $scope.markers = $scope.dealerToMarker(data['dealers']);
      });
  };

  $scope.defaultCenter = {
    lat: 48.13722,
    lng: 11.575556,
    zoom: 10
  };
  $scope.center = $scope.defaultCenter;

  if ($routeParams.hasOwnProperty('dealer_slug')) {
    $http({
      url: urlfor.get("dealersSlug", $routeParams.dealer_slug),
      method: "GET"
    }).success(function(dealer) {
      DealerService.select(dealer);
      $scope.center = {
        zoom: 18,
        lat: dealer.address.lat,
        lng: dealer.address.lon,
        autoDiscover: false
      };
      $scope.ready = true;
    }).error(function() {
      $scope.center = $scope.defaultCenter;
      $scope.center.autoDiscover = true;
      $scope.ready = true;
    });
  } else {
    $scope.ready = true;
  }
  angular.extend($scope, {
    icons: {
      retail : {
        type: 'awesomeMarker',
        icon: 'shopping-cart',
        markerColor: 'green'
      },
      restaurant: {
        type: 'awesomeMarker',
        icon: 'cutlery',
        markerColor: 'orange'
      },
      bar: {
        type: 'awesomeMarker',
        icon: 'glass',
        markerColor: 'red'
      },
      club: {
        type: 'awesomeMarker',
        icon: 'cd',
        markerColor: 'purple'
      },
      hackerspace: {
        type: 'awesomeMarker',
        icon: 'glyphicon icon-glider',
        markerColor: 'blue'
      },
      other: {
        type: 'awesomeMarker',
        icon: 'info-sign',
        markerColor: 'darkgreen'
      }
    },
    layers: {
      baselayers: {
        osm: {
          name: 'OSM',
          type: 'xyz',
          url: 'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.jpg',
          layerOptions: {
            subdomains: '1234',
            attribution: "© <a href=\"http://www.openstreetmap.org/copyright\" target=\"_blank\">OpenStreetMap</a> contributors | Tiles Courtesy of <a href=\"http://www.mapquest.com/\" target=\"_blank\">MapQuest</a> <img src=\"http://developer.mapquest.com/content/osm/mq_logo.png\">"
          }
        }
      },
      overlays: {
        dealers: {
          name: 'dealers',
          type: 'markercluster',
          visible: true
        }
      }
    },
    defaults: {
      zoomControlPosition: 'topright',
      controls: {
        layers: {
          visible: false,
        }
      }
    }
  });

  $scope.$on('leafletDirectiveMarker.click', function (e, args) {
    DealerService.select(args['model'].dealer);
  });

  $scope.$on('FilterChanged',function(event, f) {
    if (f.all == true) {
      $scope.types = null
    } else {
      $scope.types = ""
      angular.forEach(f, function(value, key) {
        if (value == true) {
          if ($scope.types.length == 0) {
            $scope.types = key;
          } else {
            $scope.types += "," + key;
          }
        }
      });
    }
    if ($scope.ready == true) {
      $scope.markers = {};
      $scope.loadDealers();
    }
  });
  $scope.$on('DealerCreated', function(event, d) {
    angular.extend($scope.markers, $scope.dealerToMarker([d]));
  });
  $scope.$on('DealerUpdated', function(event, d) {
    /* Doesn't work at the moment
    for (var i = 0; i < $scope.markers.length; i++) {
      if ($scope.markers[i].dealer.id == d.id) {
        $scope.markers.splice(i, 1, $scope.dealerToMarker([d])[0]);
        console.log("Updated");
        break;
      }
    }
    */
    $scope.markers = {};
    $scope.loadDealers();
  });
  $scope.$watch('bounds', function(newVal, oldVal) {
    if ($scope.ready == true) {
      $scope.markers = {};
      $scope.loadDealers();
    }
  });
});

