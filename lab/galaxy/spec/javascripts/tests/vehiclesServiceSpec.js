describe('vehiclesService', function () {
  var service,
      $q,
      $httpBackend,
      remote = "http://server.com/api/v1",

      vehicles = [
        {name: "Vehicle One"},
        {name: "Vehicle Two"},
        {name: "Unknown Vehicle"},
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

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
});