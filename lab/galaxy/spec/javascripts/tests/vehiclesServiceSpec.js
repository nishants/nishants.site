describe('Vehicles', function () {
  var service,
      $q,
      $httpBackend,
      remote = "http://server.com/api/v1",

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
      vehiclesWithIcons = [
        {name: "Vehicle One"    , icon: "image/path/one.jpg"},
        {name: "Vehicle Two"    , icon: "image/path/two.jpg"},
        {name: "Unknown Vehicle", icon: "image/path/three.jpg"}
      ];

  beforeEach(function() {
    module('galaxy');
    module(function($provide) {
      $provide.value("remote", remote);
      $provide.value("vehicleIcons", vehicleIcons);
    });

    inject(function (_vehiclesService_, $injector, _$q_) {
      service       = _vehiclesService_;
      $httpBackend  = $injector.get('$httpBackend');
      $q = _$q_;
    });

    $httpBackend.when('GET', remote + '/planets')
        .respond([]);
    $httpBackend.when('GET', remote + '/vehicles')
        .respond(vehicles);
  });

  it("Should add icons to vehicles", function () {
    service.load();
    $httpBackend.flush();
    expect(service.list).toEqual(helper.likeArray(vehiclesWithIcons));

  });

  describe('Assign/Unassign Vehicles', function () {
    it("planets can be assigned, and unassigned", function () {
      service.load();
      $httpBackend.flush();
      var vehicle = service.list[1];

      expect(vehicle.remaining).toEqual(3);

      vehicle.assign()
      expect(vehicle.remaining).toEqual(2);

      vehicle.assign()
      expect(vehicle.remaining).toEqual(1);

      vehicle.assign()
      expect(vehicle.remaining).toEqual(0);

      vehicle.unassign();
      vehicle.unassign();
      vehicle.unassign();
      expect(vehicle.remaining).toEqual(3);
    });
  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
});