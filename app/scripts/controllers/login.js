'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('yapp')
  .controller('LoginCtrl', function ($scope, $location, $http,config,$rootScope) {

    $scope.goToRegister = function () {
      $location.path('/register');
    }
    $scope.login = function () {
      $http.post(config.base_url + "/api/auth/signin", $scope.userData).then(function (data) {
        localStorage.setItem("token",data.data.token);
        localStorage.setItem("userId",data.data.userId);
        setTimeout(()=>{
          $rootScope.$broadcast("REFRESH_USER_INFO",data.data);
        },1000)
        $location.path('/dashboard');
      }, function (error) {
        console.log(error);
        alert("register error");
      });
      return false;
    };

  });
