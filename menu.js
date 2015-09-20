(function () {
  "use strict"
  var
      animationDuration = 250,
      moveToY = function ($e, yPosition) {
        return $e.animate({
          left: 0,
          top: yPosition,
        }, animationDuration).promise();
      },
      totalHeightOf = function($e){
        return $e.height() + parseInt($e.css("padding-bottom")) + parseInt($e.css("padding-top"));
      },
      MenuBar = function($bar, topClass, backClass){
        this.$e = $bar;
        this.topClass = topClass;
        this.backClass = backClass;
        this.$e.css("position", "relative")
      },
      MenuContainer = function($container){
        this.$e = $container;
        this.$e.css("position", "fixed");
      },
      Menu = function ($titleBar, $appMenu, $contextMenu, topBarClass, bottomBarClass) {
        this.$menuContainer = new MenuContainer($titleBar);
        this.$topMenu = new MenuBar($appMenu, topBarClass, bottomBarClass);
        this.$bottomMenu = new MenuBar($contextMenu, topBarClass, bottomBarClass);
      };

  MenuBar.prototype.bringToFront = function() {
    this.$e.removeClass(this.backClass);
    this.$e.addClass(this.topClass);
  };

  MenuBar.prototype.sendToBack = function() {
    this.$e.removeClass(this.topClass);
    this.$e.addClass(this.backClass);
  };

  MenuBar.prototype.show = function() {
    return moveToY(this.$e, 0);
  };

  MenuBar.prototype.hide = function() {
    return moveToY(this.$e, -totalHeightOf(this.$e));
  };

  MenuBar.prototype.insertBefore = function(otherBar) {
    return this.$e.insertBefore(otherBar.$e);
  };

  MenuContainer.prototype.hide = function() {
    return moveToY(this.$e, -totalHeightOf(this.$e));
  };

  MenuContainer.prototype.flipBars = function(topBar, bottomBar) {
    topBar.show();
    topBar.bringToFront();
    bottomBar.sendToBack();
    bottomBar.hide();
    return topBar.insertBefore(bottomBar);
  };

  MenuContainer.prototype.show = function() {
    return moveToY(this.$e, 0);
  };

  MenuContainer.prototype.showOnHover = function(bar) {
    this.$e.off();
    this.$e.hover(function () {
      bar.show();
    }, function () {
      bar.hide();
    });
  };

  Menu.prototype.flip = function(topBar, bottomBar) {
    var menu = this.$menuContainer;
    menu.hide().done(function(){
      return menu.flipBars(topBar, bottomBar);
    }).done(function(){
      menu.show();
      menu.showOnHover(bottomBar)
    });
  };

  Menu.prototype.topNavigation = function () {
    this.flip(this.$topMenu, this.$bottomMenu);
  };

  Menu.prototype.contextNavigation = function () {
    this.flip(this.$bottomMenu, this.$topMenu);
  };

  Menu.prototype.show = function () {
    return this.$menuContainer.show();
  };

  Menu.prototype.hide = function () {
    return this.$menuContainer.hide();
  };

  window.Menu = Menu;

}).call(this);