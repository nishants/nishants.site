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
				return element.getBoundingClientRect().top < ($(".top-bar > .background").height() - offset);
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