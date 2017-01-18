app.service("wizardService", ['missionsService', function (missionsService) {
  var wizard = {
    planet    : null,
    vehicle   : null,
    showWizard: false,
    selectVehicle: false,
    show: function(){
      wizard.showWizard = true;
    },
    isSelectable: function(vehicle){
      var remaining       = vehicle.remaining > 0,
          canReachPlanet  = wizard.planet  && vehicle.max_distance >= wizard.planet.distance;
      return remaining && canReachPlanet;
     },
    showVehicle: function(selectVehicle){
      wizard.selectVehicle = selectVehicle;
    },
    setVehicle: function(vehicle){
      wizard.vehicle = vehicle;
      wizard.confirm();
    },
    setPlanet: function(planet){
      wizard.planet = planet;
      wizard.showVehicle(true);
    },
    confirm: function(){
      missionsService.add(wizard.planet, wizard.vehicle);
      wizard.reset();
    },
    reset: function(){
      wizard.planet      = null;
      wizard.vehicle     = null;
      wizard.showWizard  = false;
      wizard.selectVehicle  = false;
    }
  };
  wizard.reset();
  return wizard;
}]);