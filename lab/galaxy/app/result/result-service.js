app.service("resultService", ["tokenService", "$http", "remote", "requestConfig", function (tokenService, $http, remote, requestConfig) {
  var planetNames = function (mission) {return mission.planet.name},
      vehicleNames = function (mission) {return mission.vehicle.name},
      vehicleFor   = function (planetName) {
        return function(mission){
          return mission.planet.name = planetName;
        };
      },
      service = {
        outcome : null,
        reset : function(){
          service.outcome = null;
        },
        submit : function (missionList) {
          var token   = tokenService.get(),
              request = {
                token         : token,
                planet_names  : missionList.map(planetNames),
                vehicle_names : missionList.map(vehicleNames)
              };

          return $http.post(remote + "/find", request, requestConfig).then(function (response) {
            service.outcome = {
              planet_name  : response.data.planet_name,
              status       : response.data.status != "false",
              vehicle_name : response.data.planet_name ? missionList.find(vehicleFor(response.data.planet_name)).vehicle.name : null,
            };
          });
        }
      };
  return service;
}]);