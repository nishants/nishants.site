describe('TimelineSearch', function () {
	var service,
			sample_timeline  = {
				positions: [
					{
						title: 'One',
						tags    : ["only-one", "one-and-two"],
						projects : [
							{
								title: 'One One',
								tags : ["one", "one-one"],
							},
							{
								title: 'One Two',
								tags : ["one-two", "two"],
							},
							{
								title: 'One Three',
								tags : ["one-three", "three"],
							}
						]
					},

					{
						title: 'Two',
						tags    : ["only-two", "one-and-two"],
						projects : [
							{
								title: 'Two One',
								tags : ["two-one", "one"],
							},
							{
								title: 'Two Two',
								tags : ["two-two", "two"],
							},
							{
								title: 'Two Three',
								tags : ["two-three", "three"],
							}
						]
					}
				]
			};

	beforeEach(module('timeline'));
	module(function($provide) {
		$provide.value('MatcherService', MatcherService);
	});
	beforeEach(inject(function (SearchService) {
		service = SearchService;
	}));

	describe('ShouldFilterByKeyword', function () {
		it("search with empty query", function () {
			service.index(sample_timeline);
			service.search("")
			expect(service.timeline).toEqual(sample_timeline)
		});

		it("should include all projects if position matches tag", function () {
			var expected = Object.assign({}, sample_timeline);

			service.index(sample_timeline);
			service.search("only-one");

			expected.positions[0]._hidden = undefined;
			expected.positions[0]._hidden = true;

			expect(service.timeline).toEqual(expected);
		});

		it("should search for multiple profile", function () {
			var expected = Object.assign({}, sample_timeline);
			service.index(sample_timeline);
			service.search("one-and-two");

			expect(service.timeline).toEqual(expected);
		});

		it("should hide all if no match found", function () {
			var expected = Object.assign({}, sample_timeline);

			service.index(sample_timeline);
			service.search("no-match");

			expect(service.timeline.positions[0]._hidden).toEqual(true);
			expect(service.timeline.positions[1]._hidden).toEqual(true);
		});

		it("should include profile is one of tags in query matches", function () {
			var expected = Object.assign({}, sample_timeline);
			service.index(sample_timeline);
			service.search("one-and-two");

			expect(service.timeline.positions[0]._hidden).toBeFalsy();
			expect(service.timeline.positions[1]._hidden).toBeFalsy();
		});
	});

});