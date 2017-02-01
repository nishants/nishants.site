app.service("modalService",[function(){
	var modal = {
		_show: false,
		_src : null,
		show: function(src){
			modal._show = true;
			modal._src = src;
		}
	};
	return modal;
}]);