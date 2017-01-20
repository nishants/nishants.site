beforeEach(function () {
  jasmine.addMatchers({
    toBePlaying: function () {
      return {
        compare: function (actual, expected) {
          var player = actual;

          return {
            pass: player.currentlyPlayingSong === expected && player.isPlaying
          };
        }
      };
    }
  });
});

helper = {
  likeArray : function(arr){
    return arr.map(function(e){
      return jasmine.objectContaining(e);
    });
  }
};