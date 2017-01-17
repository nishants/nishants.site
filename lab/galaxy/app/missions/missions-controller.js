app.controller("missionsController", ['$scope', 'helpService', 'missionsService', function($scope, helpService, missionsService){
  $scope.missions = missionsService;
  $scope.help = helpService;

}]);

