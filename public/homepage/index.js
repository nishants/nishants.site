(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var app = angular.module("nishants", []);
app.run(["$timeout", "$rootScope", function($timeout, $rootScope){
	$timeout(function(){
		$rootScope.splash  = {close: true};
	}, 300);
}]);

$(document).ready(function(){
	var	setScroll = function(){
				var
						$scrollable 		 = $(".scroll-container").first(),
						viewPortHeight   = $scrollable.height(),
						height 					 = $scrollable[0].scrollHeight,
						scrollTop        = $scrollable.scrollTop(),
						maxScrollTop     = height - viewPortHeight,
						scrollProgress   = scrollTop/maxScrollTop,
						$pointer         = $(".scroll-bar > .progress").first(),
						pointerHeight    = $pointer.height(),
						offset 				   = scrollProgress * (viewPortHeight - pointerHeight);

				$(".scroll-bar > .progress").css("transform", "translateY("+offset+"px)");
				console.log("Progerss :  " + scrollProgress)
				console.log("offset :  " + offset)
			};

	$(".scroll-container").on("scroll", setScroll);
	$(window).on("resize", setScroll);
});
},{}],2:[function(require,module,exports){
require("./app/app.js");
},{"./app/app.js":1}]},{},[2]);
