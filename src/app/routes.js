app.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function ($stateProvider, $urlRouterProvider, $locationProvider) {

  $urlRouterProvider.otherwise('/');
  $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'assets/templates/home.template.html'
      });
}]);
