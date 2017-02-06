(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var app = angular.module("timeline", []);
},{}],2:[function(require,module,exports){
angular.module("timeline").service("ProfileService", [function () {

	return {
		timeline: {
			positions: [
				{
					title: 'Technical Consultant',
					organisation: 'Freelance',
					description: 'Worked in different roles independently.',
					period  : {from: {year: 2015, month: 6}, to: {year: 2017, month: 2}},
					tags    : ["team leadership", "leadership", "freelance","coaching", "open source"],
					projects : [
						{
							title: 'Mphasis',
							description: 'Technical Coach',
							tech : ["ruby", "selenium", "jenkins"],
							tags : ["automation", "acceptance test", "atdd", "tdd", "bdd", "agile", "agile coach", "consulting", "scrum"],
							period  : {from: {year: 2015, month: 6}, to: {year: 2017, month: 2}},
						},
						{
							title: 'Agility Roots',
							description: 'Consultint Partner',
							tags : ["sales", "recruitment", "interview", "consulting", "automation", "acceptance test", "atdd", "tdd", "bdd", "agile", "agile coach", "consulting", "scrum"],
							tech : ["java", "angular", "ruby"],
							period  : {from: {year: 2015, month: 6}, to: {year: 2017, month: 2}},
						},
						{
							title: 'UI/UX Consultant',
							description: 'TookiTaki',
							tech : ["angularjs", "ruby", "angular", "facebook ads api", "scss"],
							tags : ["ux", "ui", "ui development", "frontend", "freelance","consulting", "design","ads" ,"online marketing"],
							period  : {from: {year: 2015, month: 6}, to: {year: 2017, month: 2}},
						}

					]
				},

				{
					title: 'Technical Consultant',
					description: 'Worked with some great cross functional teams.',
					organisation: 'ThoughtWorks',
					tags : ["consulting", "mentoring", "evolutionary design", "test driven development", "tdd"],
					period  : {from: {year: 2015, month: 6}, to: {year: 2017, month: 2}},
					projects : [
						{
							title: 'Caterpillar',
							description: 'Position',
							tags : [],
							tech : ["java", "angular", "scss", "micro services"],
							period  : {from: {year: 2015, month: 6}, to: {year: 2017, month: 2}},
						},
						{
							title: 'Health Care At Home',
							description: 'Position',
							period  : {from: {year: 2015, month: 6}, to: {year: 2017, month: 2}},
							tags : []
						},
						{
							title: 'UNICEF Uganda',
							description: 'Position',
							period  : {from: {year: 2015, month: 6}, to: {year: 2017, month: 2}},
							tags : []
						}

					]
				}

			]
		},
	};
}]);



},{}],3:[function(require,module,exports){
angular.module("timeline").controller("SearchController", ["$scope", "SearchService", function ($scope, SearchService) {

	$scope.search = SearchService;
}])
},{}],4:[function(require,module,exports){
angular.module("timeline").service("SearchService", [function () {
	var parse       = function(){},
			matches     = function(){},
			service = {
				query: "",
				items : [],
				result: [],
				index : function(taggedList){
					service.items = taggedList;
				},
				search: function (query) {
					service.result = service.items.filter(matches(parse(query)));
				}
			};

	return service;
}]);



},{}],5:[function(require,module,exports){
angular.module("timeline").controller("TimelineController", ["$scope","ProfileService", function ($scope, ProfileService) {
	$scope.timeline = ProfileService.timeline;
}])
},{}],6:[function(require,module,exports){
require("./app/app.js");
require("./app/timeline/timeline-controller");
require("./app/timeline/search/search");
require("./app/timeline/search/search-controller");
require("./app/timeline/profile-service");
},{"./app/app.js":1,"./app/timeline/profile-service":2,"./app/timeline/search/search":4,"./app/timeline/search/search-controller":3,"./app/timeline/timeline-controller":5}]},{},[6]);
