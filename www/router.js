angular.module('starter')
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('index', {
                url: '/index',
                templateUrl: 'index.html'
            })
            .state('map', {
                url: '/map',
                templateUrl: 'views/report/map.html',
                controller: 'MapCtrl'
            })
            .state('form', {
                url: '/form',
                templateUrl: 'views/report/form.html',
                controller: 'FormCtrl'
            })
            .state('report', {
                url: '/form/:lat/:lng',
                templateUrl: 'views/report/form.html',
                controller: 'FormCtrl'
            })
         ;

        $urlRouterProvider.otherwise('/map');
    });