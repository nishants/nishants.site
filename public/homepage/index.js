(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var app = angular.module("nishants", []);
app.run(["$timeout", "$rootScope", function($timeout, $rootScope){
	$timeout(function(){
		$rootScope.splash  = {close: true};
	}, 100);
}]);

$(document).ready(function(){

	var
			offset = 50,
			app = function(){
				return $("#nishants");
			},
			showOnTopBar = function (name, show) {
				var state = "show-" + name;
				show ? app().addClass(state) : app().removeClass(state);
			},
			isGone = function (element) {
				return element.getBoundingClientRect().top < 0;
			},
			isUnderTitleBar = function (element) {
				return element.getBoundingClientRect().top < ($(".top-bar").height() - offset);
			};

	$(window).on("scroll", function(){
		showOnTopBar("top-bar", 		isGone($(".intro  .profile-image")[0]));
		showOnTopBar("name", 				isUnderTitleBar($(".intro  .name")[0]));
		showOnTopBar("navigation", 	isGone($(".intro  .navigation")[0]));
	});

	setTimeout(function(){
		$(window).trigger("scroll");
	}, 500);
});
},{}],2:[function(require,module,exports){
require("./app/app.js");
},{"./app/app.js":1}]},{},[2]);
