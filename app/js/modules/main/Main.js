var Main = new angular.module('Main', ['ngResource', 'ngRoute'])
Main.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/paper', {
                templateUrl: './js/modules/main/templates/paper.html',
                controller: 'PaperController'
            }).
            when('/p5', {
                templateUrl: './js/modules/main/templates/p5.html',
                controller: 'p5Controller'
            }).
            when('/d3', {
                templateUrl: './js/modules/main/templates/d3.html',
                controller: 'd3Controller'
            }).
            when('/easle', {
                templateUrl: './js/modules/main/templates/easle.html',
                controller: 'easleController'
            }).
            when('/fabric', {
                templateUrl: './js/modules/main/templates/fabric.html',
                controller: 'fabricController'
            }).
            when('/introduction', {
                templateUrl: './js/modules/main/templates/introduction.html',
                controller: 'introController'
            }).

            otherwise({
                redirectTo: '/',
                templateUrl: './js/modules/main/templates/introduction.html',
                controller: 'introController'
            });
    }]);

Main.controller('mainController', ['$scope', function($scope){
    $scope.data = "mainController data"

}])
