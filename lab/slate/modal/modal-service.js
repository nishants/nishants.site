app.service("modalService",["DeckService",function(DeckService){
	var modal = {
		_show: false,
		_src : null,
		show: function(src){
			modal._show = true;
			modal._src = src;
		},
		close: function(){
			DeckService.unselect();
		}
	};
	return modal;
}]);