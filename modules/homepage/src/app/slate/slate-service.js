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

	var loadUrl = function(){
		console.log("State : " + url.split("/")[1]);
	}
	$(window).on("hashchange", function () {
		window.location.hash.length ?  loadUrl(window.location.hash) : init();
	});

	$(window).trigger("hashchange");

	return slate;
}]);