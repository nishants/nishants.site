var app = angular.module("nishants", []);
app.run(["$timeout", "$rootScope", function($timeout, $rootScope){
	$timeout(function(){
		$rootScope.splash  = {close: true};
	}, 100);
}]);

$(document).ready(function(){

	var
			offset =60,
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
				return element.getBoundingClientRect().top < $(".top-bar").height() - (offset);
			};

	$('.scroll-container').on("scroll", function(){
		showOnTopBar("top-bar", 		isGone($(".intro  .profile-image")[0]));
		showOnTopBar("name", 				isUnderTitleBar($(".intro  .name")[0]));
		showOnTopBar("design", 			isUnderTitleBar($(".intro  .navigation .design")[0]));
		showOnTopBar("development", isUnderTitleBar($(".intro  .navigation .development")[0]));
		showOnTopBar("coaching",		isUnderTitleBar($(".intro  .navigation .coaching")[0]));
		showOnTopBar("experience", 	isUnderTitleBar($(".intro  .navigation .experience")[0]));
		showOnTopBar("connect", 		isUnderTitleBar($(".intro  .navigation .connect")[0]));

	});


});