var app = angular.module("app", ["fire-auth"]);

app.value("compileServers", [{name: "default", url: "http://localhost:4567"}]);

app.config(function ($httpProvider) {
  $httpProvider.defaults.useXDomain       = true;
  $httpProvider.defaults.headers.common   = {};
  $httpProvider.defaults.headers.post     = {};
  $httpProvider.defaults.headers.put      = {};
  $httpProvider.defaults.headers.patch    = {};
  $httpProvider.defaults.headers.options  = {};
});
