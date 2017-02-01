app.directive("slate", ["cardService", "modalService",function (cardService, modalService) {
	var $deckItems = function(){return $(".deck > li");},
			select = function (index) {
				var container = $($deckItems()[index]),
						offsetPadding = 10,
						offsetY = $(".deck").offset().top - container.offset().top,
						offsetX = $(".deck").offset().left - container.offset().left;

				container.css("transform", "translateY(" + (offsetY + offsetPadding) + "px)" + "translateX(" + (offsetX + offsetPadding) + "px)");
			},
			unSelect = function () {
				$deckItems().css("transform", "");
			};
	return {
		restrict: "C",
		scope: true,
		transclude: false,
		link: function (scope, element, attrs) {
			scope.deck = cardService;
			scope.$watch("deck.current", function (now, previous) {
				var cardSelected = now != -1,
						card = cardService.list[cardService.current],
						cardUnselected = previous != -1;

				cardSelected && select(now);
				cardUnselected && unSelect();
				card && modalService.show(card.src);
			});
		}
	};
}]);
