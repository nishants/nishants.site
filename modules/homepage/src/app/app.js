var app = angular.module("nishants", []);
app.run(["$timeout", "$rootScope", function($timeout, $rootScope){
	$timeout(function(){
		$rootScope.splash  = {close: true};
	}, 3000);
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
			};

	$(".scroll-container").on("scroll", setScroll);
	$(window).on("resize", setScroll);
});