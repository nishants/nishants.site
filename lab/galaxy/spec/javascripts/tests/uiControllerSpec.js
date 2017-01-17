describe('uiController', function() {
  beforeEach(module('galaxy'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('$scope.ui', function() {
    it('should set ui service on scope', function() {
      var $scope = {};
      $controller('uiController', { $scope: $scope });
      expect($scope.ui).toBeTruthy()
    });
  });

});