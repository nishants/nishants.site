(function () {
  "use strict"

  var app = angular.module("slate", []);

	app.run(["$http", "cardService", function($http, cardService){
		$http.get("data/cards.json").then(cardService.load)
	}]);

	app.service("cardService",[function(){
		var cards = {
			current : -1,
			list: [],
			load: function (response) {
				cards.list = response.data.cards;
			}
		};
		return cards;
	}]);

  app.directive("slate", ["cardService",function (cardService) {
    var select = function (index) {
          var card = $($(".deck > li")[index]),
              offsetPadding = 10,
              offsetY = $(".deck").offset().top - card.offset().top,
              offsetX = $(".deck").offset().left - card.offset().left;

          card.css("transform", "translateY(" + (offsetY + offsetPadding) + "px)" + "translateX(" + (offsetX + offsetPadding) + "px)");
        },
        unSelect = function (index) {
          var card = $($(".deck > li")[index]);
          card.css("transform", "");
        };
    return {
      restrict: "C",
      scope: true,
      transclude: false,
      link: function (scope, element, attrs) {
        scope.deck = cardService;
        scope.$watch("deck.current", function (now, previous) {
          now != -1 && select(now);
          previous != -1 && unSelect(previous);
        });
      }
    };
  }]);

}).call(this);