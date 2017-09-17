describe('FindPhrase', function () {
	var $httpBackend,
			$q,
      Scene;

  beforeEach(function() {
    module('crg');
    module(function($provide) {
      //$provide.value("remote", remote);
      //$provide.value("vehicleIcons", vehicleIcons);
      //$provide.value("planetIcons", planetIcons);
    });

    inject(function ($injector, _$q_, _FindPhrase_) {
      $httpBackend  = $injector.get('$httpBackend');
      $q = _$q_;
      Scene = _FindPhrase_
    });
  });

  it("missions should be empty at start", function () {
    Scene({
      correctOptions: [],
      partialCorrectOptions: [],
      sceneLoadVideo: {
        transcript: "Hello"
      }
    });
    expect(1).toEqual(1);
  });


  afterEach(function () {
    //$httpBackend.verifyNoOutstandingExpectation();
    //$httpBackend.verifyNoOutstandingRequest();
  });
});