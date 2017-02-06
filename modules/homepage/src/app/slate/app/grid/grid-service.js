app.service("GridService",["GRID_CONFIG", function(GRID_CONFIG){

	var setPosition = function($e, x, y){
				$e.css("left", x+"px");
				$e.css("top", y+"px");
			},
			presentIn = function(tags){
		return function(tag){
			return tags.indexOf(tag) != -1;
		};
	};

	var grid = {
		$e: null,
		tags: ["studio","lab"],
		colWidth: 0,
		load: function ($grid) {
			grid.$e 			= $grid;
			grid.colWidth = GRID_CONFIG.colWidth;
		},
		showTags: function (tags) {
			grid.tags = tags;
			grid.reload();
		},
		reload: function () {
			grid.$e.find(".grid-box").each(function(index, e){
				var $box 					= $(e),
						boxTags      	=  ($box.attr("data-tags") || "").split(" "),
						selectedByTag = !!boxTags.filter(presentIn(grid.tags)).length;
				selectedByTag ? $box.addClass("visible") : $box.removeClass("visible")
			});
			grid.arrange();
		},
		arrange: function () {
			var
					topOffset     = GRID_CONFIG.topOffset,
					marginX       = GRID_CONFIG.gridBoxMarginX,
					marginY       = GRID_CONFIG.gridBoxMarginY,
					columns       = [],
					columnCount   = Math.floor(grid.$e.width()/(grid.colWidth + 2 * GRID_CONFIG.gridBoxMarginX)),
					gridHeight    = 0,
					nextColumn    = 0,
					viewableBoxes = grid.$e.find(".grid-box.visible");

			for(var i = 0; i < columnCount; i++){
				columns[i] = {nexPosition: topOffset};
			}

			for(var i = 0; i < viewableBoxes.length; i++){
				var
						$box = $(viewableBoxes[i]),
						column = columns[nextColumn],
						x = nextColumn * (grid.colWidth +  marginX),
						y = column.nexPosition + marginY;

				setPosition($box, x, y);

				column.nexPosition += $box.height() + marginY;
				gridHeight          = Math.max(gridHeight, column.nexPosition);
				nextColumn          = (nextColumn + 1) % columnCount;
			}
			grid.$e.height(gridHeight);
		}
	};
	return grid;
}]);