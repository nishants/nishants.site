(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.app = angular.module("nishants.site", []);

require("./components/fixed-scroller/fixed-scroller-controller");
},{"./components/fixed-scroller/fixed-scroller-controller":2}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
require("./app/app");
//require("./app/variables");
//require("./app/config");
//require("./app/routes");
//require("./app/components/viewport-safari-fix");
//require("./app/components/forms/drop-down");
//require("./app/components/throttle");
//require("./app/components/state-loader/state-loader");
//require("./app/components/typewriter/typewriter");

},{"./app/app":1}]},{},[3]);
