app.directive("gameProgress", ["missionsService", function(missionsService){

  var states = {
    4: "zero",
    3: "one",
    2: "two",
    1: "three",
    0: "four",
  };

  return {
    restrict: "C",
    scope   : true,
    link : function(scope, element, attrs){

      scope.progress = {state: states[missionsService.remaining()]};

      scope.$watch(function(){
        return missionsService.remaining();
      }, function(value){
        scope.progress.state = states[value];
      });

    }
  };
}]);