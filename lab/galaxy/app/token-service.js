app.service("tokenService", function(){
  var token = null;
  var service = {
    token: null,
    set: function (token) {
      service.token = token;
    },
    get: function () {
      return service.token;
    },
  };
  return service
});