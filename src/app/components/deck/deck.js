app.directive("deck", ["DeckService", "modalService",function (DeckService, modalService) {
	var $deckItems = function(){return $(".deck > li");},
			select = function (index) {
				var container = $($deckItems()[index]),
						offsetPaddingX = 0,
						offsetPaddingY = 0,
						containerScrollOffset = $(".deck")[0].getBoundingClientRect().top,
						offsetY = $(".deck").offset().top - container.offset().top - containerScrollOffset,
						offsetX = -container.offset().left;

				container.find("> .wrapper").first().css("transform", "translateY(" + (offsetY + offsetPaddingY) + "px)" + "translateX(" + (offsetX + offsetPaddingX) + "px)");
			},
			unSelect = function () {
				$(".deck > li > .wrapper").css("transform", "");
			};
	return {
		restrict: "C",
		scope: false,
		transclude: false,
		link: function (scope, element, attrs) {
			scope.$watch("deck._current", function () {
				var card = DeckService.selected(),
						now  = scope.deck._current;
				if(card){
					select(now);
					modalService.show(card);
				} else{
					unSelect();
				}
			});
			$(window).on('resize', function(){

			});
		}

	};
}]);
