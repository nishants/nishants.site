var Scroller = {
  states : {
    all           : [],
    current       : null,
    scrollPosition: 0,
    _updatingUrl  : false,
    _stateName    : null,

    add: function(){

    },
    start: function(){

    },
    _layoutUpdate: function(){
      Scroller._computeLayout();
    },
    _computeLayout: function(){

    },
    _updateState: function(){

    },
    _onURLChange: function(){

    },
    _onScroll: function(scrollPosition){
      Scroller.scrollPosition = scrollPosition;
      Scroller._updateState();
    }
  }
};
window.Scroller = Scroller;