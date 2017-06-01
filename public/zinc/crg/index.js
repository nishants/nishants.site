(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.app = angular.module("zinc", ['ui.router', 'ngDraggable']);
},{}],2:[function(require,module,exports){
app.directive("typewriter",["$timeout", function($timeout){
  return {
    restrict: "C",
    scope: false,
    link: function(scope, element, attrs){
      if(attrs.text){
        var chars = [],
            $e    = $(element),
            speed = parseInt(attrs.typingSpeed) || 100,
            done  = true,
            lastTimeout,
            beforeTyping = function(){
              $timeout(function(){
                done = false;
                attrs.beforeTyping && scope.$eval(attrs.beforeTyping);
              });
            },
            afterTyping = function(){
              $timeout(function(){
                done = true;
                attrs.afterTyping && scope.$eval(attrs.afterTyping);
              });
            },
            clear = function(){
              $e.html('');
            },
            type = function(){
              clearTimeout(lastTimeout);
              if(chars.length > 0){
                $e.append(chars.shift());
                if(done){
                  beforeTyping();
                }
              }else{
                if(!done){
                  afterTyping();
                }
              }
              lastTimeout = setTimeout(type, speed);
            };
        scope.$watch(attrs.text, function(text){
          clear();
          chars = text.split('');
          clearTimeout(lastTimeout);
          lastTimeout = setTimeout(type, speed);
        });
      }
    }
  };
}])
},{}],3:[function(require,module,exports){
angular.module("zinc").directive("dropDown", [function () {

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
},{}],4:[function(require,module,exports){
angular.module("zinc").run(["$rootScope", "stateMessages" ,function($rootScope, stateMessages){
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
app.factory("CRGDataService", ["$http",function ($http) {
  var
      labelFor = function(scene){
        return scene.name.replace(/-/g, " ");
      },
      setScene = function(scene){
        scene.label = labelFor(scene)
        return scene;
      };
  return {
    getGame: function(id){
      var url = "assets/data/crg-sample-game-data-<id>.json".replace("<id>", id);
      return $http.get(url).then(function(response){
        response.data.script.scenes = response.data.script.scenes.map(setScene);
        return response.data;
      })
    }
  };
}]);
},{}],8:[function(require,module,exports){
require("./components/passage/passage");
require("./player/crgameplay");
require("./editor/crg-editor");
require("./scenes/scenes");
require("./crg-data-service");

},{"./components/passage/passage":6,"./crg-data-service":7,"./editor/crg-editor":11,"./player/crgameplay":17,"./scenes/scenes":25}],9:[function(require,module,exports){
app.controller('CRGEditorController', ['$scope', '$timeout', 'CRGEditorService', 'SceneEditors', function ($scope, $timeout, CRGEditorService, SceneEditors) {
  var editor  = CRGEditorService;

  $scope.onTextSelect = function(indexes){
    $timeout(function(){
      var selectedText = indexes.map(function (index) {
        return editor.passageSelector.passage.words[index].text;
      }).join(" ")

      editor.passageSelector.selection.onTextSelect(indexes, selectedText);
    });
  };

  editor.sceneEditors = SceneEditors;
  $scope.editor = editor;
}]);
},{}],10:[function(require,module,exports){
app.factory("CRGEditorService", ["Passage", "PassageSelector", "$state", function (Passage, PassageSelector, $state) {
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
          editorService.passageSelector =  PassageSelector(Passage(editorService.passage));
        },
        prepareGamePlan : function(scenes){
          var exitScene = editorService.script.scenes[editorService.script.scenes.length - 1];
          var previewScenes = scenes ? scenes.concat(exitScene) : null,
              gameData      = JSON.parse(JSON.stringify({
            passage : editorService.passage,
            script  : {scenes: previewScenes || editorService.script.scenes}
          }));
          return gameData;
        },
        previewScene: function(scene){
          editorService.previewing = [scene];
          $state.go("crg.editor.preview-scenes");
        },
        removeScene: function(sceneToRemove){
          editorService.script.scenes = editorService.script.scenes.filter(function(scene){
            return sceneToRemove !== scene;
          });
        },
       passageSelector: null
  };
  return editorService;
}]);
},{}],11:[function(require,module,exports){
require('./crg-editor-controller');
require('./crg-editor-service');
require('./passage-selector');
},{"./crg-editor-controller":9,"./crg-editor-service":10,"./passage-selector":12}],12:[function(require,module,exports){
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
          passageSelector.selection.selectPhrase();
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
      selectFromPassage: function (params) {
        passageSelector.lastScrollOffset = currentScrollPosition();
        scrollTo(0);
        passageSelector.selecting = true;
        passageSelector.whenDone = params.whenDone;
        passageSelector.selection.selectFocus();
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
},{}],13:[function(require,module,exports){
app.controller('CRGameplayController', ['$scope', '$timeout', 'CRGPlayer', 'CRGGameService', 'gamePlan', function ($scope, $timeout, CRGPlayer, CRGGameService, gamePlan) {

  var game    = CRGGameService;
  game.player = CRGPlayer;

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
},{}],14:[function(require,module,exports){
app.service("CRGGameScript", ["SceneLoader", "$injector", function (SceneLoader, $injector) {

  var getSceneLoader = function(name){
    return $injector.get(SceneLoader.entries[name]);
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
},{}],15:[function(require,module,exports){
app.factory("CRGGameService", [function () {
  var game = {
    player: null
  };
  return game;
}]);
},{}],16:[function(require,module,exports){
app.service("CRGPlayer", ["CRGGameScript", "Passage", "$timeout",function (CRGGameScript, Passage, $timeout) {
  var FLASH_TIMEOUT = 3000;
  var player = {
    points: 10,
    sound: true,
    input: '',
    typing: true,
    selectedText: null,
    passage: null,
    exit: function(){
      window.history.back();
    },
    load: function(gameData){
      player.passage = Passage(gameData.passage);
      CRGGameScript.load(gameData.script);
      player.start();
    },
    transitTo: function(state){
      player.state = state;
      player.setHighlightText(state.highlightPhrase);
      player.setFocusText(state.focusPhrase);
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
},{}],17:[function(require,module,exports){
require('./crg-game-service');
require('./crg-game-controller');
require('./phrase-selector');
require('./selection-pointer');
require('./crg-player-service');
require('./crg-game-script');
},{"./crg-game-controller":13,"./crg-game-script":14,"./crg-game-service":15,"./crg-player-service":16,"./phrase-selector":18,"./selection-pointer":19}],18:[function(require,module,exports){
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


},{}],19:[function(require,module,exports){
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


},{}],20:[function(require,module,exports){
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
},{}],21:[function(require,module,exports){
app.factory("DoneReadingPassageState", ["EnterMainIdeaState", "CRGGameService", function (EnterMainIdeaState, game) {
  return function(){
    var showInput = function(){
      game.player.transitTo(EnterMainIdeaState());
    };

    var state = {
      showInput: false,
      highlightPhrase: {indices: []},
      focusPhrase    : {indices: []},
      transcript: {text: "Did the passage make sense ?"},
      buttons: [
        {
          label: "Definitely",
          onClick: function () {
            showInput(state);
          }}, {
          label: "Sort of",
          onClick: function () {
            showInput(state);
          }}, {
          label: "Not Really",
          onClick: function () {
            showInput(state);
          }}]
    };
    return state;
  };
}]);
},{}],22:[function(require,module,exports){
app.factory("EnterMainIdeaState", ["VisualizePhraseState", "CRGGameService",function (VisualizePhraseState, game) {
  return function(){
    return {
      showInput   : true,
      buttons     : [],
      highlightPhrase: {indices: []},
      focusPhrase    : {indices: []},
      transcript: {text: "Describe the main idea in 120 characters or less."},
      submitInput : function(userInput){
        console.log("user says : " + userInput);
        game.player.toNextScene();
      }
    };
  };
}]);
},{}],23:[function(require,module,exports){
app.factory("ReadingPassageState", ["DoneReadingPassageState", "CRGGameService", function (DoneReadingPassageState, game) {
  return function(){
    return {
      showInput: false,
      highlightPhrase: {indices: []},
      focusPhrase    : {indices: []},
      transcript: {text: "Before Attempting any skills, read the passage to the left."},
      buttons: [
        {
          label: "I am done!",
          onClick: function () {
            game.player.transitTo(DoneReadingPassageState(game))
          }
        }
      ]
    };
  };
}]);
},{}],24:[function(require,module,exports){
app.service("SceneEditors", ['ZincImagineEditorService', 'ZincVisualizeEditorService', function (ZincImagineEditorService, ZincVisualizeEditorService) {


  return {
    zincing: {
      imagine: ZincImagineEditorService,
      visualize: ZincVisualizeEditorService,
    }
  };
}]);
},{}],25:[function(require,module,exports){
require('./scene-editors');
require('./zinc-visualize/zinc-visualize-editor');
require('./zinc-imagine/zinc-imagine-editor');

require('./intro/states/reading-passage-state');
require('./intro/states/done-reading-passage-state');
require('./intro/states/enter-main-idea-state');
require('./zinc-visualize/states/visualize-phrase-state');
require('./zinc-imagine/states/imagine-phrase-state');
require('./zinc-imagine/states/find-example-phrase-state');
require('./zinc-imagine/states/no-example-of-phrase-state');
require('./zinc-imagine/states/choose-example-of-phrase-state');
require('./zinc-key-images/states/find-all-key-images-state');
require('./zinc-key-images/states/display-all-key-images-state');
require('./exit/states/exit-game-state');

},{"./exit/states/exit-game-state":20,"./intro/states/done-reading-passage-state":21,"./intro/states/enter-main-idea-state":22,"./intro/states/reading-passage-state":23,"./scene-editors":24,"./zinc-imagine/states/choose-example-of-phrase-state":26,"./zinc-imagine/states/find-example-phrase-state":27,"./zinc-imagine/states/imagine-phrase-state":28,"./zinc-imagine/states/no-example-of-phrase-state":29,"./zinc-imagine/zinc-imagine-editor":30,"./zinc-key-images/states/display-all-key-images-state":31,"./zinc-key-images/states/find-all-key-images-state":32,"./zinc-visualize/states/visualize-phrase-state":33,"./zinc-visualize/zinc-visualize-editor":34}],26:[function(require,module,exports){
app.factory("ChooseExampleOfPhraseState", ["CRGGameService", function (game) {
  return function (imagine) {
    var state = {
      showInput: false,
      buttons: [
        {
          label: 'Proceed',
          onClick: function(){
            game.player.toNextScene();
          }
        }],
      options: imagine.usages.map(function(usage){
        return {
          label: usage.label,
          correct: usage.correct,
        }
      }),
      transcript: {text: imagine.transcript.text || "Which one of following is not a good example of highlighted phrase ?"},
      highlightPhrase: imagine.phrase,
      focusPhrase    : imagine.focus,
    };
    return state;
  };
}]);
},{}],27:[function(require,module,exports){
app.factory("FindExamplePhraseState", ['NoExampleOfPhraseState', 'ChooseExampleOfPhraseState', 'CRGGameService', function (NoExampleOfPhraseState, ChooseExampleOfPhraseState, game) {
  return function (imagine) {
    var state = {
          showInput: false,
          buttons: [
            {
              label: 'Yes',
              onClick: function(){
                game.player.transitTo(NoExampleOfPhraseState(imagine))
              }
            },
            {
              label: 'No',
              onClick: function(){
                game.player.transitTo(ChooseExampleOfPhraseState(imagine))
              }
            }
          ],
          transcript: {text: "Well done! \n Lets try something more challenging now. \n Does the author give any specific examples of highlighted phrase"},
          highlightPhrase: imagine.phrase,
          focusPhrase    : imagine.focus,
          submitInput: function (userInput) {
            console.log("user imagined : " + userInput);
            game.player.transitTo({});
          }
        };
    return state;
  };
}]);
},{}],28:[function(require,module,exports){
app.factory("ImaginePhraseState", ['FindExamplePhraseState',"CRGGameService", function (FindExamplePhraseState, game) {
  return function (imagine) {
    var state   = {
          showInput       : true,
          buttons         : [],
          transcript      : {text: "List three things you imagine when you read the highlighted phrase."},
          highlightPhrase : imagine.phrase,
          focusPhrase     : imagine.focus,
          submitInput: function (userInput) {
            game.player.transitTo(FindExamplePhraseState(imagine));
          }
        };
    return state;
  };
}]);
},{}],29:[function(require,module,exports){
app.factory("NoExampleOfPhraseState", ['ChooseExampleOfPhraseState',"CRGGameService", function (ChooseExampleOfPhraseState, game) {
  return function (imagine) {
    var state = {
      showInput: false,
      buttons: [
        {
          label: 'Proceed',
          onClick: function(){
            game.player.transitTo(ChooseExampleOfPhraseState(imagine));
          }
        }],
      transcript: {text: "Stop trying too hard. There was no example."},
      highlightPhrase: imagine.phrase,
      focusPhrase    : imagine.focus,
      submitInput: function (userInput) {
        game.player.transitTo({});
      }
    };
    return state;
  };
}]);
},{}],30:[function(require,module,exports){
app.service("ZincImagineEditorService", ['$timeout', 'CRGEditorService', function ($timeout, CRGEditorService) {

  var defaultTranscript = 'List three things you imagine when you read the highlighted phrase : <phrase>',
      zincImagineEditor = {
        list: [],
        remove: function(index){
          zincImagineEditor.list.splice(index, 1);
        },
        add: function(){
          CRGEditorService.passageSelector.selectFromPassage({
            focus: false,
            phrase: true,
            whenDone: function(selection){
              CRGEditorService.game.zincing.imagine.push({
                focus: selection.focus,
                phrase: selection.phrase,
                usages: [],
                transcript: {text: defaultTranscript.replace("<phrase>", selection.phrase.text)},
              });
            }
          });
        }
      };
  return zincImagineEditor;
}]);
},{}],31:[function(require,module,exports){
app.factory("DisplayAllKeyImages", ["CRGGameService",function (game) {

  return function(data){
    var allImagesWords = data.keyImages.map(function(keyImage){return keyImage.phrase.indices;}).join().split(",").map(function(index){return parseInt(index)});

    game.player.flashHighlight({indices: allImagesWords}, true)
    return {
      showInput   : false,
      buttons     : [{
        label: "Proceed",
        onClick: function(){
          game.player.toNextScene();
        },
      }],
      highlightPhrase: {indices: data.keyImages.map(function(keyImage){return keyImage.phrase.indices;}).join().split(",").map(function(index){return parseInt(index)})},
      focusPhrase    : {indices: []},
      transcript: {text: "Here is everything we found."}
    };
  };
}]);
},{}],32:[function(require,module,exports){
app.factory("FindAllKeyImages", ["CRGGameService", "DisplayAllKeyImages", function (game, DisplayAllKeyImages) {
  var MIN_SELECTION_DISTANCE = 0.5,
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
  return function (data) {
    var state = {
      showInput         : false,
      buttons           : [],
      transcript        : {text : data.transcript.text},
      highlightPhrase   : {indices: []},
      focusPhrase       : {indices: []},
      expectedSelections  : data.keyImages.map(getPhrase),
      textSelectedIsClose : false,
      expectedCorrectAnswers: data.expectedCorrectAnswers || data.keyImages.length,
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
        var correctAnsers = data.keyImages.length - state.expectedSelections.length;
        if(correctAnsers == state.expectedCorrectAnswers){
          state.allExpectedPhrasesSelected();
        }
      },
      allExpectedPhrasesSelected: function(){
        game.player.transitTo(DisplayAllKeyImages(data));
      }
    };
    return state;
  };
}]);
},{}],33:[function(require,module,exports){
app.factory("VisualizePhraseState", ['ImaginePhraseState', "CRGGameService", function (ImaginePhraseState, game) {
  var VisualizePhraseState = function (visualize) {
    var state = {
      showInput: true,
      buttons: [],
      transcript: {text: visualize.transcript.text || "What do you imagine when you read the highlighted text ?"},
      highlightPhrase: visualize.phrase,
      focusPhrase    : visualize.focus,
      submitInput: function (userInput) {
        console.log("user visualized : " + userInput);
        game.player.toNextScene();
      }
    };
    return state;
  };
  return VisualizePhraseState;
}]);
},{}],34:[function(require,module,exports){
app.service("ZincVisualizeEditorService", ['$timeout', 'CRGEditorService', function ($timeout, CRGEditorService) {

  var defaultTranscript = 'What do you visualize when you read the phrase "<phrase>"?',
      zincVisualizeEditor = {
        list: [],
        remove: function(index){
          zincVisualizeEditor.list.splice(index, 1);
        },
        add: function(){
          CRGEditorService.passageSelector.selectFromPassage({
            focus: true,
            phrase: true,
            whenDone: function(selection){
              CRGEditorService.game.zincing.visualize.push({
                focus: selection.focus,
                phrase: selection.phrase,
                transcript: {text: defaultTranscript.replace("<phrase>", selection.phrase.text)},
              });
            }
          });
        }
      };
  return zincVisualizeEditor;
}]);
},{}],35:[function(require,module,exports){
angular.module('zinc').controller('GamePlayController', ["$scope", "deckParticipation", "GamePlayService", function($scope, deckParticipation, GamePlayService){
			$scope.gamePlay = GamePlayService.create(deckParticipation);

			$scope.gameplan = deckParticipation.gameplan;
			$scope.deck     = deckParticipation.deck;
			$scope.vocabset    = {id: 1};
			$scope.timer    = {timeLimit: '15s'};
			$scope.user     = {
				points: 100,
				timer : "00:19",
			};
			$scope.gamePlay.next();
		}]
);
},{}],36:[function(require,module,exports){
angular.module("zinc").service("GamePlayService", ["$http", function ($http) {
	var toWord = function(data){
		return {
			name: data.word,
			audio: data.pronunciation_audio,
			synonym: {
				options: data.synonym_option_names.map(function (name) {
					return {
						name: name,
						correct :name ==  data.correct_synonym,
					};
				}),
			},
			image: {
				options: data.image_options.map(function (option) {
					return {
						name: option.word,
						url : option.image_medium_url,
						correct: data.image_medium_url == option.image_medium_url
					};
				}),
			}
		};
	};
	return {
		create: function(data){
			var toggleMode = 0;
			gamePlay = {
				vocabset: {
					id: 2,
					title: data.deck.set_title,
					image: data.deck.set_image_url
				},
				words: data.deck.words.map(toWord),
				challenges: data.deck.words.map(function (word) {
					var word = toWord(word);
					toggleMode++;
					return {
						mode: {
							image  : (toggleMode%2 == 1),
							synonym: (toggleMode%2 == 0)
						},
						word: word,
						skipped: false,
						current: false,
					}
				}),
				current: null,
				_current_index: -1,
				next: function(){
					gamePlay.current = gamePlay.challenges[++gamePlay._current_index];
				},
				hasNext: function(){
					return gamePlay._current_index < gamePlay.challenges.length - 1;
				},
				skip: function () {
					gamePlay.current.skipped = true;
					gamePlay.next();
				}
			};
			return gamePlay;
		}
	}
}]);
},{}],37:[function(require,module,exports){
angular.module('zinc').controller('DropSquaresController', function ($scope) {
	$scope.onDrop = function (option) {
		!option.correct ? alert("Wrong answer"): "";
		$scope.gamePlay.next();
	};
});
},{}],38:[function(require,module,exports){
angular.module("zinc").config(["$stateProvider", "$urlRouterProvider", "$locationProvider",function($stateProvider, $urlRouterProvider, $locationProvider){

	$urlRouterProvider.otherwise('/crg');
	$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: 'assets/templates/home-template.html'
			})
			.state('articles', {
				url: '/articles',
				templateUrl: 'assets/templates/articles-template.html'
			})
			.state('reports', {
				url: '/reports',
				templateUrl: 'assets/templates/reports-template.html'
			})
			.state('crg', {
				url: '/crg',
				templateUrl: 'assets/templates/crg-template.html'
			})
			.state('crg.gameplay', {
				url: '/play/:id',
				templateUrl: 'assets/templates/crg-gameplay-template.html',
        controller: 'CRGameplayController',
        resolve : {
          gamePlan: ['CRGDataService', 'CRGPlayer', '$stateParams', function(CRGDataService, CRGPlayer, $stateParams){
            return CRGDataService.getGame($stateParams.id).then(function(gameData){
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
          gamePlan: ['CRGEditorService', 'CRGPlayer', function(CRGEditorService, CRGPlayer){
            var gameData = CRGEditorService.prepareGamePlan();
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
          gamePlan: ['CRGEditorService', 'CRGPlayer', function(CRGEditorService, CRGPlayer){
            var gameData = CRGEditorService.prepareGamePlan(CRGEditorService.previewing);
            CRGPlayer.load(gameData);
            return gameData;
          }]
        }
      })
			.state('vocab', {
				url: '/vocab',
				templateUrl: 'assets/templates/vocab-list-template.html',
				resolve : {
					list: ["VocabService", function(VocabService){
						return VocabService.fetchMySets();
					}]
				},
				controller: ["$scope", "list", function($scope, list){
					$scope.games = list;
				}]
			})
			.state('vocab.view', {
				url: '/:id/view',
				templateUrl: 'assets/templates/vocab-view-template.html',
				resolve: {
					vocabset: [
						"$stateParams",
						"VocabService",
						function($stateParams, VocabService){
							return VocabService.getById($stateParams.id);
						}
					]
				},
				controller: ["$scope", "vocabset", function($scope, vocabset){
					$scope.vocabset = vocabset;
				}]
			})
			.state('vocab.play', {
				url: '/:vocabId/deck/:deckId/play',
				templateUrl: 'assets/templates/game-play-template.html',
				resolve: {
					deckParticipation: [
						"$stateParams",
						"VocabService",
						function($stateParams, VocabService){
							return  VocabService.getGamePlanFor($stateParams.vocabId, $stateParams.deckId );
						}
					]
				},
				controller: "GamePlayController"
			});

	$locationProvider.html5Mode({
		//enabled: true,
		//requireBase: false
	});
}]);

},{}],39:[function(require,module,exports){
app.value("stateMessages", {
  "vocab.view"  : "Opening Vocabulary Set",
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
  entries: {
    "intro"                 : "ReadingPassageState",
    "zinc-visualize"        : "VisualizePhraseState",
    "zinc-imagine"          : "ImaginePhraseState",
    "find-all-key-images"   : "FindAllKeyImages",
    "exit"                  : "ExitGameState"
  }
});
},{}],40:[function(require,module,exports){
angular.module("zinc").service("VocabService", ["$http", function ($http) {
	var service = {
		list : [],
		page : {
			index: -1,
			size : 10
		},
		fetchMySets: function(){
			return $http.get("assets/data/vocab-sets.json").then(function(response){
				return response.data.list;
			})
		},
		getById: function(id){
			return $http.get("assets/data/vocab-set-:id.json".replace(":id", id)).then(function(response){
				return response.data.vocabset;
			});
		},
		getGamePlanFor: function(vocabId, deckId){
			return $http.get("assets/data/vocab-set-:vocabId/deck-participation-:deckId.json".replace(":vocabId", vocabId).replace(":deckId", deckId)).then(function(response){
				return response.data.deck_participation;
			});
		}
	};
	return service;
}]);
},{}],41:[function(require,module,exports){
require("./app/app");
require("./app/variables");
require("./app/config");
require("./app/routes");
require("./app/components/forms/drop-down");
require("./app/components/state-loader/state-loader");
require("./app/components/animations/typewriter");
require("./app/vocabulary/vocab-service");
require("./app/game-play/modes/drop-squares/drop-squares-controller");
require("./app/game-play/game-play-service");
require("./app/game-play/game-play-controller");
require("./app/crg/crg");
},{"./app/app":1,"./app/components/animations/typewriter":2,"./app/components/forms/drop-down":3,"./app/components/state-loader/state-loader":4,"./app/config":5,"./app/crg/crg":8,"./app/game-play/game-play-controller":35,"./app/game-play/game-play-service":36,"./app/game-play/modes/drop-squares/drop-squares-controller":37,"./app/routes":38,"./app/variables":39,"./app/vocabulary/vocab-service":40}]},{},[41]);
