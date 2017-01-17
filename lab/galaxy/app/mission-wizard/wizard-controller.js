app.controller("wizardController", ["$scope", "planetsService", function($scope, planetsService){
  $scope.planets = planetsService;
}]);

