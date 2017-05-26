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
require("./passage/passage");
},{"./passage/passage":29}],7:[function(require,module,exports){
app.controller('CRGameplayController', ['$scope', '$timeout', 'CRGPlayer', 'CRGGameService', 'gamePlan', 'CRGGameScript', function ($scope, $timeout, CRGPlayer, CRGGameService, gamePlan, CRGGameScript) {

  var script  = CRGGameScript,
      game    = CRGGameService;

  script.load(gamePlan);
  game.plan = gamePlan;
  game.player = CRGPlayer.create(game, script);
  game.player.start();

  $scope.onTextSelect = function(indexes){
    $timeout(function(){
      game.selectedText = indexes.map(function (index) {
        return game.passage[index].text;
      }).join(" ");
    });
  };

  $scope.game = game;
}]);
},{}],8:[function(require,module,exports){
app.service("CRGGameScript", ["ReadingPassageState", "VisualizePhraseState", "ImaginePhraseState", "ExitGameState", function (ReadingPassageState, VisualizePhraseState, ImaginePhraseState, ExitGameState) {

  var scenes = [
    {
      groupName: "intro",
      name: "intro",
      entry: ReadingPassageState,
      data: [{}]
    },
    {
      groupName: "zincing",
      name: "zinc-visualize",
      entry: VisualizePhraseState,
      data: []
    },
    {
      groupName: "zincing",
      name: "zinc-imagine",
      entry: ImaginePhraseState,
      data: []
    },
    {
      groupName: "exit",
      name: "exit",
      entry: ExitGameState,
      data: [{}]
    }

  ];
  var script = {
    currentScene : scenes[0],
    scenes: scenes,
    nextDefinedScene: function(){
      return script.scenes.filter(function (scene) {
        return scene.data.length > 0;
      })[0];
    },
    next: function(){
      var currentScene = script.currentScene,
          hasMoreSteps = currentScene.data.length > 0,
          nextScene    = hasMoreSteps ? currentScene : script.nextDefinedScene();

      return nextScene ? nextScene.entry(nextScene.data.shift()): alert("End of game");
    },
    getScene: function(name){
      return script.scenes.filter(function(scene){
        return name == scene.name;
      })[0];
    },
    load: function(gamePlan){
      script.currentScene = scenes[0];
      script.getScene("intro").data          = [{}];
      script.getScene("exit" ).data          = [{}];
      script.getScene("zinc-visualize").data = gamePlan.zincing.visualize;
      script.getScene("zinc-imagine").data   = gamePlan.zincing.imagine;
    }
  };
  return script;
}]);
},{}],9:[function(require,module,exports){
app.factory("CRGGameService", [function () {
  var paragraphs = [
        "Ships at a distance have every man's wish on board. For some they come in with the tide. For others they sail forever on the horizon, never out of sight, never landing until the watcher turn his eyes away in resignation, his dreams mocked to death by time. That is the life of men.",
        "Now, women forget all those things they don't  want to remember, and remember everything they don't want to forget. The dream is the truth. Then they act and do things accordingly."
      ],
      toSelectableNodes = function(paragraphs){
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

  var game = {
    from: "Their Eyes Were Watching God",
    by: "Zora Neal Hurston",
    passage: toSelectableNodes(paragraphs),
    selectedText: null,
    player: null,
    highlightText: function(phrase){
      angular.forEach(game.passage, function(word, index){
        word.highlight = phrase.indices.indexOf(index) > -1;
      })
    },
    exit: function(){
      window.history.back();
    }
  };
  return game;
}]);
},{}],10:[function(require,module,exports){
require('./crg-game-service');
require('./crg-controller');
require('./phrase-selector');
require('./selection-pointer');
require('./player/crg-player-service');
require('./player/states/states');
require('./crg-game-script');
},{"./crg-controller":7,"./crg-game-script":8,"./crg-game-service":9,"./phrase-selector":11,"./player/crg-player-service":12,"./player/states/states":17,"./selection-pointer":23}],11:[function(require,module,exports){
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


},{}],12:[function(require,module,exports){
app.factory("CRGPlayer", ["CRGGameScript",function (CRGGameScript) {
  var service = {
    create: function(game){
      var player = {
        points: 10,
        sound: true,
        input: '',
        typing: true,
        transitTo: function(state){
          player.state = state;
          player.setHighlightText(state.highlightPhrase);
        },
        state: null,
        exit: function () {
          window.location = "#";
        },
        setHighlightText: function(indices){
          game.highlightText(indices);
        },
        toNextScene: function(){
          player.transitTo(CRGGameScript.next());
        },
        start: function(){
          player.toNextScene();
        }
      };
      return player;
    }
  };
  return service;
}]);
},{}],13:[function(require,module,exports){
app.factory("ExitGameState", ["CRGGameService", function (game) {
  return function () {
    var state = {
      showInput: false,
      buttons: [{
        label: "Exit",
        onClick: game.exit,
      }],
      transcript: {text: "End of game."},
      highlightPhrase: {indices: []}
    };

    return state;
  };
}]);
},{}],14:[function(require,module,exports){
app.factory("DoneReadingPassageState", ["EnterMainIdeaState", "CRGGameService", function (EnterMainIdeaState, game) {
  return function(){
    var showInput = function(){
      game.player.transitTo(EnterMainIdeaState());
    };

    var state = {
      showInput: false,
      highlightPhrase: {indices: []},
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
},{}],15:[function(require,module,exports){
app.factory("EnterMainIdeaState", ["VisualizePhraseState", "CRGGameService",function (VisualizePhraseState, game) {
  return function(){
    return {
      showInput   : true,
      buttons     : [],
      highlightPhrase: {indices: []},
      transcript: {text: "Describe the main idea in 120 characters or less."},
      submitInput : function(userInput){
        console.log("user says : " + userInput);
        game.player.toNextScene();
      }
    };
  };
}]);
},{}],16:[function(require,module,exports){
app.factory("ReadingPassageState", ["DoneReadingPassageState", "CRGGameService", function (DoneReadingPassageState, game) {
  return function(){
    return {
      showInput: false,
      highlightPhrase: {indices: []},
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
},{}],17:[function(require,module,exports){
require('./intro/reading-passage-state');
require('./intro/done-reading-passage-state');
require('./intro/enter-main-idea-state');
require('./zincing/visualize-phrase-state');
require('./zincing/imagine/imagine-phrase-state');
require('./zincing/imagine/find-example-phrase-state');
require('./zincing/imagine/no-example-of-phrase-state');
require('./zincing/imagine/choose-example-of-phrase-state');
require('./exit-game-state');
},{"./exit-game-state":13,"./intro/done-reading-passage-state":14,"./intro/enter-main-idea-state":15,"./intro/reading-passage-state":16,"./zincing/imagine/choose-example-of-phrase-state":18,"./zincing/imagine/find-example-phrase-state":19,"./zincing/imagine/imagine-phrase-state":20,"./zincing/imagine/no-example-of-phrase-state":21,"./zincing/visualize-phrase-state":22}],18:[function(require,module,exports){
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
      highlightPhrase: imagine.phrase
    };
    return state;
  };
}]);
},{}],19:[function(require,module,exports){
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
          submitInput: function (userInput) {
            console.log("user imagined : " + userInput);
            game.player.transitTo({});
          }
        };
    return state;
  };
}]);
},{}],20:[function(require,module,exports){
app.factory("ImaginePhraseState", ['FindExamplePhraseState',"CRGGameService", function (FindExamplePhraseState, game) {
  return function (imagine) {
    var state   = {
          showInput       : true,
          buttons         : [],
          transcript      : {text: "List three things you imagine when you read the highlighted phrase."},
          highlightPhrase : imagine.phrase,
          submitInput: function (userInput) {
            game.player.transitTo(FindExamplePhraseState(imagine));
          }
        };
    return state;
  };
}]);
},{}],21:[function(require,module,exports){
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
      submitInput: function (userInput) {
        game.player.transitTo({});
      }
    };
    return state;
  };
}]);
},{}],22:[function(require,module,exports){
app.factory("VisualizePhraseState", ['ImaginePhraseState', "CRGGameService", function (ImaginePhraseState, game) {
  var VisualizePhraseState = function (visualize) {
    var state = {
      showInput: true,
      buttons: [],
      transcript: {text: visualize.transcript.text || "What do you imagine when you read the highlighted text ?"},
      highlightPhrase: visualize.phrase,
      submitInput: function (userInput) {
        console.log("user visualized : " + userInput);
        game.player.toNextScene();
      }
    };
    return state;
  };
  return VisualizePhraseState;
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
app.controller('CRGEditorController', ['$scope', '$timeout', 'CRGEditorService', 'ZincVisualizeEditorService', function ($scope, $timeout, CRGEditorService, ZincVisualizeEditorService) {
  var editor  = CRGEditorService;

  $scope.onTextSelect = function(indexes){
    $timeout(function(){
      var selectedText = indexes.map(function (index) {
        return editor.passage[index].text;
      }).join(" ")

      editor.passageSelector.selection.onTextSelect(indexes, selectedText);
    });
  };

  $scope.game = {
    from: "Their Eyes Were Watching God",
    by: "Zora Neal Hurston",
  };
  $scope.editor = editor;
  $scope.zincVisualizeEditor = ZincVisualizeEditorService;
}]);
},{}],25:[function(require,module,exports){
app.factory("CRGEditorService", ["Passage", "PassageSelector", function (Passage, PassageSelector) {
  var editorService = {
        passage: Passage("p1 \n p2"),
        game: {
          zincing: {
            visualize: [
              {
                phrase: {
                  indices: [0, 1,2,3,4],
                  text : 'Ships at a distance',
                },
                focus: {
                  indices: [0, 1,2,3,4,5,6,7,8,9],
                  text :"Ships at a distance have every man's wish on board",
                },
                transcript: {
                  text: 'What do you imagine when you read the text "Ships at a distance"  in first sentence ?'
                }
              }
            ],
            imagine: []
          }
        },
        prepareGamePlan : function(){
          return JSON.parse(JSON.stringify(editorService.game));
        },
    passageSelector: PassageSelector
  };
  return editorService;
}]);
},{}],26:[function(require,module,exports){
require('./crg-editor-controller');
require('./crg-editor-service');
require('./form/zincing/zinc-visualize-editor-service');
require('./passage-selector-service');
},{"./crg-editor-controller":24,"./crg-editor-service":25,"./form/zincing/zinc-visualize-editor-service":27,"./passage-selector-service":28}],27:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
app.factory("PassageSelector", ["Passage", function (Passage) {
  var scrollTime = 500,
      scrollBackOffset = 200,
      scrollTo = function(position, then){
        $("html, body").stop().animate({scrollTop:position}, scrollTime, 'swing', then || function(){});
      },
      currentScrollPosition = function(){
        return $(window).scrollTop();
      },
      passageSelector = {
        selecting: false,
        lastScrollOffset: 0,
        selection: {
          current: {text: '', indices: []},
          selectingFocus: false,
          selectingPhrase: false,
          focus: {text: '', indices: []},
          phrase: {text: '', indices: []},
          selectFocus: function () {
            passageSelector.selection.selectingFocus = true;
            passageSelector.selection.selectingPhrase = false;
          },
          selectPhrase: function () {
            passageSelector.selection.selectingFocus = false;
            passageSelector.selection.selectingPhrase = true;
          },
          setFocus: function () {
            passageSelector.selection.focus = passageSelector.selection.getTextSelection();
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
          passageSelector.whenDone = function () {
          };
          passageSelector.selection.focus = {text: '', indices: []};
          passageSelector.selection.phrase = {text: '', indices: []};
          passageSelector.selection.selectingFocus = false;
          passageSelector.selection.selectingPhrase = false;
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
  ;
  return passageSelector;
}]);
},{}],29:[function(require,module,exports){
app.factory("Passage", [function () {
  var paragraphs = [
        "Ships at a distance have every man's wish on board. For some they come in with the tide. For others they sail forever on the horizon, never out of sight, never landing until the watcher turn his eyes away in resignation, his dreams mocked to death by time. That is the life of men.",
        "Now, women forget all those things they don't  want to remember, and remember everything they don't want to forget. The dream is the truth. Then they act and do things accordingly."
      ],
      toSelectableNodes = function(paragraphs){
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

  return function(text){
    return toSelectableNodes(paragraphs);
  };
}]);
},{}],30:[function(require,module,exports){
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
},{}],31:[function(require,module,exports){
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
},{}],32:[function(require,module,exports){
angular.module('zinc').controller('DropSquaresController', function ($scope) {
	$scope.onDrop = function (option) {
		!option.correct ? alert("Wrong answer"): "";
		$scope.gamePlay.next();
	};
});
},{}],33:[function(require,module,exports){
angular.module("zinc").config(["$stateProvider", "$urlRouterProvider", "$locationProvider",function($stateProvider, $urlRouterProvider, $locationProvider){

	$urlRouterProvider.otherwise('/vocab');
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
				url: '/gameplay',
				templateUrl: 'assets/templates/crg-gameplay-template.html',
        controller: 'CRGameplayController',
        resolve : {
          gamePlan: ['SampleCRGGamePlan', function(SampleCRGGamePlan){
            return SampleCRGGamePlan;
          }]
        }
			})
      .state('crg.editor', {
        url: '/editor',
        templateUrl: 'assets/templates/crg-editor-template.html',
        controller: 'CRGEditorController'
      })
      .state('crg.editor.preview', {
        url: '/preview',
        templateUrl: 'assets/templates/crg-preview-template.html',
        controller: 'CRGameplayController',
        resolve : {
          gamePlan: ['CRGEditorService', function(CRGEditorService){
            return CRGEditorService.prepareGamePlan();
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

},{}],34:[function(require,module,exports){
app.value("stateMessages", {
  "vocab.view"  : "Opening Vocabulary Set",
  "default"     : "Loading ",
});

app.value("SampleCRGGamePlan", {
  zincing: {
    visualize: [
      {
        phrase: {indices: [0, 1,2,3,4]},
        transcript: {text: 'What do you imagine when you read the text "Ships at a distance"  in first sentence ?'}
      },
      {phrase: {indices: [34,35,36,37,38,39]} ,
        transcript: {text: 'What do you imagine when you read the text "looks aways in resignation"  in first sentence ?'}
      },
    ],
    imagine: [
      {
        phrase: {indices: [57,58,59,60,61,62,63,64,65]},
        existsInPassage: false,
        transcript: {text: 'Which one of following is not a good example of "all those things they don\'t want to remember" ?'},
        usages: [
          {
            label: 'A cow eating grass.',
            correct: false,
          },
          {
            label: 'A baby being dropped.',
            correct: true,
          },
          {
            label: 'Getting fired from job.',
            correct: true,
          },
          {
            label: 'A scary nightmare.',
            correct: true,
          },
        ]
      }
    ]
  }
});
},{}],35:[function(require,module,exports){
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
},{}],36:[function(require,module,exports){
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
require("./app/crg/crgameplay/crgameplay");
require("./app/crg/editor/crg-editor");
require("./app/crg/crg");
},{"./app/app":1,"./app/components/animations/typewriter":2,"./app/components/forms/drop-down":3,"./app/components/state-loader/state-loader":4,"./app/config":5,"./app/crg/crg":6,"./app/crg/crgameplay/crgameplay":10,"./app/crg/editor/crg-editor":26,"./app/game-play/game-play-controller":30,"./app/game-play/game-play-service":31,"./app/game-play/modes/drop-squares/drop-squares-controller":32,"./app/routes":33,"./app/variables":34,"./app/vocabulary/vocab-service":35}]},{},[36]);
