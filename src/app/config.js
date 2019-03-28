app.run(['$rootScope', function ($rootScope) {
  $rootScope.app = {
    state: {
      list : ["splash"],
      value: [],
      setState    : function(stateArray){},
      addState    : function(state){},
      removeState : function(state){},
    }
  };
}]);