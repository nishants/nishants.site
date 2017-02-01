app.directive("slate", ["cardService",function (cardService) {
	var select = function (index) {
				var card = $($(".deck > li")[index]),
						offsetPadding = 10,
						offsetY = $(".deck").offset().top - card.offset().top,
						offsetX = $(".deck").offset().left - card.offset().left;

				card.css("transform", "translateY(" + (offsetY + offsetPadding) + "px)" + "translateX(" + (offsetX + offsetPadding) + "px)");
			},
			unSelect = function () {
				$(".deck > li").css("transform", "");
			};
	return {
		restrict: "C",
		scope: true,
		transclude: false,
		link: function (scope, element, attrs) {
			scope.deck = cardService;
			scope.$watch("deck.current", function (now, previous) {
				now != -1 && select(now);
				previous != -1 && unSelect();
			});
		}
	};
}]);
