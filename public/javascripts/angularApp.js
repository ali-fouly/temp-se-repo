(function () {

    var app = angular.module('airlinesApp', ['ui.router']);

    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'mainController',
                resolve: {
                    flightPromise: ['flights', function (flights) {
                        return flights.getAll();
                    }]
                }
            })

            .state('flight', {
                url: '/flights/{id}',
                templateUrl: '/flight.html',
                controller: 'flightsController',
                resolve: {
                    flight: ['$stateParams','flights', function ($stateParams, flights) {
                        return flights.show($stateParams.id)
                    }]
                }
            })

            .state('ticket', {
                url: '/tickets',
                templateUrl: '/tickets.html',
                controller: 'ticketsController',
                resolve: {
                    ticketPromise: ['tickets', function (tickets) {
                        return tickets.getAll();
                    }]
                }
            });

        $urlRouterProvider.otherwise('home');
    }]);

    app.controller('mainController', ['$scope', 'flights', function ($scope, flights) {
        $scope.flights = flights.flights;
        // console.log($scope.flight);

        $scope.searchType = 1;
        $scope.search = function (flight) {
            flights.search(flight);
            $scope.searchTerm = {
                origin: flight.origin,
                destination: flight.destination
            };
        };
    }]);

    app.controller('flightsController',['$scope', 'flights', 'flight', function ($scope, flights, flight) {

        $scope.flight = flight;

    }]);


    app.factory('flights', ['$http',function ($http) {
        var o = {
            flights: []
        };

        o.getAll = function(){
            return $http.get('/flights').success(function (data) {
                angular.copy(data, o.flights);
            });
        };

        o.search = function (flight) {

            if(flight.returningDate){
                return $http.post('/search/flights/both', flight).success(function (data) {
                    angular.copy(data, o.flights);
                });
            }
            return $http.post('/search/flights', flight).success(function (data) {
                angular.copy(data, o.flights);
            });
        };
        
        o.show = function (id) {
            return $http.get('/flights/' + id).then(function (res) {
                return res.data;
            });
        };

        return o;
        
    }]);

    app.controller('ticketsController',['$scope', 'tickets', 'ticket', function ($scope, tickets, ticket) {

    $scope.ticket = ticket;

    }]);

    app.factory('tickets', ['$http',function ($http) {
        var o = {
            tickets: []
        };

        o.getAll = function(){
            return $http.get('/tickets').success(function (data) {
                angular.copy(data, o.tickets);
            });
        };
        return o;
        
    }]);

})();