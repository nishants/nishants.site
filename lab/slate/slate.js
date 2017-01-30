(function () {
  "use strict"

  var app = angular.module("slate", []);
  app.directive("slate", [function () {
    var select = function (index) {
          var card = $($(".deck > li")[index]),
              offsetPadding = 10,
              offsetY = $(".deck").offset().top - card.offset().top,
              offsetX = $(".deck").offset().left - card.offset().left;

          card.css("transform", "translateY(" + (offsetY + offsetPadding) + "px)" + "translateX(" + (offsetX + offsetPadding) + "px)");
        },
        unSelect = function (index) {
          var card = $($(".deck > li")[index]);
          card.css("transform", "");
        };
    return {
      restrict: "C",
      scope: true,
      transclude: false,
      link: function (scope, element, attrs) {
        scope.deck = {
          current: -1,
          cards: [
            {id: 0},
            {id: 1},
            {id: 2},
            {id: 3},
            {id: 4},
            {id: 5},
            {id: 6},
            {id: 7},
            {id: 8},
            {id: 9},
            {id: 10},
            {id: 11},
            {id: 12},
            {id: 13},
            {id: 14},
            {id: 15},
            {id: 16},
            {id: 17},
          ]
        };
        scope.$watch("deck.current", function (now, previous) {
          now != -1 && select(now);
          previous != -1 && unSelect(previous);
        });
      }
    };
  }]);

}).call(this);