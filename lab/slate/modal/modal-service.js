app.service("modalService",["DeckService", "$timeout",function(DeckService, $timeout){
	var modal = {
		_show 	: false,
		_frame   : {
			_ready 	: false,
			_src  	: null
		},
		show: function(src){
			modal._show = true;
			modal._frame._src = src;
		},
		close: function(){
			modal._frame._ready = false;
			modal._frame._src  	= null;
			DeckService.unselect();
		},
		ready: function(){
			modal._frame._ready = !!modal._frame._src;
		}
	};
	window.iframeLoaded = function(){
		$timeout(modal.ready);
	};
	return modal;
}]);