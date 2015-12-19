'use strict';
var app = angular.module('litApp', ['litApp.controllers', 'litApp.services'], function($rootScopeProvider) {
    $rootScopeProvider.digestTtl(15)
});