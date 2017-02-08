angular.module("nishants").run(["$timeout", "$rootScope", function($timeout, $rootScope){
	$timeout(function(){
		$rootScope.splash  = {close: true};
	}, 100);
}]);

angular.module("nishants").run(["GridService", "$timeout", function(GridService, $timeout){
	var allTags = ["design","development", "coaching"];

	var parse = function (query) {
				var args  	 = query.split("="),
						argIndex = args.indexOf("tags") + 1,
						tags  	 = argIndex > 0 ? args[argIndex].split("_") : allTags;

				console.log("State : " + tags);
				$timeout(function(){
					document.getElementById("slate").scrollIntoView();
					GridService.showTags(tags);
				});

			},
			showAll = function(){
				GridService.showTags(allTags);
			},
			init = function () {};
	$(window).on("hashchange", function () {
		var hash     = window.location.hash,
				hasQuery = hash.length && (hash.indexOf("?") > -1);
		hasQuery ?  parse(hash.split("?")[1]) : showAll();
		console.log("URL : " + window.location);
	});

	$(window).trigger("hashchange");
}]);
