(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var app = angular.module("nishants", ["slate", "timeline"]);

$(document).ready(function(){

	var
			offset = 50,
			titleBarHeight = function(){return 108;},
			app = function(){
				return $("#nishants");
			},
			setState = function (name, show) {
				var state = "show-" + name;
				show ? app().addClass(state) : app().removeClass(state);
			},
			isGone = function (element) {
				return element.getBoundingClientRect().top < 0;
			},

			ifIssUnderTitleBar = function (offset, element) {
				return element.getBoundingClientRect().top < ($(".top-bar > .background").height() - offset);
			},
			isUnderTitleBar = function (element) {
				return element.getBoundingClientRect().top < ($(".top-bar > .background").height() - offset);
			},
			viewingExperience = function () {
				var underTitleBar = ifIssUnderTitleBar(0, $(".timeline .timeline-header")[1]),
						hasPassedOver = ifIssUnderTitleBar(-100, $("#timeline-ends")[0]);
				return underTitleBar && !hasPassedOver;
			},
			unreadAllExperience = function(){
				$(".timeline-body > .period-list > li.period").removeClass("reading");
			},
			stickExperienceAt = function(index){
				var stickyList =  $(".timeline-body > .period-list").first().find(" > li.period"),
						scrollList =  $(".timeline-body > .period-list").last().find(" > li.period");
				unreadAllExperience();
				$(stickyList[index]).addClass("reading");
				$(scrollList[index]).addClass("reading");
			};

	$(window).on("scroll", function(){
		setState("top-bar", 		isGone($(".intro  .profile-image")[0]));
		setState("name", 				isUnderTitleBar($(".intro  .name")[0]));

		setState("navigation"	,   ifIssUnderTitleBar(20,$(".intro  .navigation > .design")[0]));
		setState("design"	    , 	ifIssUnderTitleBar(20,$(".intro  .navigation > .design")[0]));
		setState("connect"	  , 	ifIssUnderTitleBar(20,$(".intro  .navigation > .connect")[0]));
		setState("experience" , 	ifIssUnderTitleBar(20,$(".intro  .navigation > .experience")[0]));
		setState("development", 	ifIssUnderTitleBar(20,$(".intro  .navigation > .development")[0]));
		setState("coaching"   , 	ifIssUnderTitleBar(20,$(".intro  .navigation > .coaching")[0]));
		setState("slate"      , 	ifIssUnderTitleBar(20,$("#slate")[0]));
		setState("social"     , 	ifIssUnderTitleBar(-10,$(".intro  ul.contact.social")[0]));



		var show = viewingExperience();
		setState("stick-experience"  , 	show);
		if(show){
			var stickyHeaderBottom = 156,
					reading = function(e){
						var topOverSticky       = e.getBoundingClientRect().top < stickyHeaderBottom ,
								bottomBelowSticky   = e.getBoundingClientRect().bottom > stickyHeaderBottom ;
						return topOverSticky && bottomBelowSticky
					};
			var readingIndex = -1;
			$(".timeline-body").last().find(".period-list > li.period").toArray().forEach(function(period, index){
				reading(period) ? readingIndex = index : "";
			});
			stickExperienceAt(readingIndex);
		}else{
			unreadAllExperience()
		}
	});

	setTimeout(function(){
		$(window).trigger("scroll");
	}, 500);
});


},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
angular.module("nishants").controller("ContactController", ["$scope","CONTACT_CONFIG", function ($scope, CONTACT_CONFIG) {
	$scope.message = CONTACT_CONFIG;
}])
},{}],4:[function(require,module,exports){
window.app = angular.module("slate", []);
},{}],5:[function(require,module,exports){
app.directive("scrollTarget", [function () {

	return {
		restrict  : "C",
		scope 		: false,
		transclude: false,
		link: function (element) {
			var scrollListener 	= $(".scroll-listener"),
					reading = function () {
						scrollListener.addClass("reading");
					},
					navigating = function () {
						scrollListener.removeClass("reading");
					},
					lastScrollTop = 0,
					readingOffset = 50;

			var scrollTarget = $(".deck").first();
			scrollTarget.on("scroll", function () {
				var scollableContent = $(this),
						scrollTop = scollableContent.scrollTop(),
						nearTop = scrollTop < readingOffset,
						scrollingDown = scrollTop - lastScrollTop > 0;

				(!nearTop && scrollingDown) ? reading() : navigating();
				lastScrollTop = scrollTop;
			});

		}
	};
}]);

},{}],6:[function(require,module,exports){
app.run(["$http", "DeckService", "$rootScope", function($http, DeckService, $rootScope){
	$http.get("public/data/cards.json").then(DeckService.load)
	$rootScope.deck = DeckService;
}]);
},{}],7:[function(require,module,exports){
app.service("DeckService",["$sce", function($sce){
	var
			createCard = function(card){
				card.src = $sce.trustAsResourceUrl(card.src);
				card.mobileOnly = card["mobile-only"];
				card.mobileFirst = card["mobile-first"];
				card.desktopFirst = card["desktop-first"];
				card.noMobile = card["no-mobile"];
				card.tagList = card.tags.map(function(tag){return tag.name;}).join(" ");
				return card;
			},
			deck = {
		_current : -1,
		_list: [],
		selected: function(){
			return deck._list[deck._current];
		},
		select: function(index){
			deck._current = index ;
		},
		unselect: function(){
			deck._current = -1;
		},
		load: function (response) {
			deck._list = response.data.cards.map(createCard);
		}
	};
	return deck;
}]);
},{}],8:[function(require,module,exports){
app.directive("deck", ["DeckService", "modalService",function (DeckService, modalService) {
	var $deckItems = function(){return $(".deck > li");},
			select = function (index) {
				var container = $($deckItems()[index]),
						offsetPaddingX = 0,
						offsetPaddingY = 0,
						containerScrollOffset = $(".deck")[0].getBoundingClientRect().top,
						offsetY = $(".deck").offset().top - container.offset().top - containerScrollOffset,
						offsetX = -container.offset().left;

				container.find("> .wrapper").first().css("transform", "translateY(" + (offsetY + offsetPaddingY) + "px)" + "translateX(" + (offsetX + offsetPaddingX) + "px)");
			},
			unSelect = function () {
				$(".deck > li > .wrapper").css("transform", "");
			};
	return {
		restrict: "C",
		scope: false,
		transclude: false,
		link: function (scope, element, attrs) {
			scope.$watch("deck._current", function () {
				var card = DeckService.selected(),
						now  = scope.deck._current;
				if(card){
					select(now);
					modalService.show(card);
				} else{
					unSelect();
				}
			});
			$(window).on('resize', function(){

			});
		}

	};
}]);

},{}],9:[function(require,module,exports){
app.directive("grid", ["GridService","GRID_CONFIG","$timeout", function (GridService, GRID_CONFIG, $timeout) {
	return {
		restrict   : "C",
		scope 	   : false,
		transclude : false,
		link: function () {
			var $grid 		= $(".grid").first();
			GridService.load($grid);
			$grid.on("DOMNodeInserted", function(){
				$timeout(GridService.reload, GRID_CONFIG.domUpdateDelay);
			});
			$(window).on("resize", GridService.arrange);
		}
	};
}]);

},{}],10:[function(require,module,exports){
app.service("GridService",["GRID_CONFIG", function(GRID_CONFIG){

	var transform = function(x,y){
				return "translateX(<x>) translateY(<y>)".replace("<x>", x).replace("<y>", y);
			},
			setPosition = function($e, x, y){
				$e.css("transform", transform(x+"px",y+"px"));
			},
			presentIn = function(tags){
		return function(tag){
			return tags.indexOf(tag) != -1;
		};
	};

	var grid = {
		$e: null,
		tags: ["design","development", "coaching"],
		colWidth: 0,
		load: function ($grid) {
			grid.$e 			= $grid;
			grid.colWidth = GRID_CONFIG.colWidth;
		},
		showTags: function (tags) {
			grid.tags = tags;
			grid.reload();
		},
		reload: function () {
			if(!grid.$e){
				// loading url before grid directive is initialized.
				return setTimeout(grid.reload,GRID_CONFIG.domUpdateDelay);
			}
			grid.$e.find(".grid-box").each(function(index, e){
				var $box 					= $(e),
						boxTags      	=  ($box.attr("data-tags") || "").split(" "),
						selectedByTag = !!boxTags.filter(presentIn(grid.tags)).length;
				selectedByTag ? $box.addClass("visible") : $box.removeClass("visible")
			});
			grid.arrange();
		},
		arrange: function () {
			var
					topOffset     = GRID_CONFIG.topOffset,
					marginX       = GRID_CONFIG.gridBoxMarginX,
					marginY       = GRID_CONFIG.gridBoxMarginY,
					columns       = [],
					columnCount   = Math.floor(grid.$e.width()/(grid.colWidth + 2 * GRID_CONFIG.gridBoxMarginX)),
					gridHeight    = 0,
					nextColumn    = 0,
					centerAlignOffset= (grid.$e.width()%(grid.colWidth + 2 * GRID_CONFIG.gridBoxMarginX))/2,
					viewableBoxes = grid.$e.find(".grid-box.visible");

			for(var i = 0; i < columnCount; i++){
				columns[i] = {nexPosition: topOffset};
			}

			for(var i = 0; i < viewableBoxes.length; i++){
				var
						$box = $(viewableBoxes[i]),
						column = columns[nextColumn],
						x = nextColumn * (grid.colWidth +  marginX),
						y = column.nexPosition + marginY;

				setPosition($box, x + centerAlignOffset, y);

				column.nexPosition += $box.height() + marginY;
				gridHeight          = Math.max(gridHeight, column.nexPosition);
				nextColumn          = (nextColumn + 1) % columnCount;
			}
			grid.$e.height() < gridHeight ? grid.$e.height(gridHeight) : "";
		}
	};
	return grid;
}]);
},{}],11:[function(require,module,exports){
app.controller("modalController",["$scope", "modalService", function($scope, modalService){
	$scope.modal = modalService;
}]);
},{}],12:[function(require,module,exports){
app.service("modalService",["DeckService", "$timeout", "IFRAMETIMEOUT",function(DeckService, $timeout, IFRAMETIMEOUT){
	var modal = {
		_show 	: false,
		_timer  : null,
		_card   : null,
		mobile : function(mobile){
			modal._mobile = mobile;
		},
		_frame   : {
			_ready 	: false,
			_src  	: null,
			_fullscreen: false,
			fullscren: function(fullscreen){
				modal._frame._fullscreen = fullscreen;
			}
		},
		show: function(card){
			modal.props = card;
			modal._show = true;
			modal.mobile(card.mobileOnly || card.mobileFirst);
			modal._timer = $timeout( function(){
				modal._frame._src = card.src;
			}, IFRAMETIMEOUT);
		},
		close: function(){
			modal._frame._ready = false;
			modal._frame._src  	= null;
			if(modal._timer){
				$timeout.cancel(modal._timer);
			}
			DeckService.unselect();
		},
		ready: function(){
			modal._frame._ready = !!modal._frame._src;
		}
	};
	window.iframeLoaded = function(){
		$timeout(modal.ready);
	};
	return modal;
}]);
},{}],13:[function(require,module,exports){
app.constant("IFRAMETIMEOUT", 250);

app.constant("GRID_CONFIG", {
	topOffset: 85,
	colWidth : 325,
	gridBoxMarginX: -1, // To overlap borders
	gridBoxMarginY: -1, // To overlap borders
	domUpdateDelay: 500
});
},{}],14:[function(require,module,exports){
angular.module("nishants").service("SlateService",["GridService", "$timeout", function(GridService, $timeout){




	return {};
}]);
},{}],15:[function(require,module,exports){
angular.module("timeline").service("ProfileService", [function () {

	return {
		timeline: {
			positions: [
				{
					title: 'Technical Consultant',
					organisation: 'Freelancer',
					description: 'Worked in different roles independently.',
					logo : "public/images/profile.jpg",
					period  : {from: {year: 2015, month: 6}},
					tags    : ["team leadership", "leadership", "freelance","coaching", "open source"],
					projects : [
						{
							title: 'Mphasis Bangalore',
							logo : "public/images/logos/mphasis.jpg",
							description: 'Coaching and consulting for introducing Acceptance Test Driven Development for a specific account.',
							tags : [],
							tech : ["java", "angular", "scss", "micro services"],
							period  : {from: {year: 2016, month: "May"}, to: {year: 2016, month: "Jan"}},
						},
						{
							title: 'Agility Roots',
							logo : "public/images/logos/agilityroots.png",
							description: 'Worked independently with client evangelizing Acceptance Test Driven Development.',
							tags : [],
							tech : ["java", "angular", "scss", "micro services"],
							period  : {from: {year: 2016, month: "Feb"}}
						},
						{
							title: 'TookiTaki',
							logo : "public/images/logos/tookitaki.png",
							description: 'UX/UI improvement for online ad management platform.',
							tags : [],
							tech : ["java", "angular", "scss", "micro services"],
							period  : {from: {year: 2015, month: "July"}, to: {year: 2015, month: "Dec"}},
						},

					]
				},

				{
					title: 'Technical Coach',
					description: 'Worked with some great cross functional teams.',
					organisation: 'Xebia',
					color: "#6c1d5f",
					logo : "public/images/logos/xebia.png",
					tags : ["consulting", "mentoring", "evolutionary design", "test driven development", "tdd"],
					period  : {from: {year: 2014, month: "Oct"}, to: {year: 2015, month: "June"}},
					projects : [
						{
							title: 'Societe Generale Bangalore',
							logo : "public/images/logos/sg.png",
							description: 'Coaching teams on programming practices, like test driven development, refactoring, testing strategy.',
							tags : [],
							tech : ["java", "angular", "scss", "micro services"],
							period  : {from: {year: 2014, month: "Nov"}, to: {year: 2015, month: "June"}},
						}]
				},

				{
					title: 'Technical Consultant',
					description: 'Worked with some great cross functional teams.',
					organisation: 'ThoughtWorks',
					color: "#1bbed0",
					logo : "public/images/logos/tw.png",
					tags : ["consulting", "mentoring", "evolutionary design", "test driven development", "tdd"],
					period  : {from: {year: 2012, month: "Nov"}, to: {year: 2014, month: "Oct"}},
					projects : [
						{
							title: 'Caterpillar',
							logo : "public/images/logos/caterpillar.jpeg",
							description: 'Single-platform to manage parts sales commercials, across their global distribution network of dealers.',
							tags : [],
							tech : ["java", "angular", "scss", "micro services"],
							period  : {from: {year: 2012, month: "Sep"}, to: {year: "2014", month: "Oct"}},
						},
						{
							title: 'Health Care At Home',
							logo : "public/images/logos/hcah.jpg",
							description: 'Mobile webapp for a Delhi based health startup. App helped nurses to collect data and generate reports on patients.',
							period  : {from: {year: 2012, month: "April"}, to: {year: 2012, month: "Sep"}},
							tags : []
						},
						{
							title: 'UNICEF Uganda',
							logo : "public/images/logos/unicef.jpeg",
							description: 'System Integration(MTrack with DHIS2), and consolidating data on health care providers throughout the country.',
							period  : {from: {year: 2011, month: "Dec"}, to: {year: 2012, month: "April"}},
							tags : []
						}

					]
				},
				{
					title: 'Application Developer',
					description: '',
					organisation: 'Oracle',
					color: "#f80000",
					logo : "public/images/logos/oracle.png",
					tags : [],
					period  : {from: {year: 2012, month: "June"}, to: {year: 2012, month: "Nov"}},
					projects : [
						{
							title: 'Flexcube Core Development Team',
							logo : "public/images/logos/flexcube.jpeg",
							description: "Worked in the core development team of Oracle's banking platform",
							tags : [],
							tech : ["java", "angular", "scss", "micro services"],
							period  : {from: {year: 2014, month: "Nov"}, to: {year: 2015, month: "June"}},
						}
					]
				},
				{
					title: 'System Engineer',
					description: '',
					organisation: 'Infosys',
					color: "#017cc3",
					logo : "public/images/logos/infosys.png",
					tags : [],
					period  : {from: {year: 2012, month: "June"}, to: {year: 2012, month: "Nov"}},
					projects : [
						{
							title: 'Archive and Purge Automation',
							logo : "public/images/logos/automate.png",
							description: "Wrote a java tool to automate my teams daily workflow. Later rewrote it in PL/SQL. It was adopted by Team as the official tool.",
							tags : [],
							tech : ["java", "angular", "scss", "micro services"],
							period  : {from: {year: 2014, month: "Nov"}, to: {year: 2015, month: "June"}},
						},
						{
							title: 'Support Engineer',
							logo : "public/images/logos/oracledb.png",
							description: 'Support for oracle apps backend for Arrow.',
							tags : [],
							tech : ["java", "angular", "scss", "micro services"],
							period  : {from: {year: 2014, month: "Nov"}, to: {year: 2015, month: "June"}},
						}
					]
				}
			]
		},
	};
}]);



},{}],16:[function(require,module,exports){
angular.module("timeline").controller("SearchController", ["$scope", "SearchService", function ($scope, SearchService) {

	$scope.search = SearchService;
}])
},{}],17:[function(require,module,exports){
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



},{}],18:[function(require,module,exports){
angular.module("timeline").controller("TimelineController", ["$scope","ProfileService", function ($scope, ProfileService) {
	$scope.timeline = ProfileService.timeline;
}])
},{}],19:[function(require,module,exports){
var app = angular.module("timeline", []);
},{}],20:[function(require,module,exports){
angular.module("nishants").constant("CONTACT_CONFIG", {
	email  : "nishant.singh87@gmail.com",
	subject: "Hi !",
	body   : ""
});

},{}],21:[function(require,module,exports){
require("./app/slate/app/app.js");
require("./app/slate/app/variables.js");
require("./app/slate/app/config.js");
require('./app/slate/app/app.js');
require('./app/slate/app/deck/deck.js');
require('./app/slate/app/deck/deck-service.js');
require('./app/slate/app/modal/modal-service.js');
require('./app/slate/app/modal/modal-controller.js');
require('./app/slate/app/grid/grid-directive.js');
require('./app/slate/app/grid/grid-service.js');
require('./app/slate/app/components/scroll.js');

require("./app/timeline/timeline.js");
require("./app/timeline/timeline-controller");
require("./app/timeline/search/search-service");
require("./app/timeline/search/search-controller");
require("./app/timeline/profile-service");

require("./app/app.js");
require("./app/config.js");
require("./app/variables");
require("./app/slate/slate-service");
require("./app/contact/contact-controller");

},{"./app/app.js":1,"./app/config.js":2,"./app/contact/contact-controller":3,"./app/slate/app/app.js":4,"./app/slate/app/components/scroll.js":5,"./app/slate/app/config.js":6,"./app/slate/app/deck/deck-service.js":7,"./app/slate/app/deck/deck.js":8,"./app/slate/app/grid/grid-directive.js":9,"./app/slate/app/grid/grid-service.js":10,"./app/slate/app/modal/modal-controller.js":11,"./app/slate/app/modal/modal-service.js":12,"./app/slate/app/variables.js":13,"./app/slate/slate-service":14,"./app/timeline/profile-service":15,"./app/timeline/search/search-controller":16,"./app/timeline/search/search-service":17,"./app/timeline/timeline-controller":18,"./app/timeline/timeline.js":19,"./app/variables":20}]},{},[21]);
