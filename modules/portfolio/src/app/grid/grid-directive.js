app.directive("grid", ["GridService","GRID_CONFIG","$timeout", function (GridService, GRID_CONFIG, $timeout) {
	return {
		restrict   : "C",
		scope 	   : false,
		transclude : false,
		link: function () {
			var $grid 		= $(".grid").first();
			GridService.load($grid);
			$grid.on("DOMNodeInserted", function(){
				$timeout(GridService.reload, GRID_CONFIG.domUpdateDelay);
			});
			$(window).on("resize", GridService.arrange);
		}
	};
}]);
