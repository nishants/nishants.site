var app = angular.module("galaxy", []);
app.value("remote", "https://findfalcone.herokuapp.com");
app.value("requestConfig", {headers: {Accept: "application/json", "Content-Type": "application/json"}});

app.run(["remote", "$http", "tokenService", "requestConfig", function(remote, $http, tokenService, requestConfig){
  $http.post(remote + "/token", {}, requestConfig).then(function(response){
    tokenService.set(response.data.token);
  });
}]);
