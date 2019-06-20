'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('yapp')
  .controller('KeysController', function ($scope, $location, $http, config) {
    var token = localStorage.getItem("token");
    if(token == null || token == ''){
      $location.path('/login');
    }
  });
