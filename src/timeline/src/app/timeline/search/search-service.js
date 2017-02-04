angular.module("timeline").service("SearchService", [function () {
	var matchPosition = function(query, position){
				return position.tags.indexOf(query) > -1;
			},
			service = {
				query: "",
				timeline : null,
				index : function(timeline){
					service.timeline = Object.assign({}, timeline) ;
				},
				search: function (query) {
					if(query && query.length){
						service.timeline.positions.forEach(function(position){
							position._hidden = !matchPosition(query, position);
						});
					}
				}
			};

	return service;
}]);


