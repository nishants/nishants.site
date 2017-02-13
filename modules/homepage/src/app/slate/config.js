app.run(["$http", "DeckService", "$rootScope", function($http, DeckService, $rootScope){
	$http.get("public/data/cards.json").then(DeckService.load)
	$rootScope.deck = DeckService;
}]);