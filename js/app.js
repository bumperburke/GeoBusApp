'use strict';

var app = angular.module('geobusapp', [
    'angular-ladda',
    'ui.router',
    'jcs-autoValidate'
]);

app.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise("/welcome");
    
    $stateProvider
    .state('welcome', {
        url: "/welcome",
        templateUrl: "html/greeting.html",
        controller: ''
    })
    
    .state('timetables', {
        url: "/timetables",
        templateUrl: "html/timetables.html",
        controller: ''
    })
    
    .state('login', {
        url: "/login",
        templateUrl: "html/loginContent.html",
        controller: 'loginCtrl'
    })
    
    .state('register', {
        url: "/register",
        templateUrl: "html/newAccount.html",
        controller: 'newAccountCtrl'
    })
    
    .state('home', {
        url: "/home",
        templateUrl: "html/home.html",
        controller: ''
    });
});
/*app.config(function ($routeProvider) {
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

    .when('/createAccount', {
        templateUrl: 'html/newAccount.html',
        controller: 'newAccountCtrl'
    })

    .when('/home', {
        templateUrl: 'html/home.html',
        controller: 'homeCtrl'
    });

});*/

app.run(function (defaultErrorMessageResolver) {
    defaultErrorMessageResolver.getErrorMessages().then(function (errorMessages) {
        errorMessages['passFail'] = 'Must contain upper and lower case letters and numbers';
        errorMessages['mismatch'] = 'Passwords Do Not Match!';
    })
})

app.controller('loginCtrl', function ($scope, $http, $location) {
    $scope.btnText = "Login";
    /*$scope.users = [];*/

    $scope.login = function () {
        $scope.loggingIn = true;
        $scope.btnText = "Processing...";

    }

    /*$scope.getTest = function() {
        $http.get("https://geobus.co.uk/api/getUsers.php")
        .then(function(response){
            $scope.users = response.data;
        }, function(response) {
            $scope.users = "ERROR";
        });
    }*/
});

app.controller('homeCtrl', function ($scope) {
    $scope.message = 'Welcome!'
});

app.controller('newAccountCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.formData = {};
    $scope.createBtn = "Create Account";


    $scope.formSubmit = function () {
        $scope.registering = true;
        $scope.createBtn = "Registering Details...";

        var request = $http({
                method: 'post',
                url: 'https://geobus.co.uk/api/addUser/add.php',
                data: $scope.formData,
                headers: { 'Content-Type' : 'application/json' }
            });
        
        request.success(function(data) {
            $scope.registering = false;
            $scope.createBtn = "Success!";
            $scope.postResponse = data.reqSuccess;
        });
    }
}]);