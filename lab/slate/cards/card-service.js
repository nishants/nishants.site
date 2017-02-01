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