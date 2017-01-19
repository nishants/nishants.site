app.controller("missionsController", ['$scope', 'helpService', 'missionsService', "wizardService", "resultService", function($scope, helpService, missionsService, wizardService, resultService){
  $scope.missions = missionsService;
  $scope.help = helpService;
  $scope.createMission = wizardService.show;
  $scope.sendMissions  = function(){
    resultService.submit(missionsService.list);
  };
}]);

