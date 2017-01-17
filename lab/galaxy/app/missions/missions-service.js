app.service("missionsService", [function(){
  var missions = {
    add: function(planet, vehicle){
      missions.list.push({
        planet : planet,
        vehicle: vehicle
      })
    },
    remove: function(index){
      missions.list.splice(index, 1);
    },
    list: [{
      planet : {name: "planet 1"},
      vehicle: {name: "vehicle 1"}
    }]
  };
  return missions;
}]);