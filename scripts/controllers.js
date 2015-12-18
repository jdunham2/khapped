'use strict';

var controllers = angular.module('litApp.controllers', []);


controllers.controller('mainCtrl', function($scope){
    $scope.months = ["JAN", "FEB", "MAR", "ARP", "MAY", "JUNE", "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"];
});


controllers.controller('congCtrl', function($scope, dataService) {
    dataService.getKHData(function(response){
        $scope.data = response.data;
        console.log($scope.data);
    });
})