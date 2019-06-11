'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('yapp')
  .controller('LoginCtrl', function($scope, $location,$http) {

    $scope.goToRegister = function () {
      $location.path('/register');
    }
    $scope.login = function() {

      $location.path('/dashboard');

      return false;
    }

  });
