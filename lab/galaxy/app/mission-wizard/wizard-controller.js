app.controller("wizardController", ["$scope", "planetsService", "vehiclesService", function($scope, planetsService, vehiclesService){
  $scope.planets  = planetsService;
  $scope.vehicles = vehiclesService;
}]);

