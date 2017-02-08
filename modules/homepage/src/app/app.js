var app = angular.module("nishants", ["slate", "timeline"]);

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
			},
			isUnderTitleBar = function (element) {
				return element.getBoundingClientRect().top < ($(".top-bar > .background").height() - offset);
			},
			viewingExperience = function () {
				var underTitleBar = ifIssUnderTitleBar(0, $(".timeline .timeline-header")[1]),
						hasPassedOver = ifIssUnderTitleBar(-100, $("#timeline-ends")[0]);
				return underTitleBar && !hasPassedOver;
			},
			currentExperienceIndex = function() {
				var topBarHeight    = 108,
						sectionOffset   = 50,
						selectionOffset = topBarHeight + sectionOffset,
						unSelectionOffset = 122,
						list = $(".timeline-body").last().find(".period-list > li").toArray().reverse(),
						index ;

				for(var i =0; i < list.length; i++ ){
					var e = list[i],
							isUnderTitleBar = e.getBoundingClientRect().top < selectionOffset,
							isPassingBy = $(e).find(".card:last-child");
					if(isUnderTitleBar){
						index = i;
						break;
					}
				}
				return list.length - index -1;
			},
			stickExperienceAt = function(index){
				console.log("Reading Exp at" + index)
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
			stickExperienceAt(currentExperienceIndex());

		}
	});

	setTimeout(function(){
		$(window).trigger("scroll");
	}, 500);
});