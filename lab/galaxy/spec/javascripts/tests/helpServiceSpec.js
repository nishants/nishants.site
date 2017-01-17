describe('helpService', function() {
  beforeEach(module('galaxy'));

  var service;

  beforeEach(inject(function(_helpService_){
    service = _helpService_;
  }));

  it('should set ui service on scope', function() {
    expect(service.message()).toBe("rescued")
  });

});