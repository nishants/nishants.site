(function () {
  "use strict"

  var app = angular.module("slate", []);

	app.constant("IFRAMETIMEOUT", 250);

	app.run(["$http", "DeckService", "$rootScope", function($http, DeckService, $rootScope){
		$http.get("data/cards.json").then(DeckService.load)
		$rootScope.deck = DeckService;
	}]);
	window.app = app;

}).call(this);