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

app.run(function (defaultErrorMessageResolver) {
    defaultErrorMessageResolver.getErrorMessages().then(function (errorMessages) {
        errorMessages['nameError'] = 'Only letters to be used! (A-Z, a-z)';
        errorMessages['passError'] = 'Upper and lower case letters and numbers only!';
        errorMessages['mismatchPassError'] = 'Passwords Do Not Match!';
    })
})

app.controller('loginCtrl', function ($scope, $http) {
    $scope.btnText = "Login";
    $scope.loginCreds = {};
    $scope.showResponse = false;
    $scope.logging = false;

    $scope.submitLogin = function () {
        $scope.loggingIn = true;
        $scope.btnText = "Processing...";

        var request = $http({
            method: 'post',
            url: 'https://geobus.co.uk/api/v1/login',
            data: $scope.loginCreds,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=utf-8'}
        })
        .then(function(response){
            if(response.data.message === 'credFail'){
                $scope.showResponse = true;
                $scope.logging = false;
                $scope.loginResponse = 'Invalid Login Credentials!';
                $scope.respLoginMsgColor = {"color":"#ff0000"};
                $scope.btnText = "Login";
            }
            else if(response.data.message === 'confirmed') {
                $scope.showResponse = true;
                $scope.logging = false;
                $scope.loginResponse = 'Success';
                $scope.respLoginMsgColor = {"color":"#228b22"};
            }
        });
    }

    
});

app.controller('homeCtrl', function ($scope) {
    $scope.message = 'Welcome!'
});

app.controller('newAccountCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.formData = {};
    $scope.createBtn = "Create Account";
    $scope.showForm = true;


    $scope.formSubmit = function () {
        $scope.registering = true;
        $scope.createBtn = "Registering Details...";
        $scope.responseMsgColor = {};

        var request = $http({
                method: 'post',
                url: 'https://geobus.co.uk/api/v1/register',
                data: $scope.formData,
                headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=utf-8'}
            })
            .then(function(response) {
                $scope.registering = false;
                $scope.showResponse = false;
                $scope.disableButton = false;
                
                if(response.data.message === 'success')
                {
                    $scope.createBtn = "Success!";
                    $scope.postResponse = "Registration Successful!";
                    $scope.showResponse = true;
                    $scope.responseMsgColor = {"color":"#228b22"};
                    $scope.disableButton = true;
                    $scope.showForm = false;
                }
                else if(response.data.message === 'fail'){
                    $scope.createBtn = "Oooops!";
                    $scope.postResponse = "Sorry, An Error Has Occured! Re-try Later.";
                    $scope.showResponse = true;
                    $scope.responseMsgColor = {"color":"#ff0000"};
                    $scope.disableButton = true;
                    $scope.showForm = true;
                }
                else if(response.data.message === 'duplicate'){
                    $scope.createBtn = "Oooops!";
                    $scope.postResponse = "Sorry, That Email Is Already In Use! Please Use Another.";
                    $scope.showResponse = true;
                    $scope.responseMsgColor = {"color":"#ff0000"};
                }
            });
    }
}]);