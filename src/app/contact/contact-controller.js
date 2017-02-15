angular.module("nishants").controller("ContactController", ["$scope","CONTACT_CONFIG", function ($scope, CONTACT_CONFIG) {
	$scope.message = CONTACT_CONFIG;
}])