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
