(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.app = angular.module("crg", ['ui.router', 'ngDraggable']);
},{}],2:[function(require,module,exports){
app.directive("dropDown", [function () {

	return {
		restrict: "C",
		scope   : true,
		template: "<div class='dropdown-inner' ><div class='current' ng-click='dropdown.show(!dropdown.active)'><label class='value' ng-bind='dropdown.current.value' ng-show='dropdown.current.value'></label> <label class='placeholder' ng-bind='dropdown.name' ng-hide='dropdown.current.value'></label><div class='caret fa fa-chevron-down'></div></div><ul class='options'><li ng-repeat='option in dropdown.options' ng-bind='option.value' ng-click='dropdown.select(option)'></li><li ng-click='dropdown.clear()' ng-show='dropdown.reset' ng-bind='dropdown.reset'></li></ul></div>",
		link    : function (scope, element, attrs) {
			var dropdown = {
				name: attrs.name,
				active: false,
				reset: scope.$eval(attrs.reset) || attrs.reset,
				current: {
					value: scope.$eval(attrs.value)
				},
				options: scope.$eval(attrs.options),
				select: function (option) {
					dropdown.current.value = option.value;
					dropdown.show(false);
				},
				show: function(value){
					dropdown.active = value;
					value ? element.addClass("active") : element.removeClass("active");
				},
				clear: function(){
					dropdown.current = {value: null};
					dropdown.show(false);
				}
			};
			scope.dropdown = dropdown;

		}
	};
}]);
},{}],3:[function(require,module,exports){
app.run(["$rootScope", "stateMessages" ,function($rootScope, stateMessages){
	var state = {
			name				: "",
			loading     : null,
			message     : "Welcome Onboard !",
			error     	: null,
			loadingNext	: function(name, message){
				state.message = message;;
				state.loading = name;
				state.error   = null;
			},
			done   			: function(stateName){
				state.loading = null;
				state.message = null;
				state.name    = stateName;
			},
			failed: function(error){
				state.loading = null;
				state.message = null;
				state.error   = error;
			}
		},
		nameFor = function(state){
			return state.replace(/\./g, "-");
		};

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
		state.loadingNext(nameFor(toState.name), stateMessages[toState.name]);
	});

	$rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams){
		state.failed("Unknown Error");
	});

	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
		state.failed("Unknown Error");
    console.log(error);
	});

	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
		state.done(nameFor(toState.name));
	});

	$rootScope.state = state;
}]);
},{}],4:[function(require,module,exports){
app.directive("typewriter",["$timeout", function($timeout){
  return {
    restrict: "C",
    scope: true,
    template: "<span class='letters'><span class='letter' ng-repeat='letter in letters track by $index'>{{letter}}</span><span>",
    link: function(scope, element, attrs){
      if(attrs.text){
        var $e    = $(element),
            speed = parseInt(attrs.typingSpeed) || 100,
            lastTimeout,
            nextLetter = 0,
            stopTimer = function(){
              $timeout.cancel(lastTimeout);
            },
            type = function(){
              if(nextLetter < scope.letters.length){
                $($e.find(".letter")[nextLetter++]).addClass("display");
              }else{
                stopTyping();
              }
              if(!scope.done){
                lastTimeout = $timeout(type, speed);
              }
            },
            startTyping = function(){
              stopTimer();
              $timeout(function(){
                $(".letters").addClass("typing");
                scope.done = false;
                nextLetter = 0;
                attrs.beforeTyping && scope.$eval(attrs.beforeTyping);
                lastTimeout = $timeout(type, speed);
              });
            },
            stopTyping = function(){
              $timeout(function(){
                $(".letters").removeClass("typing");
                scope.done = true;
                attrs.afterTyping && scope.$eval(attrs.afterTyping);
              });
              stopTimer();
            };
        scope.$watch(attrs.text, function(text){
          scope.letters = text.split("");
          startTyping();
          $(".letters").html(text);
          stopTyping();
        });
      }
    }
  };
}])
},{}],5:[function(require,module,exports){
app.value("remote", "https://findfalcone.herokuapp.com");
app.value("requestConfig", {headers: {Accept: "application/json", "Content-Type": "application/json"}});

},{}],6:[function(require,module,exports){
app.factory("Passage", [function () {
  var toSelectableNodes = function(paragraphs){
        var nodes = [];
        for(var i =0; i < paragraphs.length; i++){
          var words = paragraphs[i].split(" ");
          for(var j =0; j < words.length; j++){
            nodes.push({text: words[j]});
          }
          nodes.push({text: '', linebreak: true});
        }
        return nodes;
      };

  return function(passage){
    return {
      from  : passage.from,
      by    : passage.by,
      words : toSelectableNodes(passage.text.split("\n"))
    };
  };
}]);
},{}],7:[function(require,module,exports){
app.directive("videoPlayer", [ "VideoPlayerService", function(VideoPlayerService){

  return {
    restrict : "A",
    scope    : true,
    link     : function(scope, element, attrs){
      var videoEnded = function(){
            scope.$eval(attrs.afterVideo);
          };
      var resetVideo = function(){
        var $e = $(element),
            videoElement = $e.find("video")[0]
        $e.addClass("no-video");
        videoElement.pause();
      };

      var setVideo = function (video) {
        var thumbnail = scope.game.player.chat.agent.videoThumbnail,
            videoTemplate = '<video width="100%"><source ></video><div class="no-video-place-holder"><img src="<video-thumbnail>"></div>';
        $(element).html('');
        $(element).html(videoTemplate.replace("<video-thumbnail>", thumbnail));

        var $e = $(element),
            videoType = video.type,
            $video = $e.find("video"),
            videoElement = $video[0];

        $video.find("source").attr("src", video.url)
        $video.find("source").attr("type", videoType)

        if (video.url.length) {
          $video.on("ended", videoEnded);
          $e.removeClass("no-video");
          videoElement.play();
        } else {
          resetVideo()
        }
      };
      VideoPlayerService.onVideoLoad(setVideo)
      VideoPlayerService.onStop(resetVideo)
    }
  };
}]);
},{}],8:[function(require,module,exports){
app.service("VideoPlayerService", ["CRGGameService", "$rootScope",function (game, $rootScope) {
  var videoPlayer = {
    pendingVideo: null,
    loadVideo : null,
    onStop: function (callback) {
      videoPlayer.stopVideo = callback;
    },
    onVideoLoad: function (callback) {
      videoPlayer.loadVideo = callback;
      if(videoPlayer.pendingVideo){
        videoPlayer.loadVideo(videoPlayer.pendingVideo);
      }
    },
    play: function (video) {
      if(videoPlayer.loadVideo){
        videoPlayer.loadVideo(video);
      } else{
        videoPlayer.pendingVideo = video;
      }
    },
    stop: function(){
      videoPlayer.stopVideo && videoPlayer.stopVideo();
    }
  };
  return videoPlayer;
}]);
},{}],9:[function(require,module,exports){
app.factory("CRGDataService", ["$http", "SceneLoader",function ($http, SceneLoader) {
  var
      labelFor = function(scene){
        return SceneLoader[scene.name].label;
      },
      setScene = function(scene){
        scene.label = labelFor(scene)
        return scene;
      };
  return {
    getGame: function(id){
      var url = "assets/data/crg/crg-sample-game-data-<id>.json".replace("<id>", id);
      return $http.get(url).then(function(response){
        response.data.script.scenes = response.data.script.scenes.map(setScene);
        return response.data;
      })
    }
  };
}]);
},{}],10:[function(require,module,exports){
require("./components/passage/passage");
require("./components/video-player-directive");
require("./components/video-player-service");

require("./player/crgameplay");
require("./editor/crg-editor");
require("./scenes/scenes");
require("./crg-data-service");

},{"./components/passage/passage":6,"./components/video-player-directive":7,"./components/video-player-service":8,"./crg-data-service":9,"./editor/crg-editor":13,"./player/crgameplay":21,"./scenes/scenes":41}],11:[function(require,module,exports){
app.controller('CRGEditorController', ['$scope', '$timeout', 'CRGEditorService', function ($scope, $timeout, CRGEditorService) {
  var editor  = CRGEditorService;

  $scope.onTextSelect = function(indexes){
    $timeout(function(){
      var selectedText = indexes.map(function (index) {
        return editor.passageSelector.passage.words[index].text;
      }).join(" ")

      editor.passageSelector.selection.onTextSelect(indexes, selectedText);
    });
  };

  $scope.editor = editor;
}]);
},{}],12:[function(require,module,exports){
app.factory("CRGEditorService", ["Passage", "PassageSelector", "$state", function (Passage, PassageSelector, $state) {
  var findScene = function(name){
    return function(scene){
      return scene.name == name;
    };
  };
  var editorService = {
        gameId: null,
        script: {
          scenes: []
        },
        passage: {
          to: null,
          from: null,
          text: null,
        },
        previewing: [],
        setGameToEdit: function(gameData){
          editorService.script.gameId   = gameData.id;
          editorService.script.scenes   = gameData.script.scenes;
          editorService.passage         = gameData.passage;
          editorService.agent           = gameData.agent;
          editorService.passageSelector =  PassageSelector(Passage(editorService.passage));
        },
        prepareGamePlan : function(scenes){
          var exitScene = editorService.script.scenes.filter(findScene("exit"))[0];
          var previewScenes = scenes ? scenes.concat(exitScene) : null,
              gameData      = JSON.parse(JSON.stringify({
            passage : editorService.passage,
            agent   : editorService.agent,
            script  : {scenes: previewScenes || editorService.script.scenes}
          }));
          return gameData;
        },
        previewScene: function(scene){
          editorService.previewing = [scene];
          $state.go("crg.editor.preview-scenes");
        },
        addScene: function(scene){
          var index = editorService.script.scenes.length - 1;
          editorService.script.scenes.splice(index, 0, scene);
        },
        removeScene: function(sceneToRemove){
          editorService.script.scenes = editorService.script.scenes.filter(function(scene){
            return sceneToRemove !== scene;
          });
        },
        publish: function(){
          console.log(JSON.stringify(editorService.script));
        },
       passageSelector: null
  };
  return editorService;
}]);
},{}],13:[function(require,module,exports){
require('./crg-editor-controller');
require('./preview/crg-preview-controller');
require('./crg-editor-service');
require('./passage-selector');
},{"./crg-editor-controller":11,"./crg-editor-service":12,"./passage-selector":14,"./preview/crg-preview-controller":15}],14:[function(require,module,exports){
app.factory("PassageSelector", ["passageSelectorHeadings", function (passageSelectorHeadings) {
  var scrollTime = 500,
      scrollBackOffset = 200,
      scrollTo = function(position, then){
        $("html, body").stop().animate({scrollTop:position}, scrollTime, 'swing', then || function(){});
      },
      currentScrollPosition = function(){
        return $(window).scrollTop();
      },
      resetSelection = function(){
        window.getSelection().empty();
      };
  return function(passage){
    var passageSelector = {
      selecting: false,
      lastScrollOffset: 0,
      passage: passage,
      selection: {
        current: {text: '', indices: []},
        selectingFocus: false,
        selectingPhrase: false,
        focus: {text: '', indices: []},
        phrase: {text: '', indices: []},
        selectFocus: function () {
          passageSelector.selection.selectingFocus = true;
          passageSelector.selection.selectingPhrase = false;
          passageSelector.heading = passageSelectorHeadings.focus;
        },
        selectPhrase: function () {
          passageSelector.selection.selectingFocus = false;
          passageSelector.selection.selectingPhrase = true;
          passageSelector.heading = passageSelectorHeadings.highlight;
          resetSelection();
        },
        setFocus: function () {
          passageSelector.selection.focus = passageSelector.selection.getTextSelection();
          angular.forEach(passageSelector.passage.words,function(word,index){
            word.focus = passageSelector.selection.focus.indices.indexOf(index) > -1;
          });
          passageSelector.doneSelecting(
              passageSelector.selection.focus
          );
        },
        setPhrase: function () {
          passageSelector.selection.phrase = passageSelector.selection.getTextSelection();
          passageSelector.doneSelecting(
              passageSelector.selection.focus,
              passageSelector.selection.phrase
          );
        },
        onTextSelect: function (indices, text) {
          passageSelector.selection.current.indices = indices.map(function(index){return parseInt(index);});
          passageSelector.selection.current.text = text;
        },
        getTextSelection: function () {
          return {
            indices: passageSelector.selection.current.indices,
            text: passageSelector.selection.current.text
          };
        }
      },
      whenDone: function () {
      },
      reset: function () {
        passageSelector.lastScrollOffset = 0;
        passageSelector.selecting = false;
        passageSelector.whenDone = function () {};
        passageSelector.selection.focus = {text: '', indices: []};
        passageSelector.selection.phrase = {text: '', indices: []};
        passageSelector.selection.selectingFocus = false;
        passageSelector.selection.selectingPhrase = false;
        passageSelector.heading = null;
        angular.forEach(passageSelector.passage,function(word){
          word.focus = false;
          word.highlight = false;
        });
        resetSelection();
      },

      selectFocusFromPassage: function (params) {
        passageSelector.lastScrollOffset = currentScrollPosition();
        scrollTo(0);
        passageSelector.selecting = true;
        passageSelector.whenDone = params.whenDone;
        passageSelector.selection.selectFocus();
      },

      selectHighlightFromPassage: function (params) {
        passageSelector.lastScrollOffset = currentScrollPosition();
        scrollTo(0);
        passageSelector.selecting = true;
        passageSelector.selection.focus = params.focus || passageSelector.selection.focus;
        passageSelector.whenDone = params.whenDone;
        passageSelector.selection.selectPhrase();
      },

      doneSelecting: function (focus, phrase) {
        passageSelector.whenDone({
          focus: focus,
          phrase: phrase
        });
        scrollTo(passageSelector.lastScrollOffset + scrollBackOffset);
        passageSelector.reset();
      }
    }
    return passageSelector;
  };
}]);
},{}],15:[function(require,module,exports){
app.controller('CRGPreviewController', [function () {
  window.scrollTo(0,0);
}]);
},{}],16:[function(require,module,exports){
app.directive("scrollToBottomOnResize", [function(){

  return {
    restrict : "A",
    scope    : false,
    link     : function(scope, element, attrs){

      var
          scrollToBottom = function () {
            var $chatHistory = $(".chat-history")
            $chatHistory.stop().animate({scrollTop: $chatHistory[0].scrollHeight}, 100, 'swing', function () {
            });
          },
          resize = function () {
            var $dialogues         = $(".chat-history"),
                inputHeight        = $(".chat-input").height();

            $dialogues.css("padding-bottom",inputHeight);
          },
          updateChatHistory = function (ready) {
            resize();
            scrollToBottom();
          };

      scope.$watch("game.player.chat.input.ready", updateChatHistory);
    }
  };
}]);
},{}],17:[function(require,module,exports){
app.controller('CRGameplayController', ['$scope', '$timeout', 'CRGPlayer', 'CRGGameService', 'gamePlan', function ($scope, $timeout, CRGPlayer, CRGGameService, gamePlan) {

  var game    = CRGGameService;

  $scope.onTextSelect = function(indexes){
    $timeout(function(){
      game.selectedText = indexes.map(function (index) {
        return game.player.passage.words[index].text;
      }).join(" ");
      game.player.onTextSelection({indices: indexes, text: game.selectedText});
    });
  };

  $scope.game = game;
}]);
},{}],18:[function(require,module,exports){
app.service("CRGGameScript", ["SceneLoader", "$injector", function (SceneLoader, $injector) {

  var getSceneLoader = function(name){
    return $injector.get(SceneLoader[name].entry);
  };

  var
      script = {
        scenes    : [],
        sceneIndex: -1,
        next: function(){
          var nextScene = script.scenes[script.sceneIndex++];
          return getSceneLoader(nextScene.name)(nextScene.config);
        },
        load: function(scriptData){
          script.scenes     = scriptData.scenes;
          script.sceneIndex = 0;
        }
      };
  return script;
}]);
},{}],19:[function(require,module,exports){
app.factory("CRGGameService", [function () {
  var game = {
    player: null
  };
  return game;
}]);
},{}],20:[function(require,module,exports){
app.service("CRGPlayer", ["CRGGameScript", "Passage", "VideoPlayerService", "$timeout",function (CRGGameScript, Passage, VideoPlayerService, $timeout) {
  var FLASH_TIMEOUT = 3000,
      user  = {
        type : "user",
        image: "assets/images/anonymous.png",
      },
      agent = {
        type : "agent",
        image: null,
        videoThumbnail: null,
      };
  var player = {
    points: 10,
    sound: true,
    input: '',
    typing: true,
    selectedText: null,
    passage: null,
    mode: {chat: false},
    video: {
      url: '',
      type: '',
      fullscreen: false,
      whenDone: function(){},
      ended: function(){
        $timeout(function(){
          player.video.whenDone();
        });
      },
      play: function(video){
        player.video.url  = video.url;
        player.video.type = video.type;
        player.video.fullscreen = video.fullscreen;
        VideoPlayerService.stop();
        VideoPlayerService.play(video);
        return {
          then: function(callback){
            player.video.whenDone = callback;
          }
        };
      },
      stop: function(){
        VideoPlayerService.stop();
      }
    },
    chat: {
      agent: agent,
      user: user,
      dialogues: [],
      input: {
        ready: false,
      },
      reset: function(){
        player.chat.dialogues = [];
        player.chat.input.ready = false;
      },
      add: {
        fromUser: function(text){
          player.chat.dialogues.push({
            sender: player.chat.user,
            text  : text,
          });
        },
        fromAgent: function(text){
          player.chat.dialogues.push({
            sender: player.chat.agent,
            text  : text
          });
        },
      },
    },
    exit: function(){
      window.history.back();
    },
    load: function(gameData){
      player.passage = Passage(gameData.passage);
      player.chat.agent.image = gameData.agent.smallProfilePicture;
      player.chat.agent.videoThumbnail = gameData.agent.videoPlaceholder;
      CRGGameScript.load(gameData.script);
      player.start();
    },
    reset: function(){
      player.input = '';
      player.chat.input.ready = false;
      player.video.stop();
      player.video.url = "";
      player.video.type = "";
      player.video.fullscreen = false;
    },
    transitTo: function(state){
      player.reset();
      player.state = state;
      player.setHighlightText(state.highlightPhrase);
      player.setFocusText(state.focusPhrase);
      state.load();
    },
    state: null,
    setFocusText: function(phrase){
      angular.forEach(player.passage.words, function(word, index){
        word.focus = phrase.indices.indexOf(index) > -1;
      });
    },
    setHighlightText: function(phrase){
      angular.forEach(player.passage.words, function(word, index){
        word.highlight = phrase.indices.indexOf(index) > -1;
      })
    },
    onTextSelection: function(phrase){
      if(player.state.onTextSelection){
        player.state.onTextSelection(phrase);
      }
    },
    resetSelection: function(){
      window.getSelection().empty();
    },
    flashHighlight: function(phrase, retain){
      player.resetSelection();
      angular.forEach(phrase.indices, function(wordIndex){
        player.passage.words[wordIndex].flash = true;
      });
      if(!retain){
       $timeout(function(){
         angular.forEach(phrase.indices, function(wordIndex){
           player.passage.words[wordIndex].flash = false;
         });
       },FLASH_TIMEOUT);
      }
    },
    toNextScene: function(){
      player.transitTo(CRGGameScript.next());
    },
    start: function(){
      player.toNextScene();
    }
  };
  return player;
}]);
},{}],21:[function(require,module,exports){
require('./crg-game-service');
require('./crg-game-controller');
require('./phrase-selector');
require('./selection-pointer');
require('./crg-player-service');
require('./crg-game-script');
require('./chat-window/chat-history/scroll-bottom-on-resize');
},{"./chat-window/chat-history/scroll-bottom-on-resize":16,"./crg-game-controller":17,"./crg-game-script":18,"./crg-game-service":19,"./crg-player-service":20,"./phrase-selector":22,"./selection-pointer":23}],22:[function(require,module,exports){
app.directive("phraseSelector", [function () {
  var getSelectionText = function (){

    var selection = window.getSelection();
    if(!selection || selection.type == 'None'){
      return [];
    }
    var
        range     = selection.getRangeAt(0),
        elements  = range.cloneContents().children ,
        node      = [];

    if(!elements.length){
      elements = [selection.anchorNode.parentElement];
    }
    for(var i = 0; i < elements.length; i++){
      node.push(angular.element(elements[i]).attr('data-word-number'))
    }
    return node.filter(function(index){return index !=undefined ;});
  };

  return {
    restrict: "C",
    scope   : true,
    link    : function (scope, element, attrs) {
      var highlightSelected = function () {
        var selections = getSelectionText();
        $("[data-word-number]").removeClass("selected-word");
        selections.forEach(function(dataWordNumber){
          var selector = "[data-word-number='<number>']".replace('<number>', dataWordNumber);
          $(selector).addClass("selected-word");
        });
        scope.$selection.indices = selections;
        scope.$eval(attrs.onTextSelect);
      };
      document.addEventListener("selectionchange", highlightSelected, false);
      scope.$selection = {indices: []};
    }
  };
}]);


},{}],23:[function(require,module,exports){
app.directive("selectionPointer", [function () {

  return {
    restrict: "C",
    scope   : false,
    link    : function (scope, element, attrs) {
      scope.$watch("$selection.indices", function(indices){
        if(indices.length){
          var firstSelectedWord = $(element).find("[data-word-number='<index>']".replace('<index>', indices[0])),
              wordHeight = 25,
              y = firstSelectedWord.position().top - wordHeight,
              x = firstSelectedWord.position().left;

          $(element).find(".selection-options").css("transform", "translateX(<x>px) translateY(<y>px)".replace('<x>', x).replace('<y>',y ));
        }else{
          $(element).find(".selection-options").css("transform", "scale(0)");
        }

      }, true);
    }
  };
}]);


},{}],24:[function(require,module,exports){
app.directive("setFocus", ['CRGEditorService', function(CRGEditorService){

  return {
    restrict : "A",
    scope    : false,
    link     : function(scope, element, attrs){
      element.on("click", function(){
        CRGEditorService.passageSelector.selectFocusFromPassage({
          whenDone: function(selection){
            scope.scene.config.focus = selection.focus;
          }
        })
      });
    }
  };
}]);
},{}],25:[function(require,module,exports){
app.directive("setHighlight", ['CRGEditorService', function(CRGEditorService){

  return {
    restrict : "A",
    scope    : false,
    link     : function(scope, element, attrs){
      element.on("click", function(){
        CRGEditorService.passageSelector.selectHighlightFromPassage({
          focus : scope.scene.config.phrase,
          whenDone: function(selection){
            scope.scene.config.phrase = selection.phrase;
          }
        })
      });
    }
  };
}]);
},{}],26:[function(require,module,exports){
app.directive("addKeyImage", ['CRGEditorService', function(CRGEditorService){

  return {
    restrict : "A",
    scope    : false,
    link     : function(scope, element, attrs){
      element.on("click", function(){
        CRGEditorService.passageSelector.selectHighlightFromPassage({
          whenDone: function(selection){
            scope.keyImage.phrase = selection.phrase;
          }
        })
      });
    }
  };
}]);
},{}],27:[function(require,module,exports){
app.factory("BaseScene", ["CRGGameService", function (game) {
  return function(scene, config){
    scene.group             = config.group;
    scene.showInput         = !!scene.submitInput;
    scene.buttons           = scene.buttons         || [];
    scene.highlightPhrase   = scene.highlightPhrase || {indices: []};
    scene.focusPhrase       = scene.focusPhrase     || {indices: []};
    scene.transcript        = scene.transcript      || {text: ""};
    scene.submitInput       = scene.submitInput     || function(userInput){};
    scene.load              = function(){
      scene._loadTime        = (new Date()).getTime();
      if(config.sceneLoadVideo){
        game.player.video.play(config.sceneLoadVideo).then(function(){
          scene._videoEndedAt   = (new Date()).getTime();
          if(scene.afterVideo){
            scene.afterVideo();
          }
        });
      }
    };

    scene.textSelectedIsClose = scene.textSelectedIsClose;
    return scene;
  };
}]);
},{}],28:[function(require,module,exports){
app.factory("ExitGameState", [function () {
  return function () {
    var state = {
      showInput: false,
      buttons: [{
        label: "Exit",
        onClick: function(){
          window.history.back();
        },
      }],
      transcript: {text: "End of game."},
      highlightPhrase: {indices: []},
      focusPhrase    : {indices: []},
    };

    return state;
  };
}]);
},{}],29:[function(require,module,exports){
app.factory("DoneReadingPassageState", ["EnterMainIdeaState", "CRGGameService", "BaseScene", function (EnterMainIdeaState, game, BaseScene) {
  return function(config){
    var transcript = "Did the passage make sense ?";
    var acceptInput = function(message){
      game.player.chat.add.fromAgent(transcript);
      game.player.chat.add.fromUser(message);

      game.player.transitTo(EnterMainIdeaState(config));
    };


    var state = {
      transcript: {text: transcript},
      buttons: [
        {
          label: "Definitely",
          onClick: function () {
            acceptInput("Definitely");
          }}, {
          label: "Sort of",
          onClick: function () {
            acceptInput("Sort of");
          }}, {
          label: "Not Really",
          onClick: function () {
            acceptInput("Not Really");
          }}]
    };
    return BaseScene(state, config);
  };
}]);
},{}],30:[function(require,module,exports){
app.factory("EnterMainIdeaState", ["CRGGameService", "BaseScene",function (game, BaseScene) {
  return function(config){
    var transcript = "Describe the main idea in 120 characters or less.";
    return BaseScene({
      transcript: {text: transcript},
      submitInput : function(userInput){
        game.player.chat.add.fromAgent(transcript);
        game.player.chat.add.fromUser(userInput);

        game.player.toNextScene();
      }
    }, config);
  };
}]);
},{}],31:[function(require,module,exports){
app.factory("ReadingPassageState", ["DoneReadingPassageState", "CRGGameService", "BaseScene", function (DoneReadingPassageState, game, BaseScene) {
  return function(config){
    var agentSays = "Before Attempting any skills, read the passage to the left.";
    var userSaid = "I am done!";

    var state = {
      load: function () {
        game.player.video.play(config.sceneLoadVideo).then(function () {
          state.buttons = [
            {
              label: userSaid,
              onClick: function () {
                game.player.chat.add.fromAgent(agentSays);
                game.player.chat.add.fromUser(userSaid);
                game.player.transitTo(DoneReadingPassageState(config))
              }
            }
          ];
        });
      },
      showInput: false,
      transcript: {text: agentSays},
    };
    return BaseScene(state, config);
  };
}]);
},{}],32:[function(require,module,exports){
app.service("FindPhraseEditor", ['SceneLoader', function (SceneLoader) {

  var findPhraseEditor = {
        createFor: function(group){
          return             {
            "group"       : group,
            "name"        : "find-all-key-images",
            label         : SceneLoader["find-all-key-images"].label,
            "config":       {
              "transcript" : {"text": ""},
              "expectedCorrectAnswers" : 1,
              placeholder         : 'Select text form passage',
              "findMoreMessage": "Carry on. Find <selections-left> more.",
              "minimumSelectedMessage" : "Well done! However, we found <more-options> more.",
              "keyImages": []
            }
          };
        }
      };
  return findPhraseEditor;
}]);
},{}],33:[function(require,module,exports){
app.factory("DisplayAllKeyImages", ["CRGGameService", "BaseScene",function (game, BaseScene) {

  return function(config, data){
    var allImagesWords = config.keyImages.map(function(keyImage){return keyImage.phrase.indices;}).join().split(",").map(function(index){return parseInt(index)});

    game.player.flashHighlight({indices: allImagesWords}, true)
    var transcript = config.minimumSelectedMessage || "Here is everything we found.";
    return BaseScene({
      buttons     : [{
        label: "Proceed",
        onClick: function(){
          game.player.toNextScene();
        },
      }],
      highlightPhrase: {indices: config.keyImages.map(function(keyImage){return keyImage.phrase.indices;}).join().split(",").map(function(index){return parseInt(index)})},
      transcript: {text: transcript.replace("<more-options>", data.moreOptions)}
    }, config);
  };
}]);
},{}],34:[function(require,module,exports){
app.factory("FindAllKeyImages", ["CRGGameService", "DisplayAllKeyImages",  "BaseScene", function (game, DisplayAllKeyImages, BaseScene) {
  var MIN_SELECTION_DISTANCE = 0.5,
      numberLabels = {
        1 : "one",
        2 : "two",
        3 : "three",
        4 : "four",
        5 : "five",
        6 : "six",
        7 : "seven",
        8 : "eight",
        9 : "nine",
        10 : "ten",
        11 : "eleven",
        12 : "twelve",
        13 : "thirteen",
        14 : "fourteen",
        15 : "fifteen",
      },
      selectionDistance = function(selection, expectedPhrase){
        var common = selection.indices.filter(function(index){
          return expectedPhrase.indices.indexOf(parseInt(index)) > -1;
        });
        return common.length/selection.indices.length;
      },
      selectionIsCloseEnough = function(selected, options){
        var closeEnough = options.filter(function(expected){
          return selectionDistance(selected, expected) > MIN_SELECTION_DISTANCE;
        });
        return closeEnough.length;
      },
      expectedSelectionIndex = function(selected, options){
        var foundOptionIndex = -1;
        options.forEach(function (expected, index) {
          var isExpected = selected.indices.length == expected.indices.length && selectionDistance(selected, expected) == 1;
          foundOptionIndex = isExpected ? index: foundOptionIndex;
        })
        return foundOptionIndex;
      },
      getPhrase = function(keyImage){
        return keyImage.phrase;
      };
  return function (config) {
    var findMoreMessageTemplate = config.findMoreMessage || "Good. Find <selections-left> more.";
    var state = {
      transcript        : {text : config.transcript.text},
      expectedSelections  : config.keyImages.map(getPhrase),
      textSelectedIsClose : false,
      placeholder         : config.placeholder || 'Select text form passage',
      expectedCorrectAnswers: config.expectedCorrectAnswers || config.keyImages.length,
      onTextSelection   : function(selectedPhrase){
        var selectedOptionIndex = expectedSelectionIndex(selectedPhrase, state.expectedSelections),
            isCorrect = selectedOptionIndex > -1,
            closeEnough = !isCorrect && selectionIsCloseEnough(selectedPhrase, state.expectedSelections);

        state.textSelectedIsClose = closeEnough;
        isCorrect && state.onCorrectSelection(selectedPhrase,selectedOptionIndex);
      },
      onCorrectSelection: function(phrase, selectedOptionIndex){
        state.expectedSelections.splice(selectedOptionIndex, 1);
        game.player.flashHighlight({indices: phrase.indices.map(function(i){return parseInt(i);})}, true);

        game.player.chat.add.fromAgent(state.transcript.text);
        game.player.chat.add.fromUser('"' + phrase.text + '"');

        var correctAnsers = config.keyImages.length - state.expectedSelections.length,
            selectionsLeft = state.expectedCorrectAnswers - correctAnsers ;
        if(!selectionsLeft){
          state.allExpectedPhrasesSelected();
        } else{
          var nextMessage = findMoreMessageTemplate.replace("<selections-left>", numberLabels[selectionsLeft]);
          state.transcript.text = nextMessage;
        }
      },
      allExpectedPhrasesSelected: function(){
        var data = {
          moreOptions: numberLabels[config.keyImages.length - state.expectedCorrectAnswers]
        };
        config.keyImages.length > 1 ? game.player.transitTo(DisplayAllKeyImages(config, data)):game.player.toNextScene();
      }
    };
    return BaseScene(state, config);
  };
}]);
},{}],35:[function(require,module,exports){
app.service("MultiChoiceEditor", ['SceneLoader', function (SceneLoader) {

  var multiChoiceEditor = {
        createFor: function(group){
          return             {
            "group"       : group,
            "name"        : "multi-choice",
            label         : SceneLoader["multi-choice"].label,
            "config"      : {
              "phrase": {"indices": [], "text"  : ""},
              "focus": {"indices" : [], "text"  : ""},
              "question":  "",
              "options": [],
              correctMessage: "That was correct answer.",
            }
          };
        }
      };
  return multiChoiceEditor;
}]);
},{}],36:[function(require,module,exports){
app.factory("AskMultiChoiceQuestion", ["MultiChoiceResult", "CRGGameService", "BaseScene", function (MultiChoiceResult, game, BaseScene) {
  return function (config) {
    var selectedByUser = function (option) {
          return option.input;
        },
        optionText = function(option){
          return option.label;
        };
    var state = {
      showInput: false,
      buttons: [
        {
          label: 'Submit',
          onClick: function(){
            var selectedOptions = state.options.filter(selectedByUser).map(optionText).join(", ").replace(new RegExp(',$'), '');
            game.player.chat.add.fromAgent(config.question);
            game.player.chat.add.fromUser(selectedOptions);

            if(config.correctMessage){
              game.player.transitTo(MultiChoiceResult(config, state.options));
            } else{
              game.player.toNextScene();
            }
          }
        }],
      options: config.options.map(function(usage){
        return {
          label: usage.label,
          correct: usage.correct,
        }
      }),
      transcript: {text: config.question},
      highlightPhrase: config.phrase,
      focusPhrase    : config.focus,
    };
    return BaseScene(state, config);
  };
}]);
},{}],37:[function(require,module,exports){
app.factory("MultiChoiceResult", ["CRGGameService", "BaseScene", function (game, BaseScene) {
  return function (config, input) {
    var correctMessage = config.correctMessage || "That's correct.";
    var
        result = config.options.map(function (option, index) {
          return {
            label: option.label,
            correct: option.correct,
            result: input[index].input == option.correct
          }
        }),
        isIncorrect = function (option) {
          return !option.result;
        },
        incorrectAnswer = result.filter(isIncorrect).length > 0,
        message = incorrectAnswer ? config.answerExplanation : correctMessage;

    var state = {
      buttons: [
        {
          label: 'Proceed',
          onClick: function(){
            game.player.chat.add.fromAgent(message);
            game.player.toNextScene();
          }
        }],
      //result: result,
      transcript: {text: message},
      highlightPhrase: config.phrase,
      focusPhrase    : config.focus,
    };
    return BaseScene(state, config);
  };
}]);
},{}],38:[function(require,module,exports){
app.factory("PlayVideoState", ["DoneReadingPassageState", "CRGGameService", "BaseScene", function (DoneReadingPassageState, game, BaseScene) {
  return function(config){
    var userSaid = config.nextButtonLabel,
        agentSaid = config.sceneLoadVideo.transcript,
        skipMessage = config.skipMessage || 'Skip',
        buttons     = config.nextButton ? []:[];

    var state = {
      afterVideo: function () {
        if(config.autoNext){
          game.player.toNextScene();
        }else{
          state.buttons = [
            {
              label: userSaid,
              onClick: function () {
                game.player.chat.add.fromAgent(agentSaid);
                game.player.chat.add.fromUser(userSaid);
                game.player.toNextScene();
              }
            }
          ];
        }
      },
      buttons: config.canSkip ? [{

        label: skipMessage,
        onClick: function () {
          game.player.chat.add.fromAgent(agentSaid);
          game.player.chat.add.fromUser(skipMessage);
          game.player.toNextScene();
        }
      }] : [],
      transcript: {text: agentSaid},
    };
    return BaseScene(state, config);
  };
}]);
},{}],39:[function(require,module,exports){
app.factory("ReadingTextState", ["CRGGameService", "BaseScene", function (game, BaseScene) {

  return function (config) {

    var
        getTime = function(){return (new Date()).getTime();},
        timeForAction = config.waitForAction.timeToWait*1000,
        askToWaitVideo = config.waitForAction.beforeTimeVideo,
        state = {
          afterVideo: function () {
            state.buttons = [{
              label: config.nextButtonLabel,
              onClick: function () {
                var timePassed = (getTime() - state._videoEndedAt),
                    shouldWait = timeForAction > timePassed;
                if (shouldWait) {
                  game.player.video.play(askToWaitVideo);
                } else {
                  game.player.toNextScene();
                }
              }
            }
            ]
          },
          buttons: [],
          transcript: {text: config.sceneLoadVideo.transcript}
        };

    return BaseScene(state, config);
  };
}]);
},{}],40:[function(require,module,exports){
app.controller("SceneEditorController", ['$scope','$injector', 'MultiChoiceEditor', 'SceneLoader', function ($scope, $injector, MultiChoiceEditor, SceneLoader) {

  var sceneConfigs = [];
  for(var scene in SceneLoader){
    var config = SceneLoader[scene];
    config.name = scene;
    if(config.editor){
      config.editor = $injector.get(config.editor)
      sceneConfigs.push(config);
    }
  }

  $scope.sceneConfigs = sceneConfigs;
  $scope.sceneEditors  = {
    multiChoice: MultiChoiceEditor
  };
}]);
},{}],41:[function(require,module,exports){
require('./scene-editor-controller');
require('./crg-base-scene');
require('./components/set-focus-directive');
require('./components/set-highlight-directive');
require('./components/set-key-image-directive');

require('./intro/states/reading-passage-state');
require('./intro/states/done-reading-passage-state');
require('./intro/states/enter-main-idea-state');
require('./exit/states/exit-game-state');

require('./text-input/text-input-editor');
require('./text-input/states/text-input-state');

require('./yes-no-choice/states/ask-question');
require('./yes-no-choice/states/wrong-answer');
require('./yes-no-choice/yes-no-editor');

require('./multi-choice/multi-choice-editor');
require('./multi-choice/states/ask-multi-choice-question-state');
require('./multi-choice/states/multi-choice-result-state');

require('./key-images/states/find-all-key-images-state');
require('./key-images/states/display-all-key-images-state');
require('./key-images/find-phrase-editor');

require('./play-video/play-video-state');
require('./reading-text/reading-text-state');

},{"./components/set-focus-directive":24,"./components/set-highlight-directive":25,"./components/set-key-image-directive":26,"./crg-base-scene":27,"./exit/states/exit-game-state":28,"./intro/states/done-reading-passage-state":29,"./intro/states/enter-main-idea-state":30,"./intro/states/reading-passage-state":31,"./key-images/find-phrase-editor":32,"./key-images/states/display-all-key-images-state":33,"./key-images/states/find-all-key-images-state":34,"./multi-choice/multi-choice-editor":35,"./multi-choice/states/ask-multi-choice-question-state":36,"./multi-choice/states/multi-choice-result-state":37,"./play-video/play-video-state":38,"./reading-text/reading-text-state":39,"./scene-editor-controller":40,"./text-input/states/text-input-state":42,"./text-input/text-input-editor":43,"./yes-no-choice/states/ask-question":44,"./yes-no-choice/states/wrong-answer":45,"./yes-no-choice/yes-no-editor":46}],42:[function(require,module,exports){
app.factory("TextInputState", ["CRGGameService", "BaseScene", function ( game, BaseScene) {
  return function (config) {
    var transcript = config.transcript.text || "What do you imagine when you read the highlighted text ?";
    var state = {
      transcript: {text: transcript},
      highlightPhrase: config.phrase,
      focusPhrase    : config.focus,
      submitInput: function (userInput) {
        game.player.chat.add.fromAgent(transcript);
        game.player.chat.add.fromUser(userInput);

        game.player.toNextScene();
      }
    };
    return BaseScene(state, config);
  };
}]);
},{}],43:[function(require,module,exports){
app.service("TextInputEditor", ['SceneLoader', function (SceneLoader) {

  var textInputEditor = {
        createFor: function(group){
          return             {
            "group"       : group,
            "name"        : "text-input",
            label         : SceneLoader["text-input"].label,
            "config"      : {
              "phrase": {"indices": [], "text"  : ""},
              "focus": {"indices" : [], "text"  : ""},
              "transcript": {"text"    : ""},
              "options": []
            }
          };
        }
      };
  return textInputEditor;
}]);
},{}],44:[function(require,module,exports){
app.factory("AskQuestion", ['CRGGameService', 'WrongAnswerToYesNo',  'BaseScene', function (game, WrongAnswerToYesNo, BaseScene) {
  return function (config) {
    var state = {
      showInput: false,
      buttons: [
        {
          label: 'Yes',
          onClick: function(){
            config.expectedYes ? game.player.toNextScene() : game.player.transitTo(WrongAnswerToYesNo(config));
          }
        },
        {
          label: 'No',
          onClick: function(){
            config.expectedYes ? game.player.transitTo(WrongAnswerToYesNo(config)) :  game.player.toNextScene();
          }
        }
      ],
      transcript        : {text: config.question},
      highlightPhrase   : config.phrase,
      focusPhrase       : config.focus
    };
    return BaseScene(state, config);
  };
}]);
},{}],45:[function(require,module,exports){
app.factory("WrongAnswerToYesNo", ["CRGGameService", "BaseScene", function ( game, BaseScene) {
  return function (config) {
    var state = {
      buttons: [
        {
          label: 'Proceed',
          onClick: function(){
            game.player.toNextScene();
          }
        }],
      transcript: {text: config.wrongAnswerMessage},
      highlightPhrase: config.phrase,
      focusPhrase    : config.focus
    };
    return BaseScene(state, config);
  };
}]);
},{}],46:[function(require,module,exports){
app.service("YesNoEditor", ['SceneLoader', function (SceneLoader) {

  var textInputEditor = {
        createFor: function(group){
          var sceneName = "yes-no";
          return             {
            "group"           : group,
            "name"            : sceneName,
            label             : SceneLoader[sceneName].label,
            "config"          : {
              "phrase"        : {"indices" : [], "text"    : ""},
              "focus"         : {"indices" : [], "text"    : ""},
              "question"      : "",
              "expectedYes"   : false,
              "wrongAnswerMessage": ""
            }
          };
        }
      };
  return textInputEditor;
}]);
},{}],47:[function(require,module,exports){
app.config(["$stateProvider", "$urlRouterProvider", "$locationProvider",function($stateProvider, $urlRouterProvider, $locationProvider){

	$urlRouterProvider.otherwise('/crg');
	$stateProvider
			.state('crg', {
				url: '/crg',
				templateUrl: 'assets/templates/crg-template.html'
			})
			.state('crg.gameplay', {
				url: '/play/:id',
				templateUrl: 'assets/templates/crg-gameplay-template.html',
        controller: 'CRGameplayController',
        resolve : {
          gamePlan: ['CRGDataService', 'CRGPlayer', 'CRGGameService','$stateParams', function(CRGDataService, CRGPlayer,game,  $stateParams){
            return CRGDataService.getGame($stateParams.id).then(function(gameData){
              game.player = CRGPlayer;
              CRGPlayer.chat.reset();
              CRGPlayer.load(gameData);
              return gameData;
            });
          }]
        }
			})
      .state('crg.editor', {
        url: '/editor/:id',
        templateUrl: 'assets/templates/crg-editor-template.html',
        controller: 'CRGEditorController',
        resolve : {
          gamePlan: ['CRGDataService', 'CRGEditorService', '$stateParams', function(CRGDataService, CRGEditorService, $stateParams){
            return CRGDataService.getGame($stateParams.id).then(function(gameData){
              CRGEditorService.setGameToEdit(gameData);
            });
          }]
        }
      })
      .state('crg.editor.preview', {
        url: '/preview',
        templateUrl: 'assets/templates/crg-preview-template.html',
        controller: 'CRGameplayController',
        resolve : {
          gamePlan: ['CRGEditorService', 'CRGGameService', 'CRGPlayer', function(CRGEditorService, game, CRGPlayer){
            var gameData = CRGEditorService.prepareGamePlan();
            game.player = CRGPlayer;
            CRGPlayer.chat.reset();
            CRGPlayer.load(gameData);
            return gameData;
          }]
        }

      })
      .state('crg.editor.preview-scenes', {
        url: '/preview-scenes',
        templateUrl: 'assets/templates/crg-preview-template.html',
        controller: 'CRGameplayController',
        resolve : {
          gamePlan: ['CRGEditorService', 'CRGGameService', 'CRGPlayer', function(CRGEditorService, game, CRGPlayer){
            var gameData = CRGEditorService.prepareGamePlan(CRGEditorService.previewing);
            game.player = CRGPlayer;
            CRGPlayer.chat.reset();
            CRGPlayer.load(gameData);
            return gameData;
          }]
        }
      });
}]);

},{}],48:[function(require,module,exports){
app.value("stateMessages", {
  "default"     : "Loading ",
});

app.value("passageSelectorHeadings", {
  focus  : {
    label       : "Select text for student to focus upon.",
    description   : "This is the part of passage that the student should focus on while answering questions in this scene.",
  },
  highlight  : {
    label       : "Select text to highlight",
    description   : "This is tha part of text that will be highlighted for student to analyze.",
  }
});

app.value("SceneLoader", {
  "intro"                 :{
    entry: "ReadingPassageState",
    label: "Main Idea"
  },
  "reading-text-scene" :{
    entry: "ReadingTextState",
    label: "Play Video"
  },
  "play-video"                 :{
    entry: "PlayVideoState",
    label: "Play Video"
  },
  "text-input"            :{
    entry: "TextInputState",
    label: "Input Text",
    editor: "TextInputEditor",
  },
  "multi-choice"          :{
    entry: "AskMultiChoiceQuestion",
    label: "Multiple Choice Question",
    editor: "MultiChoiceEditor"
  },
  "yes-no"                :{
    entry: "AskQuestion",
    label: "Yes/No Question",
    editor: "YesNoEditor"
  },
  "find-all-key-images"   :{
    entry: "FindAllKeyImages",
    label: "Find Phrase",
    editor: "FindPhraseEditor"
  },
  "exit"                  : {
    entry: "ExitGameState",
    label: "Exit"
  }
});
},{}],49:[function(require,module,exports){
require("./app/app");
require("./app/variables");
require("./app/config");
require("./app/routes");
require("./app/components/forms/drop-down");
require("./app/components/state-loader/state-loader");
require("./app/components/typewriter/typewriter");

require("./app/crg/crg");
},{"./app/app":1,"./app/components/forms/drop-down":2,"./app/components/state-loader/state-loader":3,"./app/components/typewriter/typewriter":4,"./app/config":5,"./app/crg/crg":10,"./app/routes":47,"./app/variables":48}]},{},[49]);
