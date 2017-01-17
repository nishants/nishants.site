describe('planetsService', function () {
  var service,
      $httpBackend,
      planets = [
        {name: "Donlon"},
        {name: "Enchai"},
        {name: "XXX"},
      ],
      planetsWithIcons = [
        { name: 'Donlon', icon: 'images/Donlon.png' },
        { name: 'Enchai', icon: 'images/Enchai.jpg' },
        { name: 'XXX',    icon: 'images/other-planet.png' }
      ];

  beforeEach(module('galaxy'));

  beforeEach(inject(function (_planetsService_, $injector, remote) {
    service = _planetsService_;
    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.when('POST', remote + '/token')
        .respond({token: "token"});
    $httpBackend.when('GET', remote + '/planets')
        .respond(planets);
    $httpBackend.when('GET', remote + '/vehicles')
        .respond([]);

  }));

  it("Should add icons to planets", function () {

    service.load();
    $httpBackend.flush();

    expect(service.list).toEqual(planetsWithIcons);
  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
});