angular.module("timeline").controller("TimelineController", ["$scope","ProfileService", function ($scope, ProfileService) {
	$scope.timeline = ProfileService.timeline;
}])