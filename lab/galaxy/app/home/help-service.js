app.service("helpService", [function () {
  var MAX_MISSIONS = 4,
      help = {
        message: function (missions, ui) {
          return help.states.find(function (state) {
            return state.select(missions, ui);
          }).message(missions, ui);
        },

        states: [
          {
            name: "no-missions",
            message: function (missions) {
              return "Create a mission";
            },
            select: function (missions) {
              return missions.list.length == 0;
            },
          },
          {
            name: "need-more-missions",
            message: function (missions) {
              var missionsLeft = MAX_MISSIONS - missions.list.length;
              return "Create <count> more mission<s>".replace("<count>", missionsLeft).replace("<s>", missionsLeft > 1 ? "s" : "");
            },
            select: function (missions) {
              return missions.list.length > 0 && missions.list.length < MAX_MISSIONS;
            },
          },
          {
            name: "send-mission",
            message: function (missions) {
              return "Send Missionaires";
            },
            select: function (missions) {
              return (MAX_MISSIONS - missions.list.length) == 0;
            },
          }

        ]
      };
  return help;
}]);