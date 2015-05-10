'use strict';

angular.module('matemonkey.map',
               [
                 'ngRoute',
                 'leaflet-directive'
               ])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/map', {
    templateUrl: 'js/map/view.html',
    controller: 'MapController'
  });
}])

.controller('MapController', function($scope, $http, DealerService, leafletBoundsHelpers, urlfor) {
  var dealerToMarker = function(dealers) {
    return dealers.map(function(dealer) {
      return {
        layer: 'dealers',
        dealer: dealer,
        lat: dealer['address']['lat'],
        lng: dealer['address']['lon']
      };
    });
  };

  var loadDealers = function() {
    $http({
        url: urlfor.get("dealers"),
        method: "GET",
        params: {bbox: $scope.bounds.southWest.lat + "," +
                       $scope.bounds.southWest.lng + "," +
                       $scope.bounds.northEast.lat + "," +
                       $scope.bounds.northEast.lng,
                type: $scope.types}
      }).success(function(data) {
        $scope.markers = dealerToMarker(data['dealers']);
      });
  };
  var bounds = leafletBoundsHelpers.createBoundsFromArray([
    [ 0, 0 ],
    [ 0, 0 ]
  ]);
  angular.extend($scope, {
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
      controls: {
        layers: {
          visible: false,
        }
      }
    },
    center: {
      autoDiscover: true
    },
    bounds : bounds
  });

  $scope.$on('leafletDirectiveMarker.click', function (e, args) {
    DealerService.set(args['model'].dealer);
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
    $scope.markers = {};
    loadDealers();
  });
  $scope.$watch('bounds', function(newVal, oldVal) {
    $scope.markers = {};
    loadDealers();
  });
});

