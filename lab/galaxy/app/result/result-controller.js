app.controller("resultController", ['$scope', "resultService",  "$window", "missionsService", function($scope, resultService, $window, missionsService){
  $scope.result = resultService;
  $scope.playAgain = function(){
    missionsService.reset();
    resultService.reset();
  };
}]);