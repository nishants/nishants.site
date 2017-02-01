app.service("modalService",["DeckService", "$timeout", "IFRAMETIMEOUT",function(DeckService, $timeout, IFRAMETIMEOUT){
	var modal = {
		_show 	: false,
		_timer  : null,
		_frame   : {
			_ready 	: false,
			_src  	: null
		},
		show: function(src){
			modal._show = true;
			modal._timer = $timeout( function(){
				modal._frame._src = src;
			}, IFRAMETIMEOUT);
		},
		close: function(){
			modal._frame._ready = false;
			modal._frame._src  	= null;
			if(modal._timer){
				$timeout.cancel(modal._timer);
			}
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