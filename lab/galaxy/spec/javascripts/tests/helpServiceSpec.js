describe('Help', function() {
  var service,
      specs = [
        {
          name    : "message for no missions",
          ui      : {},
          missions: {list: []},
          expected: "Create a mission"
        },
        {
          name    : "need more missions",
          ui      : {},
          missions: {list: [{},{}]},
          expected: "Create 2 more missions"
        },
        {
          name    : "need one more missions",
          ui      : {},
          missions: {list: [{},{},{}]},
          expected: "Create 1 more mission"
        },
        {
          name    : "send missionaries",
          ui      : {},
          missions: {list: [{},{},{},{}]},
          expected: "Send Missionaires"
        }

      ];

  beforeEach(module('galaxy'));

  beforeEach(inject(function (_helpService_) {
    service = _helpService_;
  }));

  specs.forEach(function (spec) {
    it(spec.name, function () {
      expect(service.message(spec.missions, spec.ui)).toBe(spec.expected)
    })
  })
});