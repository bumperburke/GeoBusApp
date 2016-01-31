'use strict';

var app = angular.module('geobusapp', [
    'angular-ladda',
    'ngRoute'
]);

app.config(function ($routeProvider) {
    $routeProvider

        .when('/', {
        templateUrl: 'html/greeting.html',
        controller: ''
    })
    
    .when('/timetables', {
        templateUrl: 'html/timetables.html',
        controller: ''
    })

    .when('/login', {
        templateUrl: 'html/loginContent.html',
        controller: 'loginCtrl'
    })

    .when('/home', {
        templateUrl: 'html/home.html',
        controller: 'homeCtrl'
    });

});

app.controller('loginCtrl', function ($scope, $http){
    $scope.btnText = "Login";
    $scope.users = [];
    
    $scope.login = function () {
        $scope.loggingIn = true;
        $scope.btnText = "Processing...";
        
    }
    
    $scope.getTest = function() {
        $http.get("http://geobus.co.uk/api/getUsers.php")
        .then(function(response){
            $scope.users = response.data;
        }, function(response) {
            $scope.users = "ERROR";
        });
    }
});

app.controller('homeCtrl', function ($scope) {
    $scope.message = 'Welcome!'
});