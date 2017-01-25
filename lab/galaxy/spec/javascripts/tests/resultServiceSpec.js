describe('Results', function () {
  var service,
      $httpBackend,
      remote = "www.abc/data",
      tokenResponse   = {token: "xyz-token-value"},
      failureResponse = {status: "false"},
      missions = [
        {planet: {name: "Mars"}   , vehicle: {name: "Dragon"}},
        {planet: {name: "Jupiter"}, vehicle: {name: "Falcon"}},
      ],
      expectedRequest= {
        token         : tokenResponse.token,
        planet_names  : ["Mars", "Jupiter"],
        vehicle_names : ["Dragon", "Falcon"],
      },
      successResponse = {status: "true", planet_name: "Mars"};

  beforeEach(function() {
    module('galaxy');
    module(function($provide) {
      $provide.value("remote", remote);
    });

    inject(function (_resultService_, $injector) {
      service       = _resultService_;
      $httpBackend  = $injector.get('$httpBackend');
    });

    $httpBackend.when('GET', remote + '/planets')
        .respond([]);
    $httpBackend.when('GET', remote + '/vehicles')
        .respond([]);
    $httpBackend.when('POST', remote + '/token', {})
        .respond(tokenResponse);
  });

  it("Should have no outcome initially", function () {
    $httpBackend.flush();
    expect(service.outcome).toBeNull();
  });

  it("Should have outcome status as false if game is user lost", function (done) {
    $httpBackend.flush();
    $httpBackend.when('POST', remote + '/find', expectedRequest)
        .respond(failureResponse);

    service.submit(missions);
    expect(service.loading).toBeTruthy();
    $httpBackend.flush();
    expect(service.outcome).toBeDefined();
    expect(service.outcome.status).toBeFalsy();
    done();
  });

  it("Should have outcome status as true if game is user won", function (done) {
    $httpBackend.flush();
    $httpBackend.when('POST', remote + '/find', expectedRequest)
        .respond(successResponse);

    service.submit(missions);
    expect(service.loading).toBeTruthy();
    $httpBackend.flush();
    expect(service.outcome).toBeDefined();
    expect(service.outcome.status).toBeTruthy();
    expect(service.outcome.planet_name).toEqual("Mars");
    expect(service.outcome.vehicle_name).toEqual("Dragon");
    done();
  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
});