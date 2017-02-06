(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var app = angular.module("nishants", []);
app.run(["$timeout", "$rootScope", function($timeout, $rootScope){
	$timeout(function(){
		$rootScope.splash  = {close: true};
	}, 100);
}]);

$(document).ready(function(){

	var
			rowHeight = function(){
				return 20;
			},
			app = function(){
				return $("#nishants");
			},
			showTopBar = function (show) {
				show ? app().addClass("show-top-bar") : app().removeClass("show-top-bar");
			},
			showNameInTopBar = function (show) {
				show ? app().addClass("show-top-bar-name") : app().removeClass("show-top-bar-name");
			},
			showContactInTopBar = function (show) {
				show ? app().addClass("show-top-bar-contact") : app().removeClass("show-top-bar-contact");
			},
			showTitleInTopBar = function (show) {
				show ? app().addClass("show-top-bar-title") : app().removeClass("show-top-bar-title");
			},
			isGone = function (element) {
				return element.getBoundingClientRect().top < 0;
			},
			isUnderTitleBar = function (element, offset) {
				return element.getBoundingClientRect().top < $(".top-bar").height() - (offset || rowHeight());
			};

	$(document).on("scroll", function(){
		showTopBar(isGone($(".introduction")[0]));
		showNameInTopBar(isUnderTitleBar($(".introduction > .name")[0]));
		showTitleInTopBar(isUnderTitleBar($(".introduction > .title > .designation")[0]));
		showContactInTopBar(isUnderTitleBar($(".introduction > .contact")[0]), 50);
	});


});
},{}],2:[function(require,module,exports){
require("./app/app.js");
},{"./app/app.js":1}]},{},[2]);
