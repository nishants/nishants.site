app.service("missionsService", [function(){
  var missions = {
    list: [{
      planet : {name: "planet 1"},
      vehicle: {name: "vehicle 1"}
    }]
  };
  return missions;
}]);