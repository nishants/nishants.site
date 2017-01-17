var app = angular.module("galaxy", []);
app.value("remote", "https://findfalcone.herokuapp.com");
app.value("requestConfig", {headers: {Accept: "application/json", "Content-Type": "application/json"}});
app.value("planetIcons", {
  "Donlon"  : "images/Donlon.png",
  "Enchai"  : "images/Enchai.jpg",
  "Jebing"  : "images/Jebing.jpeg",
  "Sapir"   : "images/Sapir.png",
  "Lerbin"  : "images/Lerbin.jpg",
  "Pingasor": "images/Pingasor.jpeg",
  "other"   : "images/other-planet.png"
});

app.value("vehicleIcons", {
  "Space pod"     : "images/vehicles/space-pod.jpg",
  "Space rocket"  : "images/vehicles/space-rocket.png",
  "Space shuttle" : "images/vehicles/shutle.jpeg",
  "Space ship"    : "images/vehicles/spaceship.png",
  "other"         : "images/vehicles/other-vehicle.jpg"
});

app.run(["remote", "$http", "tokenService", "requestConfig","planetsService", "vehiclesService", function(remote, $http, tokenService, requestConfig, planetsService, vehiclesService){
  $http.post(remote + "/token", {}, requestConfig).then(function(response){
    tokenService.set(response.data.token);
  });
  planetsService.load();
  vehiclesService.load();
}]);
