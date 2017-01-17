app.service("uiService", [function(){
  var ui = {
    skipIntro: true,
    showMissionsWizard: true,
    createMission: function () {
      ui.showMissionsWizard = true;
    },
  };
  return ui;
}]);