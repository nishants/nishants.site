app.controller("missionsController", ['$scope', 'helpService', 'missionsService', "uiService", function($scope, helpService, missionsService, uiService){
  $scope.missions = missionsService;
  $scope.help = helpService;
  $scope.createMission = uiService.createMission;
}]);

