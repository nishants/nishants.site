app.directive("deck", ["DeckService", "modalService",function (DeckService, modalService) {
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
			scope.$watch("deck._current", function (now, previous) {
				var card = DeckService.selected();
				if(card){
					select(now);
					modalService.show(card.src);
				} else{
					unSelect();
				}
			});
		}
	};
}]);
