app.service("DeckService",["$sce", function($sce){
	var
			createCard = function(card){
				card.src = $sce.trustAsResourceUrl(card.src);
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