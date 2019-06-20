'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('yapp')
  .controller('DashboardCtrl', function($scope, $state,$rootScope,$location,$timeout,config,$http) {
    $scope.$state = $state;
    $scope.user = {};
    var token = localStorage.getItem("token");
    $scope.totalChecking = 0;
    if(localStorage.getItem("totalChecking")){
      $scope.totalChecking = localStorage.getItem("totalChecking");
    }
    $scope.logout = function () {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("totalChecking");
      $location.path('/login');
    }
    $rootScope.$on("REFRESH_USER_INFO",function (e,data) {
        loadUserDetail();
    })

    function loadUserDetail() {
      $http({
        method: "GET",
        url: config.base_url + "/api/user/getUserInfo",
        headers: {
        Authorization: "Bearer "+ token
        }
      }).then(function (data) {
        $scope.totalChecking = data.data.numberTracking;
        $scope.username = data.data.username;
        localStorage.setItem("totalChecking",$scope.totalChecking);
      })
    }

    loadUserDetail();
  });
