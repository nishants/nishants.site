app.service("missionsService", [function(){
  var missions = {
    add: function(planet, vehicle){
      planet.assign();
      vehicle.assign();
      missions.list.push({
        planet : planet,
        vehicle: vehicle
      })
    },
    remove: function(index){
      var mission = missions.list[index];
      mission.planet.reset();
      mission.vehicle.unassign();
      missions.list.splice(index, 1);
    },
    list: []
  };
  return missions;
}]);