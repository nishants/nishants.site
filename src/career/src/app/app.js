var
		rowHeight = function(){
			return 20;
		},
		app = function(){
			return $("#nishants-site");
		},
		showTopBar = function (show) {
			show ? app().addClass("show-top-bar") : app().removeClass("show-top-bar");
		},
		showNameInTopBar = function (show) {
			show ? app().addClass("show-top-bar-name") : app().removeClass("show-top-bar-name");
		},
		showContactInTopBar = function (show) {
			show ? app().addClass("show-top-bar-contact") : app().removeClass("show-top-bar-contact");
		},
		showTitleInTopBar = function (show) {
			show ? app().addClass("show-top-bar-title") : app().removeClass("show-top-bar-title");
		},
		isGone = function (element) {
			return element.getBoundingClientRect().top < 0;
		},
		isUnderTitleBar = function (element, offset) {
			return element.getBoundingClientRect().top < $(".top-bar").height() - (offset || rowHeight());
		};

$(document).on("scroll", function(){
	showTopBar(isGone($(".introduction")[0]));
	showNameInTopBar(isUnderTitleBar($(".introduction > .name")[0]));
	showTitleInTopBar(isUnderTitleBar($(".introduction > .title > .designation")[0]));
	showContactInTopBar(isUnderTitleBar($(".introduction > .contact")[0]), 50);
});

