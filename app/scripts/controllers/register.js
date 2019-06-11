'use strict';

/**
 * @ngdoc function
 * @name yapp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of yapp
 */
angular.module('yapp')
  .controller('RegisterCtrl', function($scope, $location,$http,config) {

    $scope.userData = {};
    $scope.register = function() {
      console.log($scope.userData);
      if($scope.userData.name == '' || $scope.userData.name == null){
        alert("the name is required");
        return;
      }
      if($scope.userData.email == '' || $scope.userData.email == null){
        alert("the email is required");
        return;
      }
      if($scope.userData.password == ''|| $scope.userData.password == null){
        alert("the password is required");
        return;
      }
      if($scope.userData.password !== $scope.userData.rePassword){
        alert("the passwords are not match");
        return;
      }
      $scope.userData.sourceApplication = 2;
      $http.post(config.base_url+"/api/auth/signup",$scope.userData).then(function (data) {
        alert("register successful, we will contact you via email when we active your account !")
        $location.path('/dashboard');
      },function (error) {
        console.log(error);
        alert("register error");
      });


      return false;
    }

  });
