var app = angular.module("nishants", ["slate", "timeline"]);

$(document).ready(function(){

	var
			offset = 50,
			footerOffset = function(){
				return $("#footer")[0].getBoundingClientRect().top;
			},
			lastScrollOffset = footerOffset(),
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
		var offset      = footerOffset(),
				goingDown   =  lastScrollOffset < offset;
		lastScrollOffset = offset;

		goingDown ? $("#nishants").addClass("scrolling-down") : $("#nishants").removeClass("scrolling-down")

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

