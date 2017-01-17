describe('helpService', function() {
  beforeEach(module('galaxy'));

  var service,
      specs = [
        {
          name: "message for no missions",
          ui: {},
          missions: {list: []},
          expected: "Create 4 Missions"
        },
        {
          name: "need more missions",
          ui: {},
          missions: {list: [{},{}]},
          expected: "Create 2 more Missions"
        },
        {
          name: "need one more missions",
          ui: {},
          missions: {list: [{},{},{}]},
          expected: "Create 1 more Mission"
        },
        {
          name: "send missionaries",
          ui: {},
          missions: {list: [{},{},{},{}]},
          expected: "Send Missionaires"
        }

      ];

  beforeEach(inject(function(_helpService_){
    service = _helpService_;
  }));

  specs.forEach(function(spec){
    it(spec.name, function() {
      expect(service.message(spec.missions, spec.ui)).toBe(spec.expected)
    })
  })

});