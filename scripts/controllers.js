'use strict';

var controllers = angular.module('litApp.controllers', []);


controllers.controller('mainCtrl', function($scope, dataService) {

    var currentMonth = 6;
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    dataService.getKHData(function(response){
        $scope.data = response.data;
        $scope.availableOrders = response.data.available_orders;
        console.log($scope.data);
    });

    $scope.save = function(postData) {
        dataService.saveData(postData, function(response) {
            console.log('Data sent' + JSON.stringify(postData));
        });
    };

    $scope.userInit = function () {
        $scope.nameSelected=false;
    };

    $scope.receiveMonth = function (user, itemName, month) {
        var allItems = $scope.getAllItems(user);
        for (var i=0; i<allItems.length; i++) {
            if (allItems[i].name == itemName) {
                allItems[i].months_received.push(month);
                return console.log("This Worked!");
            }
        }
        return console.log("This did not Work!");

    };


    /**
     *
     * @param months_received
     * @returns {Array} of month
     */
    $scope.monthsNotReceived = function (months_received) {
        var return_months = [];
        var months_not_received = inverse(months_received);
        for (var i=0; i<months_not_received.length; i++) {
            if (months_not_received[i]<currentMonth) {
                return_months.push(months_not_received[i]);
            }
        }
        return return_months
    };

    /**
     * @param user
     * @returns {boolean}
     */
    $scope.hasPendingItems = function (user) {
        var pendingItems = [];
        var allItems = $scope.getAllItems(user);
        for (var i=0; i<allItems.length; i++) {
            var items = $scope.monthsNotReceived(allItems[i].months_received);
            if (items.length != 0){
                pendingItems.push(items);
            }
        }
        return pendingItems.length > 0 ? true : false;
    };

    /**
     *
     * @param user
     * @returns {*} string of "+ SomeNumber" means has item that is SomeNumber months old
     */
    $scope.showMonthsBehindCount = function (user) {
        if (!$scope.hasPendingItems(user)) {
            return '';
        }
        var furthestMonth = 0;
        var allItems = $scope.getAllItems(user);
        for (var i=0; i<allItems.length; i++) {
            var items = $scope.monthsNotReceived(allItems[i].months_received);
            if (items.length != 0){
                for (var j=0; j<items.length; j++){
                    var older = currentMonth - items[j];
                    if (older > furthestMonth){
                        furthestMonth = older;
                    }
                }
            }
        }
        //subtract one so that current month doesn't show up as +0 months behind
        furthestMonth = furthestMonth -1;
        return furthestMonth ? "+ " + furthestMonth : '';
    };

    $scope.monthName = function (month) {
        return months[month];
    };

    $scope.getAllItems = function (user) {
        return user.orders;
    };

    $scope.showIfForeignLanguage = function(language) {
        if (language != appDefaultLang()) {
            return language;
        }
        return '';
    };

    $scope.userLangItems = function (user, language) {
        for (var i = 0; i < user.orders.length; i++) {
            if (user.orders[i].language == language)
                return user.orders[i].items;
        }
        return console.log("ITEMS NOT FOUND FOR "+user.fname+" "+language);
    };

    var inverse = function (months) {
        var inverse = [0,1,2,3,4,5,6,7,8,9,10,11];
        for (var i=0; i<months.length; i++) {
            var index = inverse.indexOf(months[i]);
            if (index != -1) {
                delete inverse[index];
            }
        }
        return inverse;
    };

    var appDefaultLang = function () {
        return $scope.data.default_language;
    };
})


