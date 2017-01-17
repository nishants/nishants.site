app.service("missionsService", [function () {
  var
      MAX_MISSIONS = 4,
      missions = {
        add: function (planet, vehicle) {
          planet.assign();
          vehicle.assign();
          missions.list.push({
            planet: planet,
            vehicle: vehicle
          })
        },
        remaining: function(){
          return (MAX_MISSIONS - missions.list.length);
        },
        remove: function (index) {
          var mission = missions.list[index];
          mission.planet.reset();
          mission.vehicle.unassign();
          missions.list.splice(index, 1);
        },
        list: []
      };
  return missions;
}]);