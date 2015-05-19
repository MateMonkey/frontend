'use strict';

var app = angular.module('matemonkey',
                         [
                            'config.api',
                            'ngRoute',
                            'pascalprecht.translate',
                            'matemonkey.navbar',
                            'matemonkey.map',
                            'matemonkey.dealer',
                            'matemonkey.filter',
                            'matemonkey.about',
                            'matemonkey.legal'
                         ])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.otherwise({redirectTo: '/map'});
  $locationProvider.hashPrefix('!');
}])
.config(['$translateProvider', function($translateProvider) {
  $translateProvider.translations('en', {
    just_now: 'just now',
    seconds_ago: '{{time}} seconds ago',
    a_minute_ago: 'a minute ago',
    minutes_ago: '{{time}} minutes ago',
    an_hour_ago: 'an hour ago',
    hours_ago: '{{time}} hours ago',
    a_day_ago: 'yesterday',
    days_ago: '{{time}} days ago',
    a_week_ago: 'a week ago',
    weeks_ago: '{{time}} weeks ago',
    a_month_ago: 'a month ago',
    months_ago: '{{time}} months ago',
    a_year_ago: 'a year ago',
    years_ago: '{{time}} years ago',
    over_a_year_ago: 'over a year ago',
    seconds_from_now: '{{time}} seconds from now',
    a_minute_from_now: 'a minute from now',
    minutes_from_now: '{{time}} minutes from now',
    an_hour_from_now: 'an hour from now',
    hours_from_now: '{{time}} hours from now',
    a_day_from_now: 'tomorrow',
    days_from_now: '{{time}} days from now',
    a_week_from_now: 'a week from now',
    weeks_from_now: '{{time}} weeks from now',
    a_month_from_now: 'a month from now',
    months_from_now: '{{time}} months from now',
    a_year_from_now: 'a year from now',
    years_from_now: '{{time}} years from now',
    over_a_year_from_now: 'over a year from now'
  });
  $translateProvider.preferredLanguage('en');
  $translateProvider.useSanitizeValueStrategy(null);
}])
.service('urlfor', ['apiConfig', function(apiConfig) {
  return {
    get : function(url, arg) {
        switch(url) {
          case "dealers":
            return apiConfig.base_url + '/api/v1/dealers';
          case "dealersSlug":
            return apiConfig.base_url + '/api/v1/dealers/slug/' + arg;
          case "updateDealer":
            return apiConfig.base_url + '/api/v1/dealers/' + arg;
          case "stock":
            return apiConfig.base_url + '/api/v1/dealers/' + arg + "/stock";
          case "products":
            return apiConfig.base_url + '/api/v1/products';
          case "search":
            return apiConfig.base_url + '/api/v1/search';
        }
        return "";
    }
  }
}])
.filter('capfirst', function() {
  return function(input) {
    input = input || '';
    return input.charAt(0).toUpperCase() +
           input.slice(1).toLowerCase();
  }
})
.filter('div100', function() {
  return function(input) {
    if (input == '?')
      return input;
    else
      return (input/100);
  }
})
.filter('date2', function () {
  return function(input) {
    return Date.parse(input);
  }
})
.directive('ensurefloat', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.isfloat = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return true;
        }
        if (isNaN(viewValue)) {
          return false;
        }
        return true;
      }
    }
  }
})
.run(['$rootScope', function($rootScope) {
  $rootScope.utils = {
    compareBounds: function(a,b) {
      if ((a.northEast.lat > b.northEast.lat) |
          (a.northEast.lng > b.northEast.lng) |
          (a.southWest.lat < b.southWest.lat) |
          (a.southWest.lng < b.southWest.lng)) {
        return true;
      } else {
        return false;
      }
    }
  ,
  scaleBounds: function(bound, scale) {
    var dlat = Math.abs(bound.northEast.lat-
                        bound.southWest.lat);
    var dlng = Math.abs(bound.northEast.lng-
                        bound.southWest.lng);
    return {
      northEast: {
        lat: Math.min(Math.max(bound.northEast.lat+dlat/2.0,  -90), 90),
        lng: Math.min(Math.max(bound.northEast.lng+dlng/2.0, -180), 180)
      },
      southWest: {
        lat: Math.min(Math.max(bound.southWest.lat-dlat/2.0, -90), 90),
        lng: Math.min(Math.max(bound.southWest.lng-dlng/2.0,  -180), 180)
      }
    }
  }
  }

}]);
