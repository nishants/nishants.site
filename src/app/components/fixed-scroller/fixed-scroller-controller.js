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

require("./scroller");