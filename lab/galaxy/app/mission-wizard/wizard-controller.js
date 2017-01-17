app.controller("wizardController", ["$scope", "planetsService", "vehiclesService", "wizardService", function($scope, planetsService, vehiclesService, wizardService){
  $scope.planets  = planetsService;
  $scope.vehicles = vehiclesService;
  $scope.wizard   = wizardService;
}]);

