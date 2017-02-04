angular.module("timeline").service("SearchService", [function () {
	var parse       = function(query){
				return query;
			},
			matches     = function(matcher){
				return function(){
					return true
				};
			},
			service = {
				query: "",
				timeline : null,
				index : function(timeline){
					service.timeline = timeline;
				},
				search: function (query) {

				}
			};

	return service;
}]);


