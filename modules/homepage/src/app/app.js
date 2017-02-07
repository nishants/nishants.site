var app = angular.module("nishants", ["slate"]);
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
			setState = function (name, show) {
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
		setState("top-bar", 		isGone($(".intro  .profile-image")[0]));
		setState("name", 				isUnderTitleBar($(".intro  .name")[0]));

		setState("navigation"	,   isUnderTitleBar($(".intro  .navigation")[0]));
		setState("design"	    , 	isUnderTitleBar($(".intro  .navigation > .design")[0]));
		setState("connect"	  , 	isUnderTitleBar($(".intro  .navigation > .connect")[0]));
		setState("experience" , 	isUnderTitleBar($(".intro  .navigation > .experience")[0]));
		setState("development", 	isUnderTitleBar($(".intro  .navigation > .development")[0]));
		setState("coaching"   , 	isUnderTitleBar($(".intro  .navigation > .coaching")[0]));
		setState("slate"      , 	isUnderTitleBar($("#slate")[0]));
	});

	setTimeout(function(){
		$(window).trigger("scroll");
	}, 500);
});