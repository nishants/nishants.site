app.service("DeckService",["$sce", function($sce){
	var
			createCard = function(card){
				card.src = $sce.trustAsResourceUrl(card.src);
				card.mobileOnly = card["mobile-only"];
				card.mobileFirst = card["mobile-first"];
				card.desktopFirst = card["desktop-first"];
				card.noMobile = card["no-mobile"];
				card.tagList = card.tags.map(function(tag){return tag.name;}).join(" ");
				return card;
			},
			deck = {
		_current : -1,
		_list: [],
		selected: function(){
			return deck._list[deck._current];
		},
		select: function(index){
			deck._current = index ;
		},
		unselect: function(){
			deck._current = -1;
		},
		load: function (response) {
			deck._list = response.data.cards.map(createCard);
		}
	};
	return deck;
}]);