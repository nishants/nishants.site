describe('vehiclesService', function () {
  var service,
      $httpBackend,
      vehicles = [
        {name: "Space pod"},
        {name: "Space ship"},
        {name: "XXX"},
      ],
      vehiclesWithIcons = [
        {name: "Space pod" , icon: "images/vehicles/space-pod.jpg"},
        {name: "Space ship", icon: "images/vehicles/spaceship.png"},
        {name: "XXX"       , icon: "images/vehicles/other-vehicle.jpg"}
      ];

  beforeEach(module('galaxy'));

  beforeEach(inject(function (_vehiclesService_, $injector, remote) {
    service = _vehiclesService_;
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('POST', remote + '/token')
        .respond({token: "token"});
    $httpBackend.when('GET', remote + '/vehicles')
        .respond(vehicles);
    $httpBackend.when('GET', remote + '/planets')
        .respond([]);

  }));

  it("Should add icons to vehicles", function () {

    service.load();
    $httpBackend.flush();

    expect(service.list).toEqual(vehiclesWithIcons);
  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
});