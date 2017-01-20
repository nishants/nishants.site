describe('Missions', function () {
  var service,
      $q,
      $httpBackend,
      remote = "http://server.com/api/v1",
      vehiclesService,
      planetsService,
      vehicles = [
        {name: "Vehicle One", total_no :3},
        {name: "Vehicle Two", total_no :3},
        {name: "Unknown Vehicle", total_no :3},
      ],
      vehicleIcons = {
        "Vehicle One"  : "image/path/one.jpg",
        "Vehicle Two"  : "image/path/two.jpg",
        "other"        : "image/path/three.jpg"
      },
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
      expectedPlanetsAfterReset = [
        { name: 'Planet One', distance: 100, assigned: false, icon: 'images/path-one.png' },
        { name: 'Planet Two', distance: 100, assigned: false, icon: 'images/path-two.jpg' },
        { name: 'Unknown'   , distance: 100, assigned: false, icon: 'images/path-three.png' }
      ],
      expectedVehiclesAfterReset = [
        {name: "Vehicle One"    , icon: "image/path/one.jpg"  , total_no :3},
        {name: "Vehicle Two"    , icon: "image/path/two.jpg"  , total_no :3},
        {name: "Unknown Vehicle", icon: "image/path/three.jpg", total_no :3}
      ];

  beforeEach(function() {
    module('galaxy');
    module(function($provide) {
      $provide.value("remote", remote);
      $provide.value("vehicleIcons", vehicleIcons);
      $provide.value("planetIcons", planetIcons);
    });

    inject(function (_missionsService_,_planetsService_,_vehiclesService_, $injector, _$q_) {
      service         = _missionsService_;
      vehiclesService = _vehiclesService_;
      planetsService  =_planetsService_;

          $httpBackend  = $injector.get('$httpBackend');
      $q = _$q_;
    });

    $httpBackend.when('GET', remote + '/planets')
        .respond(planets);
    $httpBackend.when('GET', remote + '/vehicles')
        .respond(vehicles);
    $httpBackend.flush();
  });

  it("missions should be empty at start", function () {
    expect(service.list).toEqual([]);
  });

  it("can add/remove more mission", function () {
    var planet  = planetsService.list[0],
        vehicle = vehiclesService.list[0];

    service.add(planet, vehicle);
    expect(service.list).toEqual([{planet: planet, vehicle: vehicle}]);
    expect(service.remaining()).toEqual(3);
    service.remove(0);
    expect(service.list).toEqual([]);
    expect(service.remaining()).toEqual(4);
  });
  describe('Reset Missions', function () {
    beforeEach(function() {
      service.add(planetsService.list[0], vehiclesService.list[0]);
      service.add(planetsService.list[1], vehiclesService.list[1]);
      service.add(planetsService.list[2], vehiclesService.list[2]);
    });

    it("should remove all missions", function () {
      service.reset();
      expect(service.list).toEqual([]);
      expect(service.remaining()).toEqual(4);
    });

    it("should reset planets", function () {
      service.reset();
      expect(planetsService.list).toEqual(helper.likeArray(expectedPlanetsAfterReset));
    });

    it("should reset vehicles", function () {
      service.reset();
      expect(vehiclesService.list).toEqual(helper.likeArray(expectedVehiclesAfterReset));
    });

  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
});