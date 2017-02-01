(function () {
  "use strict"

  var app = angular.module("slate", []);

	app.run(["$http", "cardService", function($http, cardService){
		$http.get("data/cards.json").then(cardService.load)
	}]);
	window.app = app;

}).call(this);