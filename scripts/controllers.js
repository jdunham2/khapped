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

    $scope.userInit = function (user, language) {
        $scope.nameSelected=false;
        $scope.language=getDefaultLanguage(user);
        $scope.itemName=getDefaultItem(user, $scope.language);
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

    $scope.monthName = function (month) {
        return months[month];
    };

    $scope.getAllItems = function (user) {
        var allItems = [];
        for (var i=0; i<user.orders.length; i++) {
            for (var j=0; j<user.orders[i].items.length; j++) {
                user.orders[i].items[j]['language'] = user.orders[i].language;
                allItems.push(user.orders[i].items[j]);
            }
        }
        return allItems;
    };

    var getDefaultLanguage = function(user) {
        var length = user.orders.length;
        for (var i = 0; i<length; i++) {
            if (user.orders[i].language == appDefaultLang()) {
                return user.orders[i].language;
            }
        }
        return user.orders[0].language;
    };

    $scope.newItemsMessage = function () {

    };

    var getDefaultItem = function(user, language) {
        var items = $scope.userLangItems(user, language);
        console.log("DefaultItem: " + items[0].name)
        return items[0].name;
    };

    var appDefaultLang = function () {
        return $scope.data.default_language;
    };

    $scope.showAsForeignLanguage = function(language) {
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

    var userOrderedThisLangItem = function (user, lang, item) {
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


