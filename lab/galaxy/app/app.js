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

app.run(["remote", "$http", "tokenService", "requestConfig","planetsService", function(remote, $http, tokenService, requestConfig, planetsService){
  $http.post(remote + "/token", {}, requestConfig).then(function(response){
    tokenService.set(response.data.token);
  });
  planetsService.load();
}]);
