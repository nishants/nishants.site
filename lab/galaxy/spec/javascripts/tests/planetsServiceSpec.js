describe('PlanetsService', function () {
  var service,
      $q,
      $httpBackend,
      remote = "http://server.com/api/v1",
      planets = [
        {name: "Planet One", distance: 100},
        {name: "Planet Two", distance: 100},
        {name: "Unknown"   , distance: 100},
      ],
      planetIcons = {
        "Planet One"  : "images/path-one.png",
        "Planet Two"  : "images/path-two.jpg",
        "other"       : "images/path-three.png"
      },
      planetWithIcons = [
        { name: 'Planet One', distance: 100, assigned: false, icon: 'images/path-one.png' },
        { name: 'Planet Two', distance: 100, assigned: false, icon: 'images/path-two.jpg' },
        { name: 'Unknown'   , distance: 100, assigned: false, icon: 'images/path-three.png' }
      ];

  beforeEach(function() {
    module('galaxy');
    module(function($provide) {
      $provide.value("remote", remote);
      $provide.value("planetIcons", planetIcons);
    });

    inject(function (_planetsService_, $injector, _$q_) {
      service       = _planetsService_;
      $httpBackend  = $injector.get('$httpBackend');
      $q = _$q_;
    });

    $httpBackend.when('GET', remote + '/planets')
        .respond(planets);
    $httpBackend.when('GET', remote + '/vehicles')
        .respond([]);
  });

  it("Should add icons to planets", function () {
    service.load();
    $httpBackend.flush();
    expect(service.list).toEqual(helper.likeArray(planetWithIcons));

  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
});