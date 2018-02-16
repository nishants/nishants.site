app.controller("ScrollerController",["$scope", function($scope){
  var states = [
    {name: "zero"},
    {name: "one-sketch"},
    {name: "two-begin"},
    {name: "three-expand"},
    {name: "four-fill"},
  ];
  $scope.states = states;
  $scope.scroller = {};
}]);

var Scroller = {
  states : {
    current: null,
    all    : [],
    add: function(state){

    },
    start: function(){

    },
    _onScroll: function(){
      console.log("scrolled")
    }
  }
};
window.Scroller = Scroller;