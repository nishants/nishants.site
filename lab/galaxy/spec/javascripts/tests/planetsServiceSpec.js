describe('PlanetsService', function () {
  var service,
      $q,
      $httpBackend,
      remote = "http://server.com/api/v1",
      planets = [
        {name: "Donlon", distance: 100},
        {name: "Enchai", distance: 100},
        {name: "XXX"   , distance: 100},
      ],
      planetIcons = {
        "Donlon"  : "images/Donlon.png",
        "Enchai"  : "images/Enchai.jpg",
        "other"   : "images/other-planet.png"
      },
      planetWithIcons = [
        { name: 'Donlon', distance: 100, assigned: false, icon: 'images/Donlon.png' },
        { name: 'Enchai', distance: 100, assigned: false, icon: 'images/Enchai.jpg' },
        { name: 'XXX'   , distance: 100, assigned: false, icon: 'images/other-planet.png' }
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