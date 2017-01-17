app.controller("missionsController", ['$scope', 'helpService', 'missionsService', function($scope, helpService, missionsService){

  $scope.help = function(){
    return helpService.message(missionsService, {});
  };

}]);

