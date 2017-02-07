(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var app = angular.module("nishants", ["slate"]);
app.run(["$timeout", "$rootScope", function($timeout, $rootScope){
	$timeout(function(){
		$rootScope.splash  = {close: true};
	}, 100);
}]);

$(document).ready(function(){

	var
			offset = 50,
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
			}
			isUnderTitleBar = function (element) {
				return element.getBoundingClientRect().top < ($(".top-bar > .background").height() - offset);
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
	});

	setTimeout(function(){
		$(window).trigger("scroll");
	}, 500);
});
},{}],2:[function(require,module,exports){
window.app = angular.module("slate", []);
},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
app.run(["$http", "DeckService", "$rootScope", function($http, DeckService, $rootScope){
	$http.get("public/data/cards.json").then(DeckService.load)
	$rootScope.deck = DeckService;
}]);
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
app.service("GridService",["GRID_CONFIG", function(GRID_CONFIG){

	var setPosition = function($e, x, y){
				var transformation = "translateX(<x>px) translateY(<y>px)".replace("<x>", x).replace("<y>", y);
				$e.css("transform", transformation);
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
			grid.$e.height(gridHeight);
		}
	};
	return grid;
}]);
},{}],9:[function(require,module,exports){
app.controller("modalController",["$scope", "modalService", function($scope, modalService){
	$scope.modal = modalService;
}]);
},{}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
app.constant("IFRAMETIMEOUT", 250);

app.constant("GRID_CONFIG", {
	topOffset: 85,
	colWidth : 325,
	gridBoxMarginX: -1, // To overlap borders
	gridBoxMarginY: -1, // To overlap borders
	domUpdateDelay: 500
});
},{}],12:[function(require,module,exports){
require("./app/app.js");
require("./app/variables.js");
require("./app/config.js");

require('./app/app.js')
require('./app/deck/deck.js')
require('./app/deck/deck-service.js')
require('./app/modal/modal-service.js')
require('./app/modal/modal-controller.js')
require('./app/grid/grid-directive.js')
require('./app/grid/grid-service.js')
require('./app/components/scroll.js')

},{"./app/app.js":2,"./app/components/scroll.js":3,"./app/config.js":4,"./app/deck/deck-service.js":5,"./app/deck/deck.js":6,"./app/grid/grid-directive.js":7,"./app/grid/grid-service.js":8,"./app/modal/modal-controller.js":9,"./app/modal/modal-service.js":10,"./app/variables.js":11}],13:[function(require,module,exports){
require("./app/slate/slate.js");
require("./app/app.js");

},{"./app/app.js":1,"./app/slate/slate.js":12}]},{},[13]);
