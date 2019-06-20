/**
 * Created by Linh Nguyen on 6/12/2019.
 */
angular.module('yapp')
  .controller('OverviewController', function ($scope, $location, $http, config, $rootScope) {

    $scope.theIndex = 2;
    $scope.requestNumber = 0;
    $scope.listParseData= []
    var token = localStorage.getItem("token");
    if (token == null || token == '') {
      $location.path('/login');
    }

    function fetchTrackingCode(json) {
      return new Promise(function (resolve, reject) {
        return $http({
          method: 'POST',
          url: config.base_url + "/api/tracking/getListTracking",
          data: json,
          timeout: 50000,
          headers: {
            Authorization: "Bearer " + token
          }
        }).then((data) => {
          resolve(data);
        }), (error) => {
          console.log(error);
        }
      })

    }


    $scope.checkMany = async function () {
      console.log("call check manay");
      $scope.isProgress = true;
      $scope.listParseData = [];
      let trackingkey = null;

      for (let i = 0; i < 100; i++) {
        if (!$scope.isProgress) {
          break;
        }
        $scope.theIndex = i;
        console.log($scope.theIndex);
        let compareDate = formatDateMD($scope.filterDate);
        console.log(trackingkey);
        let json = {
          "theIndex": $scope.theIndex,
          "destinationPostalCode": $scope.zipCode,
          "dateRangeFrom": formatDate($scope.dateRangeFrom),
          "dateRangeTo": formatDate($scope.dateRangeTo),
          "numberOrder": $scope.requestNumber,
          "key": trackingkey
        };

        //================== await ====================
        let data = await fetchTrackingCode(json);
        let listData = data.data.trackingResponseDTOS;
        if (listData == null) return;
        let listParseData = listData
          .map(t => {
            return {
              "trackingNumber": t.trackingNumber,
              "packageStatus": t.packageStatus,
              "packageStatusDate": formatDateDDMM(t.packageStatusDate)
            }
          });
        //=============================================
        $scope.listParseData = $scope.listParseData.concat(listParseData);
        $scope.$apply();
        console.log(data.data)
        if (trackingkey == null) {
          trackingkey = data.data.key;
        }
        if (data.data.isEnd) {
          console.log("=============================================")
          trackingkey = null;
          $rootScope.$broadcast("REFRESH_USER_INFO", {});
          $scope.requestNumber = 0;
          break;
        }

        $scope.theIndex++;
        if ($scope.theIndex == 100) {
          trackingkey = null;
          alert("Out of request. Please try again later!");
          $rootScope.$broadcast("REFRESH_USER_INFO", "{}");
          break;
        }
      }
    }


    $scope.getPercent = function () {
      let tempRequestNumber = $scope.requestNumber == 0 ? 1 : $scope.requestNumber;
      return (($scope.listParseData.length / ($scope.requestNumber)) * 100);
    }

    $scope.stopInterval = () => {
      trackingkey = null;
      $scope.isProgress = false;
      $rootScope.$broadcast("REFRESH_USER_INFO", {});
    }


    $scope.export = () => {
      var currentdate = new Date();
      var dateTime = currentdate.getDate() + "_" + (currentdate.getMonth() + 1) + "_" + currentdate.getFullYear() + "_" + currentdate.getHours() + "_" + currentdate.getMinutes();
      var fileName = "exports" + "_" + dateTime;
      if ($scope.listParseData && $scope.listParseData.length > 0) {
        alasql.promise(`SELECT * INTO XLSX("export/${fileName}.xlsx",{headers:true}) FROM ?`, [$scope.listParseData]).then(function (response) {
          console.log(response);
        });
      } else {
        alert(`No data to export!`);
        return;
      }
      alert(`Export successful to file ${fileName}.xlsx`);
      // writeMapExportToFile($scope.listParseData);

    }


    var writeMapExportToFile = function (arrayExport) {
      if (arrayExport && arrayExport.length > 0) {
        var exportMap = new Map(arrayExport.map(i => [i.ASIN, i]));
        $scope.oldData = new Map([...$scope.oldData, ...exportMap]);
        writeFile(JSON.stringify([...$scope.oldData]));
      }

    }

    var writeFile = function (data) {
      fs.writeFile('cache.json', data, (err) => {
        if (err) {
          alert("An error ocurred updating the file" + err.message);
          console.log(err);
          return;
        }
      })
    }

    function formatDateMD(date) {
      var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return month + "/" + day;
    }

    function formatDate(date) {
      var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return month + "/" + day + "/" + year;
    }

    function formatDateDDMM(strDate) {
      let monthDay = strDate.split("/");
      let monthStr = monthDay[0];
      let dateStr = monthDay[1];
      return dateStr + "/" + monthStr;
    }


  });
