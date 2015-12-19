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

    $scope.allAvailableItems = function(){
        return $scope.data.available_orders;
    }

    $scope.getDefaultLanguage = function(user) {
        var length = user.orders.length;
        for (var i = 0; i<length; i++) {
            if (user.orders[i].language == $scope.appDefaultLang()) {
                return user.orders[i].language;
            }
        }
        return user.orders[0].language;
    };

    $scope.getDefaultItem = function(user, language) {
        var items = $scope.userLangItems(user, language);
        console.log("DefaultItem: " + items[0].name)
        return items[0].name;
    };

    $scope.appDefaultLang = function (language) {
        return $scope.data.default_language;
    };

    $scope.hasMoreThanOneLanguage = function(user) {
        if (user.orders.length > 1)
            return true;
        return false;
    };

    $scope.userLangItems = function (user, language) {
        for (var i = 0; i < user.orders.length; i++) {
            if (user.orders[i].language == language)
                return user.orders[i].items;
        }
        return console.log("ITEMS NOT FOUND FOR "+user.fname+" "+language);
    };

    $scope.userOrderedThisLangItem = function (user, lang, item) {
        var userItems = $scope.userLangItems(user, lang);
        for (var i=0; i<userItems.length; i++) {
            if (item.name == userItems[i].name) {
                return true
            }
        }
        return false;
    };

    $scope.userReceivedThisLangItem = function(user, lang, itemName, index) {
        var items = $scope.userLangItems(user, lang);
        for (var j=0; j<items.length; j++) {
            if (items[j].name == itemName) {
                if (items[j].months_received.indexOf(index) > -1) {
                    return true;
                }
                return false;
            }
        }
        return console.log('SOMETHING WENT WRONG')
    };
    $scope.getAllLanguages = function(user) {
        var allLanguages = [];
        for (var i = 0; i < user.orders.length; i++){
            allLanguages.push(user.orders[i].language);
        }
        return allLanguages
    }
})