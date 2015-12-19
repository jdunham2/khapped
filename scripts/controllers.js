'use strict';

var controllers = angular.module('litApp.controllers', []);


controllers.controller('mainCtrl', function($scope){
    $scope.months = ["JAN", "FEB", "MAR", "ARP", "MAY", "JUNE", "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"];
});


controllers.controller('congCtrl', function($scope, dataService) {
    dataService.getKHData(function(response){
        $scope.data = response.data;
        $scope.availableOrders = response.data.available_orders;
        console.log($scope.data);
    });

    $scope.getDefaultLanguage = function(user) {
        console.log("DefaultLanguage: " + user.orders[0].language)
        return user.default_language || user.orders[0].language;
    };

    $scope.getDefaultItem = function(user) {
        console.log("DefaultItem: " + user.orders[0].items[0].name)
        return user.default_order || user.orders[0].items[0].name;
    };

    $scope.hasMoreThanOneLanguage = function(user) {
        if (user.orders.length > 1)
            return true;
        return false;
    }
    $scope.itemReceived = function(user, itemName, index) {
        var ordersLength = user.orders.length;
        for (var i=0; i < ordersLength; i++) {
            var itemsLength = user.orders[i].items.length;
            for (var j=0; j<itemsLength; j++) {
                if (user.orders[i].items[j].months_received.indexOf(index) > -1){
                    return true
                }
                return false
            }
        }
    };
    $scope.getAllLanguages = function(user) {
        var allLanguages = [];
        for (var i = 0; i < user.orders.length; i++){
            allLanguages.push(user.orders[i].language);
        }
        return allLanguages
    }
})