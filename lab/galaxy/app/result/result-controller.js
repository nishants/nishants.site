app.controller("resultController", ['$scope', "resultService", function($scope, resultService){
  $scope.result = resultService;
  $scope.restart = function(){};
}]);