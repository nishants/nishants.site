app.controller("PortfolioController", ["$scope", "GridService", function($scope, GridService){
	var toTag = function(name){
		var tag = {
			name: name,
			selected: true,
			unselect: function () {
				tag.selected = false;
			}
		};
		return tag
	},
			names= function(tag){
				return tag.name;
			},
			unSelected = function(tag){
				return !tag.selected;
			};
	var tags = {
		list: GridService.tags.map(toTag),
		remove: function (index) {
			tags.list[index].unselect();
			GridService.showTags(tags.list.filter(unSelected).map(names));
		},
	};
	$scope.tags = tags;
}]);