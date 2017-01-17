app.service("planetsService", ["$http", "remote", "requestConfig", "planetIcons", function($http, remote, requestConfig, planetIcons){
  var toPlanets = function(data){
    data.icon = planetIcons[data.name] || planetIcons["other"];
    return data;
  };
  var planets = {
    list: [],
    load: function(){
      $http.get(remote + "/planets", {}, requestConfig).then(function(response){
        planets.list = response.data.map(toPlanets);
      });
    }
  };

  return planets;
}]);