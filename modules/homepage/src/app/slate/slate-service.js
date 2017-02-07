angular.module("nishants").service("SlateService",["GridService", function(GridService){
	var allTags = ["design","development", "coaching"];

	var slate = {
		tags     : allTags,
		refresh  : function(){
			GridService.showTags(slate.tags);
		},
		show     : function(tag){
			if(!slate.tags.includes(tag)){
				slate.tags.push(tag);
				slate.refresh();
			}
		},
		hide     : function(tag){
			slate.tags.splice(slate.tags.indexOf(tag), 1);
			slate.refresh();
		}
	};
	return slate;
}]);