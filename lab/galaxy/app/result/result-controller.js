app.controller("resultController", ['$scope', "resultService",  "$window", function($scope, resultService, $window){
  $scope.result = resultService;
  $scope.playAgain = function(){
    $window.location.reload();
  };

  window.$window = $window;
}]);