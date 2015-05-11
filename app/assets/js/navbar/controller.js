'use strict';

angular.module('matemonkey.navbar',
               [
                 'ui.bootstrap'
               ])
.controller('NavBarController', ['$scope', NavBarController]);

function NavBarController($scope) {
  $scope.isCollapsed = true;
};
