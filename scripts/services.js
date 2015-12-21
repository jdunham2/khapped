/**
 * Created by jeshuadunham on 12/1/15.
 */
'use strict';

var services = angular.module("litApp.services", []);

services.service('dataService', function($http) {
    this.getKHData = function(callback){
        $http.get('mock/data.json')
        .then(callback);
    };
    this.saveData = function(postData, callback){
        $http.post('mock/data.json',postData)
            .then(callback);
    };
    //this.saveData = function(postData, callback){
    //    console.log(postData);
    //    $http({
    //        method  : 'POST',
    //        url     : 'mock/data.json',
    //        data    : postData,
    //        headers : {'Content-Type': 'application/x-www-form-urlencoded'}
    //    }).then(callback);
    //};
});