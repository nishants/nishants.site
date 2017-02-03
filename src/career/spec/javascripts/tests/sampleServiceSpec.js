describe('Service', function () {
  var service,
      $httpBackend;

  beforeEach(function() {
    module('profile');

  });

  it("Should run a test", function () {
    expect(1).toEqual(1);
  });
});