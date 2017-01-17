app.service("uiService", [function(){
  var ui = {
    skipIntro: false,
    showMissionsWizard: false,
    createMission: function () {
      ui.showMissionsWizard = true;
    },
    missions: [],
    regiment: []
  };
  return ui;
}]);