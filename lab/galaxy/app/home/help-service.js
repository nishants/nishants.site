app.service("helpService", ["missionsService", "uiService",function(missionsService, uiService){
  var help = {
    message: function(){
      return "rescued";
    },
    messages: [
      {
        name: "no-missions",
        select: function(missionsList){
          return missionsList.length == 0;
        },
        ""        : "Create 4 missions",
      }
    ]
  };
  return help;
}]);