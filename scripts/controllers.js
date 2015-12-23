'use strict';

var controllers = angular.module('litApp.controllers', []);
var USE_LOCAL_DB = true;

controllers.controller('mainCtrl', function($scope, $firebaseObject, dataService) {
    var ref;

    if (USE_LOCAL_DB == true) {
        //use local mock data
        dataService.getKHData(function(response) {
            $scope.data = response.data.southOneonta;
            console.log($scope.data);
            loginSuccess('LOCAL data');
        });
    }
    else {
        //use firebase
        ref  = new Firebase("https://scorching-torch-7698.firebaseio.com/southOneonta");
        login(ref);
    }
    function login(ref) {
        //firebase authentication
        ref.authWithOAuthPopup("google", function (error, authData) {
            if (error) {
                console.log("Login Failed!", error);
                //use local data as demo if errors
                console.log("Using local Data");
                dataService.getKHData(function(response){
                    $scope.data = response.data.southOneonta;
                    console.log($scope.data);
                });
            } else {
                $scope.data = $firebaseObject(ref);
                loginSuccess(authData);
            }
        });
    };
    function loginSuccess(authData) {
        console.log("Authenticated successfully with payload:", authData);

        var currentMonth = 6;
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        $scope.saveQueue = [];
        $scope.cancelAllReceivingMonths = function () {
            $scope.saveQueue = [];
        };

        $scope.queueReceiveMonth = function (itemName, lang, month, queue) {
            if (queue) {
                console.log("queuing");
                $scope.saveQueue.push({itemName: itemName, lang: lang, month: month});
                console.log($scope.saveQueue);
            }
            else {
                console.log("unqueuing");
                var saveQueue = $scope.saveQueue;
                for (var i = 0; i < saveQueue.length; i++) {
                    if (itemName == saveQueue[i].itemName
                        && lang == saveQueue[i].lang
                        && month == saveQueue[i].month)
                    {
                        console.log("before splice" + $scope.saveQueue);
                        $scope.saveQueue.splice(i, 1);
                        console.log("after splice" + $scope.saveQueue);
                    }
                }
            }
        };

        $scope.finalizeReceiveMonth = function (user) {
            var saveQueue = $scope.saveQueue;
            console.log(saveQueue);
            var allItems = user.orders;
            for (var j=0;j<saveQueue.length;j++) {
                console.log(saveQueue[j]);
                for (var i = 0; i < allItems.length; i++) {
                    if (allItems[i].name == saveQueue[j].itemName && allItems[i].language == saveQueue[j].lang) {
                        allItems[i].months_received.push(saveQueue[j].month);
                    }
                }
            }
            if (!USE_LOCAL_DB){
                data.$save()
            }
        };


        /**
         * Returns months that have not been saved as received.
         * @param months_received from user.order[].item
         * @returns {Array} of months
         */
        $scope.monthsNotReceived = function (months_received) {
            var return_months = [];
            var months_not_received = inverse(months_received);
            for (var i = 0; i < months_not_received.length; i++) {
                if (months_not_received[i] < currentMonth) {
                    return_months.push(months_not_received[i]);
                }
            }
            return return_months
        };

        var inverse = function (months) {
            var inverse = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            for (var i = 0; i < months.length; i++) {
                var index = inverse.indexOf(months[i]);
                if (index != -1) {
                    delete inverse[index];
                }
            }
            return inverse;
        };

        /**
         * Returns true if user has at least one new item to pick up
         * @param user
         * @returns {boolean}
         */
        $scope.hasPendingItems = function (user) {
            var pendingItems = [];
            var allItems = $scope.getAllItems(user);
            for (var i = 0; i < allItems.length; i++) {
                var items = $scope.monthsNotReceived(allItems[i].months_received);
                if (items.length != 0) {
                    pendingItems.push(items);
                }
            }
            return pendingItems.length > 0 ? true : false;
        };

        /**
         * Returns the number of months behind the oldest item is
         * @param user
         * @returns {*} string eg. "+1" -- thus oldest item is 1 month old
         */
        $scope.getMonthsBehindCount = function (user) {
            if (!$scope.hasPendingItems(user)) {
                return '';
            }
            var furthestMonth = 0;
            var allItems = $scope.getAllItems(user);
            for (var i = 0; i < allItems.length; i++) {
                var items = $scope.monthsNotReceived(allItems[i].months_received);
                if (items.length != 0) {
                    for (var j = 0; j < items.length; j++) {
                        var older = currentMonth - items[j];
                        if (older > furthestMonth) {
                            furthestMonth = older;
                        }
                    }
                }
            }
            //subtract one so that current month doesn't show up as +0 months behind
            furthestMonth = furthestMonth - 1;
            return furthestMonth ? "+ " + furthestMonth : '';
        };

        $scope.monthName = function (month) {
            return months[month];
        };

        $scope.getAllItems = function (user) {
            return user.orders;
        };

        $scope.showIfForeignLanguage = function (language) {
            if (language != appDefaultLang()) {
                return language;
            }
            return '';
        };

        var appDefaultLang = function () {
            return $scope.data.default_language;
        };
    };

});