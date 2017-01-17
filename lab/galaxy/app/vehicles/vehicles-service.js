app.service("vehiclesService", ["$http", "remote", "requestConfig", "vehicleIcons", function($http, remote, requestConfig, vehicleIcons){
  var withIcons = function(data){
    data.icon = vehicleIcons[data.name] || vehicleIcons["other"];
    return data;
  };
  var vehicles = {
    list: [],
    load: function(){
      $http.get(remote + "/vehicles", {}, requestConfig).then(function(response){
        vehicles.list = response.data.map(withIcons);
      });
    }
  };

  return vehicles;
}]);