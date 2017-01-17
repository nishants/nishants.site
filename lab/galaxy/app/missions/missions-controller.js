app.controller("missionsController", ['$scope', 'helpService', 'missionsService', "wizardService", function($scope, helpService, missionsService, wizardService){
  $scope.missions = missionsService;
  $scope.help = helpService;
  $scope.createMission = wizardService.show;
}]);

