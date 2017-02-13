angular.module("timeline").controller("SearchController", ["$scope", "SearchService", function ($scope, SearchService) {

	$scope.search = SearchService;
}])