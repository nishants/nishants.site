app.directive("deck", ["DeckService", "modalService",function (DeckService, modalService) {
	var $deckItems = function(){return $(".deck > li");},
			select = function (index) {
				var container = $($deckItems()[index]),
						offsetPaddingX = 0,
						offsetPaddingY = 0,
						offsetY = $(".deck").offset().top - container.offset().top,
						offsetX = $(".deck").offset().left - container.offset().left;

				container.css("transform", "translateY(" + (offsetY + offsetPaddingY) + "px)" + "translateX(" + (offsetX + offsetPaddingX) + "px)");
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
					modalService.show(card);
				} else{
					unSelect();
				}
			});
		}
	};
}]);
