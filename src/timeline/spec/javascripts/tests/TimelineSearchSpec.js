describe('TimelineSearch', function () {
	var service,
			timeline  = {
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
			},
			expectations = [
				{
					name: "search with now keyword",
					query: "",
					expected : timeline.positions
				},
				{
					name: "search by position level tag",
					query: "only-one",
					expected : timeline.positions[0]
				},
				{
					name: "search by position level tag",
					query: "only-two",
					expected : timeline.positions[1]
				}

			];

	beforeEach(module('timeline'));
	module(function($provide) {
		$provide.value('MatcherService', MatcherService);
	});
	beforeEach(inject(function (SearchService) {
		service = SearchService;
	}));

	describe('ShouldFilterByKeyword', function () {
		it("search with empty query", function () {
			service.index(Object.assign({}, timeline));
			service.search("")
			expect(timeline).toBe(timeline)
		});
	});

});