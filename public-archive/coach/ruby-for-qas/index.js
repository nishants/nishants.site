(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
window.app = angular.module("crg", ['ui.router', 'ngDraggable', 'ngStorage']);
},{}],2:[function(require,module,exports){
app.controller('FeedbackController', ['$scope', 'FeedbackService', function ($scope, FeedbackService) {
  $scope.feedback = FeedbackService;
}]);
},{}],3:[function(require,module,exports){
app.factory("FeedbackService", ["SceneEventService", "$stateParams", function (SceneEventService, $stateParams) {

  var FeedbackService = {
    showFeelingMenu: false,
    feeling : null,
    userInput: null,
    show    : function(){
      FeedbackService.showFeelingMenu = true;
    },
    cancel: function(){
      FeedbackService.showFeelingMenu = false;
    },
    saveFeedback: function(){
      var passageId = $stateParams.id
      SceneEventService.feedbackReceived(passageId, {
        feeling: FeedbackService.feeling,
        text   : FeedbackService.userInput,
      });
    },
    setFeeling: function(feeling){
      FeedbackService.feeling = feeling;
      FeedbackService.saveFeedback();
    },
    hate    : function(){
      FeedbackService.setFeeling("hate");
    },
    dislike : function(){
      FeedbackService.setFeeling("dislike");
    },
    unsure  : function(){
      FeedbackService.setFeeling("unsure");
    },
    like    : function(){
      FeedbackService.setFeeling("like");
    },
    love    : function(){
      FeedbackService.setFeeling("love");
    },

    submit: function(){
      FeedbackService.saveFeedback();
      FeedbackService.cancel();
      FeedbackService.feeling = null;
      FeedbackService.userInput = null;
    }
  };
  return FeedbackService;
}]);
},{}],4:[function(require,module,exports){
require("./feedback-controller");
require("./feedback-service");
},{"./feedback-controller":2,"./feedback-service":3}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
app.directive("googleLogin", [function(){
  return {
    restrict : "C",
    scope    : true,
    template : '<span id="google-login-button"></span>',
    link     : function(scope, element, attrs){
      var
          signOut = function(){
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
              $('.userContent').html('');
              $('#gSignIn').slideDown('slow');
            });
          },
          loggedIn = function(googleUser){
            var profile = googleUser.getBasicProfile();
            gapi.client.load('plus', 'v1', function () {
              var request = gapi.client.plus.people.get({
                'userId': 'me'
              });
              //Display the user details
              request.execute(function (resp) {
                scope.$googleUser = {
                    name        : resp.name.givenName,
                    image       : resp.image.url,
                    displayName : resp.displayName,
                    email       : resp.emails[0].value,
                    gender      : resp.gender,
                    profile     : resp.url,
                    orgs        : (resp.organizations || []).map(function(org){return org.name;}).join(", "),
                };
                scope.$eval(attrs.onLogin);
              });
            });
          },
          loginFailed = function(e){
            alert("Login failed")
            console.error(e);
          },
          renderButton = function(id){
            gapi.signin2.render(id, {
              'scope'     : 'profile email',
              'width'     : 350,
              'height'    : 70,
              'longtitle' : true,
              //'theme'     : 'dark',
              'onsuccess' : loggedIn,
              'onfailure' : loginFailed
            });
          };

      renderButton("google-login-button");
    }
  };
}]);


},{}],7:[function(require,module,exports){
app.controller('LoginController', ["$scope","$localStorage","$rootScope", "$timeout", function ($scope, $localStorage, $rootScope, $timeout) {
  $scope.login = {
    success : function(user){
      $timeout(function(){
        $localStorage.user = user;
        $rootScope.user    = user;
        ga('set', 'userId', $localStorage.user.email);
      });
      console.log(user);
    }
  };
}]);
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
app.factory("Throttle", ["$timeout", function ($timeout) {
  return function (time) {
    var throttle = {
      timeout: undefined,
      work: function(){},
      push: function (work) {
        throttle.clear();
        throttle.work     = work;
        throttle.timeout  = setTimeout(throttle.flush, time);
      },
      clear: function(){
        clearTimeout(throttle.timeout);
      },
      flush: function(){
        throttle.work();
      },
    };
    return throttle;
  };
}]);
},{}],10:[function(require,module,exports){
app.directive("hardTypewriter", ["TYPING_SPEED", "$timeout", function (typingSpeed, $timeout) {
  return {
    restrict: "C",
    scope: false,
    link: function (scope, element, attrs) {
      var $e    = $(element),
          letters = [],
          timer,
          stopTimer = function () {
            clearInterval(timer);
          },
          type = function () {
            var nextLetter = letters.splice(0, 1);
            nextLetter ? $e.append(nextLetter) : stopTyping();
          },
          startTyping = function (text) {
            var speed = parseInt(attrs.typingSpeed) || typingSpeed;
            clear();
            stopTimer();
            letters = text.split("");
            attrs.beforeTyping && scope.$eval(attrs.beforeTyping);
            timer = setInterval(type, speed);
          },
          stopTyping = function () {
            $timeout(function () {
              attrs.afterTyping && scope.$eval(attrs.afterTyping);
            });
            stopTimer();
          },
          clear = function () {
            $e.html("")
          };

      scope.$watch(attrs.text, function(text){
        text ? startTyping(text) : clear();
      });
    }
  };
}])

},{}],11:[function(require,module,exports){
app.directive("typewriter",["TYPING_SPEED", "$timeout", function(typingSpeed, $timeout){
  return {
    restrict: "C",
    scope   : false,
    link: function(scope, element, attrs){
      if(attrs.text){
        var $e    = $(element),
            speed = scope.$eval(attrs.typingSpeed),
            timer,
            stopTimer = function(){
              clearInterval(timer);
            },
            type = function(){
              //var nextLetter = $e.find(".letter:not(.display)").first();
              //nextLetter.length ? $(nextLetter).addClass("display")  : stopTyping();
            },
            setText= function(text){
              $e.removeClass("start-typing");
              var words = text.split(" "),
                  speed = Math.min(scope.$eval(attrs.typingSpeed), 150),
                  toLetterElement = function(letter){
                    return "<span class='letter'>{{letter}}</span>".replace("{{letter}}", letter.trim().length ? letter : '&nbsp;' );
                  },
                  toWordElement = function(word){
                    var wordContent = word.split("").map(toLetterElement).join("");
                    return "<span class='word'>{{content}}</span>".replace("{{content}}", wordContent)
                  },
                  element = words.map(toWordElement);
              $e.html(element);

              $e.find(".letter").each(function(index, letter){
                var delay = index * speed + "ms";
                $(letter).css("transition-delay", delay);
              });
              setTimeout(function(){
                $e.addClass("start-typing");
              });
            },
            startTyping = function(){
              stopTimer();
              setText(scope.$eval(attrs.text));
              attrs.beforeTyping && scope.$eval(attrs.beforeTyping);
              //timer = setInterval(type, speed);
            },
            stopTyping = function(){
              $timeout(function(){
                attrs.afterTyping && scope.$eval(attrs.afterTyping);
              });
              stopTimer();
            },
            clear = function(){
              $e.html("");
              //stopTimer();
              $e.addClass("no-show");
            };
        scope.$watch(attrs.text, function(text){
          text ? startTyping() : clear();
        });
      }
    }
  };
}])

},{}],12:[function(require,module,exports){
app.directive("viewportSafariFix",["$timeout", function($timeout){
  return {
    restrict: "C",
    scope   : false,
    link: function(scope, element, attrs){
      var fixViewport = function () {
        var viewPortHeight = $(window).innerHeight() - 20;
        $(element).height(viewPortHeight);
      };
      if(window.safari !== undefined){
        $(window).on("resize",fixViewport);
        $(window).trigger("resize");
      }
    }
  };
}]);
},{}],13:[function(require,module,exports){
app.value("remote", "https://findfalcone.herokuapp.com");
app.value("requestConfig", {headers: {Accept: "application/json", "Content-Type": "application/json"}});
app.value("EventServer", "https://fireapp-web-service.herokuapp.com");
app.value("RUBY_VALIDATOR_API", "http://amoeba-social-rubylab.herokuapp.com/validate");

app.config(['$qProvider', function ($qProvider) {
  $qProvider.errorOnUnhandledRejections(false);
}]);

app.run(['$localStorage', '$rootScope', function ($localStorage, $rootScope) {
  //if(!$localStorage.user){
  //  //$localStorage.$default({
  //  //  clientId: parseInt(Math.random() * (new Date().getTime()))
  //  //});
  //}
  if(!$localStorage["scripts-progress"]){
    $localStorage["scripts-progress"] = {};
  }
  if($localStorage.user){
    $rootScope.user = $localStorage.user;
    ga('set', 'userId', $localStorage.user.email);
  }
}]);

app.run(["$rootScope", function ($rootScope) {
  var expiration = new Date(2018, 2, 25),
      now = new Date();
    $rootScope.expired = now.getTime() > expiration.getTime()
}])
},{}],14:[function(require,module,exports){
app.directive("maskPhrase", ["$timeout", function($timeout){

  return {
    restrict : "C",
    scope    : false,
    link     : function(scope, element, attrs){
      $timeout(function(){
        var phrase = scope.$eval(attrs.phrase),
            phraseElements = phrase.indices.map(function(wordIndex){
              return $(".word[data-word-number=<word-index>]".replace("<word-index>", wordIndex))
            }),
            maskDimensions = function(phraseElements){
              var first = phraseElements[0],
                  firstPosition = first.position(),
                  inlineWidth   = 0;
              phraseElements.forEach(function(word){
                inlineWidth += word.outerWidth()
              });
              return {
                top   : firstPosition.top,
                left  : firstPosition.left,
                height: first.outerHeight(),
                width : inlineWidth,
              };
            },
            applyMask = function($element, mask){
              $element.css("top",     "<top>px".replace("<top>", mask.top));
              $element.css("left",    "<left>px".replace("<left>", mask.left));
              $element.css("height",  "<height>px".replace("<height>", mask.height));
              $element.css("width",   "<width>px".replace("<width>", mask.width));
            };

        $(window).on("resize", function(){
          applyMask($(element), maskDimensions(phraseElements));
        });
        $(window).trigger("resize");
      });
    }
  };
}]);
},{}],15:[function(require,module,exports){
app.factory("PassageDialogueElement", [ function () {
  return function(dialogues, wordIndexer){
    return dialogues.map(function(dialogue){
      return {
        label: wordIndexer.indexed(dialogue.label),
        text : wordIndexer.indexed(dialogue.text)
      };
    });
  };
}]);
},{}],16:[function(require,module,exports){
app.factory("Passage", ["PassageDialogueElement", "SlideWordIndexer", function (PassageDialogueElement, WordIndexer) {
  var toSelectableNodes = function(paragraphs, startIndex, ignoreLinebreak){
        var nodes = [],
            index = 0,
            fromIndex = startIndex || 0;
        for(var i =0; i < paragraphs.length; i++){
          var words = paragraphs[i].split(" ");
          for(var j =0; j < words.length; j++){
            nodes.push({text: words[j], index: (fromIndex + index++)});
          }
          ignoreLinebreak && nodes.push({text: '', linebreak: true, index: (fromIndex + index - 1)});
        }
        return nodes;
      },
      dialogues = function(dialogues){
        var index = 0;
        return dialogues.map(function(dialogue){
          var dialogueText = toSelectableNodes(dialogue.text.split("\n"), index, true);
          index = dialogueText[dialogueText.length -1].index + 1
          return {
            from: dialogue.from,
            text: dialogueText
          }
        });
      };

  return function(data){
    var dialogueWordIndex = WordIndexer();
    var passage = {
      id    : data.id,
      from  : data.from,
      by    : data.by,
      words : data.text ? toSelectableNodes(data.text.split("\n")): [],
      dialogues : data.dialogues ? PassageDialogueElement(data.dialogues, dialogueWordIndex): [],
      setFocusText: function(phrase){
        var
            focusInPassage = function () {
              angular.forEach(passage.words, function (word, index) {
                word.focus = phrase.indices.indexOf(index) > -1;
              });
            };
        passage.dialogues.length ? dialogueWordIndex.setFocus(phrase) :  focusInPassage();
      },
      setHighlightText: function(phrase){
        var
            highlightFromPassage = function () {
              angular.forEach(passage.words, function (word, index) {
                word.highlight = phrase.indices.indexOf(index) > -1;
              });
            };
        passage.dialogues.length ? dialogueWordIndex.setHighlightText(phrase) :  highlightFromPassage();
      },
      getText: function (indices) {
        var fromPassage = function(){
          return indices.map(function (index) {
            return passage.words[index].text;
          }).join(" ")
        };
        return passage.dialogues.length ? dialogueWordIndex.getText({indices: indices}) :  fromPassage();
      }
    };
    return passage;
  };
}]);
},{}],17:[function(require,module,exports){
app.service("PhraseSelection", ["$timeout", function($timeout){

  var service = {
      phrase: {
        indices: [],
        text: "",
      },
    getSelectedPhrase: function (){

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
      return {indices: node.filter(function(index){return index !=undefined ;}).map(function(index){
        return parseInt(index);
      })};
    }
  };
  document.addEventListener("selectionchange", service.update);
  return service;
}]);
},{}],18:[function(require,module,exports){
app.directive("resizeVideo", [ function(){

  return {
    restrict : "A",
    scope    : true,
    link     : function(scope, element, attrs){
      var player = function(){
        return $(".crg-player");
      };
      var enterFullScreen = function(){
            player().addClass("full-screen-video");
            $("#crg-video-player").css("transform", "");
            $("#crg-video-player .player-bar").css("transform", "");
            $("#crg-video-player .player-bar label").css("transform", "");
            $("ul.player-controls").css("transform", "");
            $("#crg-video-player .video-end-menu").css("transform", "");

            var VIDEO_TOP_SPACE = 20,
                padding       = 100,
                $video = $("#crg-video-player"),
                $centralGrid = $(".passage-container"),
                $passage = $(".passage-container"),
                windowWidth  = player().width(),
                passageWidth  = $(window).width() - 2*padding,
                playerWidth  = $video.width(),
                windowHeight = player().height(),
                playerHeight = $video.height(),
                rightPosition = $centralGrid.width(),
                topPosition   = $video.offset().top - $passage.offset().top - VIDEO_TOP_SPACE,
                scale         = passageWidth/playerWidth;

            var transformation = "translateX(<x>px) scale(<scale>)"
                .replace("<x>",-padding)
                .replace("<y>",-topPosition)
                .replace("<scale>",scale);
            $("#crg-video-player").css("transform", transformation);
            $("#crg-video-player .player-bar").css("transform", "scaleY(<scale>)".replace("<scale>", 1/scale));
            $("#crg-video-player .player-bar label").css("transform", "scaleX(<scale>)".replace("<scale>", 1/scale));
            $("#crg-video-player .video-end-menu").css("transform", "scale(<scale>)".replace("<scale>", 1/scale));

            $("ul.player-controls").css("transform", "scale(<scale>)".replace("<scale>", 1/scale));
            $("#crg-video-player .video-loader-container").css("transform", "scaleY(<scale>)".replace("<scale>", 1/scale));

          },
          exitFullScreen = function(){
            $("#crg-video-player").css("transform", "");
            $("#crg-video-player .player-bar").css("transform", "");
            $("#crg-video-player .video-end-menu").css("transform", "");
            $("#crg-video-player .player-bar label").css("transform", "");

            $("ul.player-controls").css("transform", "");
            $("ul.player-controls > li > *").css("transform", "");

            player().removeClass("full-screen-video");
          };

      var resizeIfNeeded = function () {
        scope.$eval(attrs.resizeVideo) ? enterFullScreen() : exitFullScreen();
      };
      scope.$watch(attrs.resizeVideo, resizeIfNeeded);
      $(window).on("resize", resizeIfNeeded);
    }
  };
}]);
},{}],19:[function(require,module,exports){
app.service("UserActionLogService", [function(){

  var service = {
    log: [],
    loadSaved: function(log){
      service.log = log;
    },
    reset: function(){
      service.log = [];
    },
    logButton: function(sceneId, buttonId){
      service.log.push({
        time    : (new Date()).getTime(),
        type    : "button",
        sceneId : sceneId,
        name    : buttonId,
        value   : true,
      });
    },
    logTextInput: function(sceneId, input){
      service.log.push({
        time    : (new Date()).getTime(),
        type    : "text-input",
        name    : "text-input",
        sceneId : sceneId,
        value   : input,
      });
    },
    saveMultiChoiceAnswer: function(sceneId, options, chosen, correctChoice){
      service.log.push({
        time    : (new Date()).getTime(),
        type    : "multi-choice-result",
        name    : "multi-choice-result",
        sceneId : sceneId,
        value   : correctChoice,
      });
    },
    getAction : function(sceneId, name){
      return service.log.filter(function(log){
        return log.sceneId == sceneId && log.name == name;
      })[0];
    }
  };
  return service;
}]);
},{}],20:[function(require,module,exports){
app.directive("videoPlayer", [ "VideoPlayerService", "$timeout", function(VideoPlayerService, $timeout){

  return {
    restrict : "A",
    scope    : true,
    link     : function(scope, element, attrs){
      var videoEnded = function(){
            scope.$eval(attrs.afterVideo);
          };
      var videoElement = function(){
        return $(element).find("video")[0];
      };
      var resetVideo = function(){
        var $e = $(element),
            videoElement = $e.find("video")[0]
        $e.addClass("no-video");
        videoElement && videoElement.pause();
      };

      var setVideo = function (video) {
        var thumbnail = scope.game.player.chat.agent.videoThumbnail,
            videoTemplate = '<video width="100%"><source ></video>';
        $(element).html('');
        $(element).html(videoTemplate.replace("<video-thumbnail>", thumbnail));

        var $e = $(element),
            videoType = video.type,
            $video = $e.find("video"),
            videoElement = $video[0];

        $video.find("source").attr("src", video.url)
        $video.find("source").attr("type", videoType)
        $video[0].addEventListener("playing", function(){
          $timeout(function(){
            VideoPlayerService.videoReady(video, {durationInMs: $video[0].duration*1000});
          });
        });
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
      VideoPlayerService.onPause(function(){
        videoElement().pause();
      });
      VideoPlayerService.onReplay(function(){
        videoElement().currentTime = 0;
        videoElement().play();
      });
      VideoPlayerService.onResume(function(){
        videoElement().play();
      });

    }
  };
}]);
},{}],21:[function(require,module,exports){
app.service("VideoPlayerService", ["CRGGameService", "$rootScope",function (game, $rootScope) {
  var videoPlayer = {
    pendingVideo: null,
    loadVideo : null,
    onVideoLoad: {},
    onStop: function (callback) {
      videoPlayer.stopVideo = callback;
    },
    onVideoLoad: function (callback) {
      videoPlayer.loadVideo = callback;
      if(videoPlayer.pendingVideo){
        videoPlayer.loadVideo(videoPlayer.pendingVideo);
      }
    },
    videoReady: function(video, metaData){
      var callback = videoPlayer.onVideoLoad[video.url];
      videoPlayer.onVideoLoad[video.url] = null;
      callback && callback(metaData);
    },

    onPause: function(callback){
      videoPlayer.onPauseCallback = callback;
    },
    onReplay: function(callback){
      videoPlayer.onReplayCallback = callback;
    },
    onResume: function(callback){
      videoPlayer.onResumeCallback = callback;
    },
    pause: function(){
      videoPlayer.onPauseCallback && videoPlayer.onPauseCallback();
    },
    resume: function(){
      videoPlayer.onResumeCallback && videoPlayer.onResumeCallback();
    },
    replay: function(){
      videoPlayer.onReplayCallback && videoPlayer.onReplayCallback();
    },
    play: function (video, onLoad) {
      videoPlayer.onVideoLoad[video.url] = onLoad;
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
},{}],22:[function(require,module,exports){
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
},{}],23:[function(require,module,exports){
require("./components/passage/passage");
require("./components/passage/passage-dialogue-element");
require("./components/passage/drag-drop-relations/mask-phrase");
require("./components/video-player-directive");
require("./components/video-player-service");
require("./components/resize-video");
require("./components/user-action-log-service");
require("./components/phrase-selection/phrase-selection");

require("./skill-videos/skills-videos");
require("./player/crgameplay");
require("./editor/crg-editor");
require("./reports/crg-reports");
require("./scenes/scenes");
require("./crg-data-service");
require("./crg-data-service");

require("./scene-editor/scene-editor");

},{"./components/passage/drag-drop-relations/mask-phrase":14,"./components/passage/passage":16,"./components/passage/passage-dialogue-element":15,"./components/phrase-selection/phrase-selection":17,"./components/resize-video":18,"./components/user-action-log-service":19,"./components/video-player-directive":20,"./components/video-player-service":21,"./crg-data-service":22,"./editor/crg-editor":26,"./player/crgameplay":34,"./reports/crg-reports":40,"./scene-editor/scene-editor":44,"./scenes/scenes":91,"./skill-videos/skills-videos":97}],24:[function(require,module,exports){
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
},{}],25:[function(require,module,exports){
app.factory("CRGEditorService", ["Passage", "PassageSelector", "SceneGroups", "$state", function (Passage, PassageSelector, SceneGroups, $state) {
  var findScene = function(name){
    return function(scene){
      return scene.name == name;
    };
  };
  var sceneGroups = Object.keys(SceneGroups).map(function(group){
    return {
      name: group,
      label: SceneGroups[group].label,
      subgroups: SceneGroups[group].subgroups
    };
  });
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
        sceneGroups: sceneGroups,
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
},{}],26:[function(require,module,exports){
require('./crg-editor-controller');
require('./preview/crg-preview-controller');
require('./crg-editor-service');
require('./passage-selector');
},{"./crg-editor-controller":24,"./crg-editor-service":25,"./passage-selector":27,"./preview/crg-preview-controller":28}],27:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
app.controller('CRGPreviewController', [function () {
  window.scrollTo(0,0);
}]);
},{}],29:[function(require,module,exports){
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
                inputHeight        = $(".console-user-input").height(),
                bottomPadding      = 100;

            $dialogues.css("padding-bottom",inputHeight + bottomPadding);
          },
          updateChatHistory = function (ready) {
            resize();
            //scrollToBottom();
          };

      scope.$watch("game.player.chat.input.ready", updateChatHistory);
      $('.console-user-input').bind("DOMSubtreeModified",updateChatHistory);
    }
  };
}]);
},{}],30:[function(require,module,exports){
app.controller('CRGameplayController', ['$scope', '$timeout', 'CRGPlayer', 'CRGGameService', 'gamePlan', 'VideoPreloader', function ($scope, $timeout, CRGPlayer, CRGGameService, gamePlan, VideoPreloader) {

  var game    = CRGGameService;

  $scope.onTextSelect = function(indexes){
    $timeout(function(){
      game.selectedText = game.player.getTextFor(indexes);
      game.player.onTextSelection({indices: indexes, text: game.selectedText});
    });
  };

  $scope.onTextSelectTouch = function(indexes){
    $timeout(function(){
      game.selectedText = game.player.getTextFor(indexes);
      var selection = {indices: indexes, text: game.selectedText};
      game.player.onTextSelection(selection);
      game.player.submitText(selection);
    });
  };

  $scope.game = game;
  $scope.preloader = VideoPreloader;
}]);
},{}],31:[function(require,module,exports){
app.service("CRGGameScript", ["SceneLoader", "$injector", "SceneGroups", "VideoPreloader", "$timeout", function (SceneLoader, $injector, SceneGroups, VideoPreloader, $timeout) {

  var
      getSceneLoader = function(name){
        return $injector.get(SceneLoader[name].entry);
      },
      groupName = function(scene){
        return scene.config.group;
      },
      uniqueGroups = function(element, index, allGroups){
        return index == allGroups.indexOf(element);
      },
      toGroup=  function(groupName){
        var sceneGroup = SceneGroups[groupName];
        return {
          name: groupName,
          label: sceneGroup.label
        };
      };

  var skillGroupFor = function(scriptData){
    return scriptData.passage ? null : [
      [{label : "Zincing"   , group : "zincing"  }   ,  {label : "Visualize",  subgroup : "visualize" , group : "zincing"}, {label : "Key Images", subgroup : "key-images", group : "zincing"} , {label : "Imagine"    , subgroup : "imagine", group : "zincing"}],
      [{label : "Navigators", group : "navigators"}   , {label : "Road Signs", subgroup : "road-signs", group : "navigators"}, {label : "Pronouns"  , subgroup : "pronouns", group : "navigators"}  , {label : "Explainers", subgroup : "explainers", group : "navigators"}],
      [{label : "Tone", group : "tone"}]
    ];
  };
  var bufferNext = function(scene){
    if(scene){
      VideoPreloader.load(scene.config.sceneLoadVideo);
    }
  };
  var
      script = {
        scenes    : [],
        sceneIndex: -1,
        skillGroups : null,
        next: function(){
          var nextScene = script.scenes[script.sceneIndex++];
          nextScene && $timeout(function(){
            script.highlightIndicator(nextScene.config.group, nextScene.config.subgroup);
          }, nextScene.config.renderDelay || 0);
          bufferNext(script.scenes[script.sceneIndex+1]);
          bufferNext(script.scenes[script.sceneIndex+2]);
          return nextScene ? getSceneLoader(nextScene.name)(nextScene.config) : null;
        },
        jumpTo: function(sceneId){
          var indexOfScene = -1;
          script.scenes.forEach(function(scene, index){
            indexOfScene = scene.config.sceneId == sceneId ? index: indexOfScene;
          });
          script.sceneIndex = indexOfScene +1;
        },
        load: function(scriptData){
          script.scenes      = scriptData.scenes;
          script.sceneIndex  = 0;
          script.skillGroups = skillGroupFor(scriptData);
        },
        getGroups: function(){
          return script.scenes.map(groupName).filter(uniqueGroups).map(toGroup);
        },
        highlightIndicator: function(group, subgroup){
          angular.forEach(script.skillGroups, function(skills){
            angular.forEach(skills, function(skill){
              var isCurrentSkill    = !subgroup && !skill.subgroup && skill.group == group,
                  isCurrentSubskill = subgroup  && (group == skill.group) && (subgroup == skill.subgroup),
                  isParentSkill     = subgroup && !skill.subgroup && skill.group == group,
                  isCurrentState = isCurrentSkill || isCurrentSubskill;
              if(!skill.finished){
                if(skill.current && !isCurrentState){
                  skill.finished = true;
                }else{
                  skill.current = isCurrentState;
                }
              }
              skill.currentParent = isParentSkill;
            });
          });
        }
      };
  return script;
}]);
},{}],32:[function(require,module,exports){
app.factory("CRGGameService", [function () {
  var game = {
    player: null
  };
  return game;
}]);
},{}],33:[function(require,module,exports){
app.service("CRGPlayer", ["CRGGameScript", "Passage", "VideoPlayerService", "SceneGroups", "SceneEventService", "SkillVideos", "$timeout", "$localStorage","UserActionLogService",function (CRGGameScript, Passage, VideoPlayerService, SceneGroups, SceneEventService, SkillVideos, $timeout, $localStorage, UserActionLogService) {
  var FLASH_TIMEOUT = 3000,
      user  = {
        type : "user",
        image: "assets/images/anonymous.png",
      },
      agent = {
        type : "agent",
        image: null,
        videoThumbnail: null,
      },
      resetSelection = function(){
        window.getSelection().empty();
      };

  var player = {
    scriptID : undefined,
    points: 10,
    sound: true,
    input: '',
    typing: true,
    selectedText: null,
    passage: null,
    subgroups: [],
    groups: [],
    skillGroups: [],
    mode: {chat: true},
    skillVideos: null,
    playSkillVideo: function(skill, subSkill){
      var parentSkill = player.skillVideos[skill],
          skillVideo   = parentSkill[subSkill || "default"],
          skillConfig  = SceneGroups[skill],
          subSkillConfig = subSkill ? skillConfig.subgroups.find(function(subgroup){return subgroup.id == subSkill;}) : null,
          label          = subSkillConfig? subSkillConfig.label : skillConfig.label,
          videoBeforeSkills     = {
            url       : player.video.url,
            type      : player.video.type,
            canSkip   : player.video.canSkip,
            label     : player.video.label,
            fullscreen: player.video.fullscreen,
          },
          afterSkillVideo = function(){
            player.video.play(videoBeforeSkills).then(function(){});
            player.video.pause(videoBeforeSkills);
          };

      player.video.play({
        url         : skillVideo.url,
        type        : skillVideo.type,
        transcript  : skillVideo.transcript,
        fullscreen  : true,
        canSkip     : true,
        label       : label,
        onSkip      : afterSkillVideo
      }).then(afterSkillVideo);
    },
    saveProgress: function(sceneId){
      $localStorage["scripts-progress"][player.scriptId] = {
        lastScene : sceneId,
        userLog : UserActionLogService.log
      };
    },
    restoreLastSaved  : function(scriptId){
      var lastSaved = $localStorage["scripts-progress"][scriptId];
      if(!lastSaved){
        return;
      }
      CRGGameScript.jumpTo(lastSaved.lastScene);
      UserActionLogService.loadSaved(lastSaved.userLog)
    },
    skipVideo: function(){
      player.video.onSkip ?  player.video.onSkip() : (player.state && player.state.skip.onClick());
    },
    video: {
      url: '',
      type: '',
      fullscreen: false,
      finished: false,
      paused: false,
      loading : false,
      transcript: {text: "", speed:500},
      whenDone: function(){},
      ended: function(){
        $timeout(function(){
          player.video.finished    = true;
          player.video.whenDone();
        });
      },
      play: function(video, onLoad){
        player.video.loading    = true;
        player.video.url        = video.url;
        player.video.type       = video.type;
        player.video.fullscreen = video.fullscreen;
        player.video.canSkip    = video.canSkip;
        player.video.label      = video.label;
        player.video.finished   = false;
        player.video.paused     = false;
        player.video.onSkip     = video.onSkip;

        VideoPlayerService.stop();
        VideoPlayerService.play(video, function(metaData){
          var transcriptSpeed = metaData.durationInMs/video.transcript.length;
          player.video.loading = false;
          player.video.transcript = {text: video.transcript, speed:transcriptSpeed};
          onLoad && onLoad(metaData);
        });
        return {
          then: function(callback){
            player.video.whenDone = callback;
          }
        };
      },
      replay: function(){
        player.video.paused = false;
        player.video.finished = false;
        VideoPlayerService.replay();
      },
      pause: function(){
        player.video.paused = true;
        VideoPlayerService.pause();
      },
      resume: function(){
        player.video.paused = false;
        VideoPlayerService.resume();
      },
      clearTranscript: function(){
        var transcript = player.video.transcript;
        transcript.text.length && player.chat.add.fromAgent(transcript.text);
        player.video.transcript = {text: "", speed:500};
      },
      stop: function(){
        player.video.finished    = true;
        player.video.clearTranscript();
        VideoPlayerService.stop();
      },
      reset: function(){
        player.video.stop();
        player.video.url = "";
        player.video.type = "";
        player.video.finished = false;
        player.video.fullscreen = false;
        player.video.paused = false;
        player.video.onSkip = undefined;
        player.video.transcript= {text: "", speed:500};
      }
    },
    chat: {
      agent: agent,
      user: user,
      dialogues: [],
      input: {
        ready: true,
      },
      reset: function(){
        player.chat.dialogues = [];
        player.chat.input.ready = true;
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
    getTextFor: function(indices){
      var textFromPassage = function(){
            return player.passage.getText(indices);
          },
          textFromSlide = function(){
            return player.state.slide.getTextFor(indices);
          };
      return player.passage ? textFromPassage() : textFromSlide();
    },
    load: function(gameData){
      player.scriptId = gameData.scriptId;
      player.passage = gameData.passage ? Passage(gameData.passage): null;
      player.chat.agent.image = gameData.agent.smallProfilePicture;
      player.chat.agent.videoThumbnail = gameData.agent.videoPlaceholder;
      CRGGameScript.load(gameData.script);
      player.groups = CRGGameScript.getGroups();
      player.skillGroups = gameData.passage ? null : CRGGameScript.skillGroups;
      player.restoreLastSaved(player.scriptId);
      player.start();
      player.skillVideos =  gameData.skillVideos;
    },
    reset: function(){
      resetSelection();
      player.input = '';
      player.chat.input.ready = true;
    },
    transitTo: function(state){
      if(!state) {
        //player.exit();
        return ;
      }
      player.video.stop();
      if(player.state){
        player.saveProgress(player.state.sceneId)
        $timeout(function(){
          player.state.exiting = true;
        });
      }
      state.load(function(){
        player.reset();
        player.state = state;
        player.setHighlightText(state.highlightPhrase);
        player.setFocusText(state.focusPhrase);
        player.subgroups = SceneGroups[state.group].subgroups;
      });
    },
    state: null,
    setFocusText: function(phrase){
      player.passage ? player.passage.setFocusText(phrase): player.state.slide.setFocus(phrase)
    },
    setHighlightText: function(phrase){
      player.passage ? player.passage.setHighlightText(phrase): player.state.slide.setHighlightText(phrase)
    },
    onTextSelection: function(phrase){
      if(player.state.onTextSelection){
        player.state.onTextSelection(phrase);
      }
      if(player.state.findPhrase){
        player.state.findPhrase.textSelected(phrase);
      }
    },
    submitText: function(phrase){
      if(player.state.submitTextSelection){
        player.state.submitTextSelection(phrase);
      }
      resetSelection();
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
      if(player.state){
        SceneEventService.endOfGame(
            player.passage ? player.passage.id : "skills-intro-thibia",
            player.state.sceneId,
            player.state.endOfSceneEvent()
        );
      }
      player.transitTo(CRGGameScript.next());
    },
    start: function(){
      player.toNextScene();
    }
  };
  return player;
}]);
},{}],34:[function(require,module,exports){
require('./crg-game-service');
require('./crg-game-controller');
require('./phrase-selector');
require('./selection-pointer');
require('./crg-player-service');
require('./crg-game-script');
require('./chat-window/chat-history/scroll-bottom-on-resize');
require('./video-preloader/video-preloader');
},{"./chat-window/chat-history/scroll-bottom-on-resize":29,"./crg-game-controller":30,"./crg-game-script":31,"./crg-game-service":32,"./crg-player-service":33,"./phrase-selector":35,"./selection-pointer":36,"./video-preloader/video-preloader":37}],35:[function(require,module,exports){
app.directive("phraseSelector", ["Throttle", function (Throttle) {
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
      var
          throttle = Throttle(2000),
          selectForTouch = function (selections) {
            throttle.push(function(){
              scope.$selection.indices = selections;
              scope.$eval(attrs.onTextSelectTouch);
            });
          },
          setTouchMenu = function(selections){
            scope.$selection.indices = selections;
            scope.$eval(attrs.onTextSelect);
          },
          isTouchDevice = function(selections){
            return $("html").hasClass("touch");
          },
          highlightSelected = function () {
            var selections = getSelectionText();
            $("[data-word-number]").removeClass("selected-word");
            selections.forEach(function(dataWordNumber){
              var selector = "[data-word-number='<number>']".replace('<number>', dataWordNumber);
              $(selector).addClass("selected-word");
            });
            isTouchDevice() ?  selectForTouch(selections) : setTouchMenu(selections);
          };
      document.addEventListener("selectionchange", highlightSelected, false);
      scope.$selection = {indices: []};
    }
  };
}]);


},{}],36:[function(require,module,exports){
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


},{}],37:[function(require,module,exports){
app.service("VideoPreloader", [function () {
  var loader = {
    buffer : [],
    reset    : function(){
      loader.buffer = [];
    },
    load: function(video){
      loader.buffer.push(video)
    }
  };
  return loader;
}]);
},{}],38:[function(require,module,exports){
app.controller('CRGReportsController', ["$scope", function ($scope) {
  $scope.passages = [
    {
      "id"    : 1,
      "from"  : "Their Eyes Were Watching God",
      "by"    : "Zora Neal Hurston",
      "text"  : "Ships at a distance have every man's wish on board. For some they come in with the tide. For others they sail forever on the horizon, never out of sight, never landing until the Watcher turns his eyes away in resignation, his dreams mocked to death by Time. That is the life of men. \n Now, women forget all those things they don't  want to remember, and remember everything they don't want to forget. The dream is the truth. Then they act and do things accordingly."
    }
  ];
}]);
},{}],39:[function(require,module,exports){
app.service("CRGReportsService", ["$http", "EventServer", "PassageReport",function ($http, EventServer, PassageReport) {
  var CRGReportsService = {
    all: [],
    byPassageId: function(passageID){
      return $http.get(EventServer+"/crg/reports/passages/"+passageID).then(function(response){
        var report = response.data;
        report.id = passageID;
        return PassageReport(report);
      });
    },
    getAllReports: function () {
      return $http.get(EventServer+"/crg/reports/all").then(function(response){
        CRGReportsService.all = response.data.passages;
        return CRGReportsService;
      });
    }
  };
  return CRGReportsService;
}]);
},{}],40:[function(require,module,exports){
require("./crg-reports-controller");
require("./crg-reports-service");
require("./passage-report/crg-passage-report-controller");
require("./passage-report/passage-report");

},{"./crg-reports-controller":38,"./crg-reports-service":39,"./passage-report/crg-passage-report-controller":41,"./passage-report/passage-report":42}],41:[function(require,module,exports){
app.controller('CRGPassageReportController', ["$scope","passage" , "passageReport", function ($scope, passage, passageReport) {
  $scope.passage = passage;
  $scope.passageReport = passageReport;
  $scope.previewScene = function(passageId, sceneId){
    return ":origin/#!/crg/play/:passageId/scenes?select=:sceneId"
        .replace(":origin"    , window.location.href.split("#")[0])
        .replace(":passageId" , passageId)
        .replace(":sceneId"   , sceneId);
  }
}]);
},{}],42:[function(require,module,exports){
app.factory("PassageReport", [function () {

  var roundOff = function(number){
        return Number(number.toFixed(2));
      },
      averageSceneTime = function(scenes){
        var totalAverageSceneTime = 0;
        scenes.forEach(function(scene){
          totalAverageSceneTime +=  scene.averageTimeSpent
        });
        return totalAverageSceneTime/scenes.length;
      },
      maxTimesPlayed = function(scenes){
        var maxTime = 0;
        scenes.forEach(function(scene){
          maxTime = Math.max(scene.timesPlayed, maxTime)
        });
        return maxTime;
      },
      setAverageTime = function (data) {
        data.averageTimeSpent = parseInt(data.sumOfTimeSpent / data.timesPlayed);
        return data;
      },
      setIncorrectAnswerPerUser = function (data) {
        data.incorrectAnswerPerUser = roundOff((data.incorrectAnswer ||0) / data.timesPlayed);
        return data;
      },
      setRelativeTimesPlayed= function(scenes){
        var maxTime = maxTimesPlayed(scenes);
        return scenes.map(function(scene){
          scene.relativeTimesPlayed = scene.timesPlayed/maxTime;
          return scene;
        });
      },
      setRelativeAverageTimes= function(scenes){
        var averageTime = averageSceneTime(scenes);
        return scenes.map(function(scene){
          scene.relativeAverageTimeSpent = scene.averageTimeSpent/averageTime;
          return scene;
        });
      },
      setBounceRates= function(scenes){
        return scenes.map(function(scene, index){
          var nextScene = scenes[index + 1],
              nextSceneVisits = nextScene ? nextScene.timesPlayed : scene.timesPlayed,
              bounces  = scene.timesPlayed - nextSceneVisits;

          scene.bounceRate = roundOff(bounces/scene.timesPlayed) ;
          return scene;
        });
      };

  return function(data){
    return {
      passageID : data.id,
      scenes : setBounceRates(setRelativeTimesPlayed(setRelativeAverageTimes(data.scenes.map(setAverageTime).map(setIncorrectAnswerPerUser))))
    };
  };
}]);
},{}],43:[function(require,module,exports){
app.controller('SceneEditorController', ['$scope', 'Passage', 'PhraseSelection', function ($scope, Passage, PhraseSelection) {
  var editor = {
    selection: PhraseSelection,
    passage: Passage({
      "id"    : 1,
      "from"  : "Self Reliance, 1841",
      "by"    : "Emerson",
      "text"  : "We have also come to this hallowed spot to remind America of the fierce urgency of now. This is no time to engage in the luxury of cooling off or to take the tranquilizing drug of gradualism. Now is the time to make real the promises of democracy. Now is the time to rise from the dark and desolate valley of segregation to the sunlit path of racial justice. Now is the time to lift our nation from the quicksands of racial injustice to the solid rock of brotherhood. Now is the time to make justice a reality for all of God's children."
    }),
    sceneForm: {
      scene : null,
      fields: []
    },
    editingScene : null,
    edit: function(scene){
      var lastScene = editor.sceneForm.scene;
      lastScene && (lastScene.editing = false);
      scene.editing = true
      editor.sceneForm.scene  = scene;
      editor.sceneForm.fields = editor.sceneDefinitions[scene.type].fields;
    },
    scenes: [
      {
        "type": "play-video",
        "config": {
          "group"   : "intro",
          "sceneId" : "about-passage",
          "focus": {
            "indices": [0, 1, 2, 3, 4],
            "text"    : "Ships at a distance"
          }
        }
      },
      {
        "type": "pause-and-read",
        "config": {
          "group"   : "intro",
          "sceneId" : "pause-and-read",
        }
      },
      {
        "type": "text-input",
        "config": {
          "group"   : "zincing",
          "sceneId" : "text-input",
        }
      },
      {
        "type": "play-video",
        "config": {
          "group"   : "zincing",
          "subgroup": "visualize",
          "sceneId" : "about-passage",
        }
      }
,
      {
        "type": "pause-and-read",
        "config": {
          "group"   : "intro",
          "sceneId" : "about-passage",
        }
      },
      {
        "type": "text-input",
        "config": {
          "group"   : "zincing",
          "sceneId" : "about-passage",
        }
      },
      {
        "type": "play-video",
        "config": {
          "group"   : "zincing",
          "subgroup": "visualize",
          "sceneId" : "about-passage",
        }
      }
,
      {
        "type": "pause-and-read",
        "config": {
          "group"   : "intro",
          "sceneId" : "about-passage",
        }
      },
      {
        "type": "text-input",
        "config": {
          "group"   : "zincing",
          "sceneId" : "about-passage",
        }
      },
      {
        "type": "play-video",
        "config": {
          "group"   : "exit",
          "sceneId" : "end-of-game",
        }
      }

    ],
    insertScene: function(index, scene){
      var otherScene = editor.scenes[index],
          otherIndex = editor.scenes.indexOf(scene);
      editor.scenes[index] = scene;
      editor.scenes[otherIndex] = otherScene;
    },
    sceneDefinitions: {
      "play-video": {
        fields: [
          {
            name        : 'focus',
            type        : 'phrase',
            label       : 'Focus',
            placeholder : 'Select Focus Text',
            setValue    : function(scene, phrase){
              scene.config.focus = {indices: phrase.indices,  text: editor.passage.getText(phrase.indices)};
            }
          },
          {
            name        : 'highlight',
            type        : 'phrase',
            label       : 'Highlight',
            placeholder : 'Select Text to Highlight',
            setValue    : function(scene, phrase){
              scene.config.highlight = {indices: phrase.indices, text:  editor.passage.getText(phrase.indices)};
            }
          }
        ]
      },
      "pause-and-read": {fields: []},
      "text-input"    : {fields: []}
    }
  };
  editor.edit(editor.scenes[0]);
  $scope.editor = editor;
}]);
},{}],44:[function(require,module,exports){
require('./scene-editor-controller');
require('./scene-slider/scene-slider-directive');
require('./scene-form/scene-editor-form');
},{"./scene-editor-controller":43,"./scene-form/scene-editor-form":47,"./scene-slider/scene-slider-directive":48}],45:[function(require,module,exports){
require('./phrase/set-scene-phrase');
},{"./phrase/set-scene-phrase":46}],46:[function(require,module,exports){

},{}],47:[function(require,module,exports){
require('./fields/fields');
},{"./fields/fields":45}],48:[function(require,module,exports){
app.directive("sceneSlider", ["$timeout", function($timeout){

  return {
    restrict : "C",
    scope    : false,
    link     : function(scope, element, attrs){
      var
          resize = function(){
            $timeout(function(){
              var $list       = $(element).find("ul.scenes"),
                  scenes      = $list.find("> li"),
                  totalWidth  = 0;
              scenes.each(function(index, sceneElement){
                totalWidth += $(sceneElement).outerWidth();
              });
              $list.width(totalWidth);
            });
          };
      $(window).on("resize", resize);
      scope.$watch("editor.scenes", resize, true);
    }
  };
}]);
},{}],49:[function(require,module,exports){
require("./coding-challlenge-editor-directive");
require("./coding-challlenge-scenario-evaluator");
require("./coding-challlenge-scene-element");
},{"./coding-challlenge-editor-directive":50,"./coding-challlenge-scenario-evaluator":51,"./coding-challlenge-scene-element":52}],50:[function(require,module,exports){
app.directive("codeEditor", ["aceEditor", "CodeRunner", "$timeout", function( aceEditor, CodeRunner, $timeout){
  return {
    //restrict: "A",
    scope : true,
    link: function(scope, element, attrs){
      var
          config      = scope.$eval(attrs.config),
          options     = {mode: "ace/mode/ruby", selectionStyle: "text"},
          scene       = scope.game.player.state,
          editorHeight= "300px",
          editor      = aceEditor.create(element[0], options);

      $(element).height(editorHeight);
      editor.resize();
      editor.setTheme("ace/theme/tomorrow_night_eighties");

      scene.setCodingChallenge(config, {
        setEditorText: function(text){
          editor.setValue(text);
        },
        getEditorText: function(text){
          return editor.getValue();
        }
      });

      scene.codingChallenge.loadElement();
      editor.session.on('change', function(delta) {
        scene.codingChallenge.codeUpdated(editor.getValue(), delta);
      });
    }
  }
}]);

},{}],51:[function(require,module,exports){
app.service("CodeChallengeScenarioEvaluator", [function () {

  var createScenario= function(runResult, scenarioConfig){
    return {
      config: scenarioConfig,
      validations: scenarioConfig.evaluate.split(",").map(function (expressoin) {
        var isInverse     = expressoin.startsWith("!"),
            scenarioName  = isInverse ? expressoin.split("!")[1].trim() : expressoin.trim(),
            result        = runResult.cases.find(function (scenario) {
                              return scenario.name === scenarioName;
                            }),
            validationSuccess = isInverse ? !result.success : result.success;
        return {valid: validationSuccess}
      })
    };
  }
  return {
    evaluate: function(runResult, config){
      var
          scenarios = config.map(function (scenario) {
            return createScenario(runResult, scenario);
          }),
          validScenario = function(scenario){
            var valid = true;
            scenario.validations.forEach(function(validation){
              valid = valid && validation.valid;
            })
            return valid;
          },
          appliedScenario = scenarios.find(validScenario);

      return {
        response : appliedScenario.config.response
      }
    }
  };
}]);
},{}],52:[function(require,module,exports){
app.factory("CodeChallengeElement", ["$localStorage", "CodeRunner", "CodeChallengeScenarioEvaluator", function ( $localStorage, CodeRunner, CodeChallengeScenarioEvaluator) {


  return function (state, config, params) {
    var
        watchingProgress = {},
        toProgress = function(scenario){
          watchingProgress[scenario.name] = true;
          return {
            scenario: scenario.name,
            label   : scenario.label,
            success : false,
            expected: null,
            actual  : null,
            expectedLabel   : scenario.expectedLabel,
          }
        },
        CodeChallengeElement = {
          error: null,
          progress: config.progressScenarios.map(toProgress),
          giveUp: function(){},
          submitChallenge: function(){
            var validatorScript = config.validators,
                worksheetScript = params.getEditorText().split("\n");
            return CodeRunner.runRuby(
                worksheetScript,
                validatorScript)
                .then(CodeChallengeElement.onRunResult)
          },
          onRunResult: function(result){
            if(result.error){
              CodeChallengeElement.error = result.errorMessages.join(". ");
              return result;
            }

            CodeChallengeElement.error = null;
            CodeChallengeElement.saveCode(result.code.join("\n"));
            CodeChallengeElement.updateProgress(result.cases);
            return result;
          },
          updateProgress: function(scenarios){
            angular.forEach(scenarios, function(testCase){
              if(watchingProgress[testCase.name]){
                var scenarioProgress = CodeChallengeElement.progress.find(function(progress){
                  return testCase.name === progress.scenario;
                });
                scenarioProgress.success  = testCase.success;
                scenarioProgress.expected = testCase.expected;
                scenarioProgress.actual   = testCase.actual;
              }
            })
          },
          loadElement: function () {
            var savedCode = CodeChallengeElement.getSavedCode();
            params.setEditorText(savedCode || config.worksheet.join("\n"));
            state.setButtons([
              {label: "Give Up!", onClick: CodeChallengeElement.giveUp, secondary: true},
              {label: "Evaluate",   onClick: CodeChallengeElement.evaluate}
            ]);
            CodeChallengeElement.submitChallenge();
          },
          saveCode: function(code){
            $localStorage[state.sceneId] = $localStorage[state.sceneId] || {};
            $localStorage[state.sceneId]["savedCode"] = code;
          },
          getSavedCode: function(){
            var scenePlayed = $localStorage[state.sceneId],
                codeSaved   = scenePlayed && scenePlayed.savedCode;
            return codeSaved;
          },
          codeUpdated: function (code, delta) {
            CodeChallengeElement.submitChallenge();
          },
          evaluate: function(){
            CodeChallengeElement.enableButtons(false);
            CodeChallengeElement.submitChallenge().then(function(result){
              var evaluation = CodeChallengeScenarioEvaluator.evaluate(result, config.scenarios);
              CodeChallengeElement.enableButtons(true);
              evaluation.response.endChallenge ?
                  CodeChallengeElement.challengeCompleted(evaluation.response)
                  : CodeChallengeElement.respond(evaluation.response)
            });
          },
          respond: function(response){
            return state.playVideo(response.video);
          },
          challengeCompleted: function(response){
            CodeChallengeElement.respond(response).then(state.confirmForExit);
          },
          enableButtons: function(enable){
            var disabledButton = function(button){ button.disbaled = !enable; return button;};
            state.setButtons(state.buttons.map(disabledButton));
          }
        };
    return CodeChallengeElement;
  };
}]);
},{}],53:[function(require,module,exports){
app.service("aceEditor", [function(){
  return {
    create : function(elment, options){
      var aceEditor = ace.edit(elment, options);
      aceEditor.getSession().setMode("ace/mode/ruby");
      aceEditor.setShowPrintMargin(false);
      aceEditor.getSession().setTabSize(2);
      aceEditor.getSession().setUseSoftTabs(true);
      aceEditor.setAutoScrollEditorIntoView(false);
      return aceEditor;
    }
  };
}]);
},{}],54:[function(require,module,exports){
app.factory("CodeEditorElement", ["$timeout", "$localStorage", function ($timeout, $localStorage) {


  return function (state, config, options) {
    var
        editorConfig  = JSON.parse(JSON.stringify(config)),
        pendingCase = function (result) {
          return !result.success
        },
        successCase = function (result) {
          return result.success
        },
        endCase = function (testCase) {
          return config.cases[testCase.name].endScene;
        },
        CodeEditorElement = {
          challengeEnded: false,
          loadElement: function(){
            var codeSaved   = CodeEditorElement.getSavedCode();
            codeSaved && options.setEditorText(codeSaved);
            if(!config.cantSkip){
              state.setButtons([
                {
                  label : "Give Up !",
                  onClick : function(){
                    CodeEditorElement.showSolution();
                  }
                }
              ])
            }
          },
          getSavedCode: function(){
            var scenePlayed = $localStorage[state.sceneId],
                codeSaved   = scenePlayed && scenePlayed.savedCode;
            return codeSaved;
          },
          save: function(code){
            $localStorage[state.sceneId] = $localStorage[state.sceneId] || {};
            $localStorage[state.sceneId]["savedCode"] = code;
          },
          respondTo: function (result) {
            if(CodeEditorElement.challengeEnded){
              return;
            }
            if(!result.error){
              CodeEditorElement.save(options.getEditorText());
            }

            var hasError      = result.error,
                successCases  = result.cases.filter(successCase),
                moveToNext    = successCases.filter(endCase),
                endScene      = moveToNext[0];

            endScene ?  CodeEditorElement.challengeComplete(endScene) : "";
          },
          challengeComplete: function(endScene){
            CodeEditorElement.challengeEnded = true;
            state.playVideo(config.cases[endScene.name].response.video).then(function(){
              state.confirmForExit();
            })
          },
          showSolution :function(){
            CodeEditorElement.challengeEnded = true;
            options.setEditorText(config.solution);
            state.setButtons([]);
            state.playVideo(config.showSolution).then(function(){
              state.confirmForExit();
            });
          }
        };
    CodeEditorElement.loadElement();
    return CodeEditorElement;
  };
}]);
},{}],55:[function(require,module,exports){
app.service("CodeRunner", ["$http", "RUBY_VALIDATOR_API", function($http, RUBY_VALIDATOR_API){
  return {
    runRuby : function(worksheet, validator, taskId){
      return $http.put(RUBY_VALIDATOR_API, {
        worksheet:  worksheet,
        validator:  validator
      }).then(function(response){
        return {
          taskId: taskId,
          error: response.data.length,
          errorMessages: response.data.tests ? [] : response.data,
          cases: response.data.tests || [],
          code : worksheet
        };
      })
    }
  };
}]);
},{}],56:[function(require,module,exports){
app.factory("DragDropTextElement", ["GameAttempts", "$timeout", function (GameAttempts, $timeout) {
  var
      relationString = function(draggable, droppable){
        return draggable.indices.join() + "==" + droppable.indices.join()
      },
      indexOf = function(relations){
        var index  = {};
        relations.forEach(function(relation){
          index[relationString(relation.draggable, relation.droppable)] = relation;
        });
        return index;
      };
  return function(state, config){
    var withText = function(phrase){
      return {indices: phrase.indices, text: state.getTextFor(phrase.indices)};
    };
    var dragDropElement = {
      draggables      : [],
      droppables      : config.droppables,
      correct         : indexOf(config.correct),
      knownIncorrect  : indexOf(config.knownIncorrect),
      attempts        : GameAttempts(config.attempts),
      draggingNow     : null,
      __wrondDrop     : null,
      disabled        : false,
      loadElement     : function(){
        var allDraggableIndices = [].concat.apply([], (config.draggables).map(function(phrase){
          return phrase.indices;
        }));
        state.addHighlight({indices: allDraggableIndices});
        dragDropElement.draggables = config.draggables.map(withText);
      },
      dragging: function(draggable){
        dragDropElement.draggingNow = draggable;
      },
      __cancelWrongDrop: function(){
        /*Fix to prevent wrong dropped from triggering when dropped on a droppable*/
        $timeout.cancel(dragDropElement.__wrondDrop);
      },
      dropped         : function(draggable,droppable){
        dragDropElement.__cancelWrongDrop();
        var relationId      = relationString(draggable, droppable),
            correct         =  dragDropElement.correct[relationId],
            knownIncorrect  =  dragDropElement.knownIncorrect[relationId],
            wrongAttempt    = !correct && !knownIncorrect;
        correct        && dragDropElement.correctDrop(correct) ;
        knownIncorrect && dragDropElement.knownIncorrectDrop(knownIncorrect.video) ;
        wrongAttempt   && dragDropElement.unknownDrop(draggable.video) ;
      },
      removeDroppable: function(droppable){
        var toRemove = dragDropElement.droppables.find(function (phrase) {
          return phrase.indices.join() == droppable.indices.join();
        });
        toRemove.disable = true
      },
      correctDrop       : function(relation){
        var attemptVideo   = dragDropElement.attempts.saveCorrect(),
            nextVideo      = relation.video || attemptVideo,
            noAttemptsLeft = dragDropElement.attempts.noneLeft();
        relation.removeDroppable && dragDropElement.removeDroppable(relation.droppable);
        state.addHighlight(relation.droppable);
        noAttemptsLeft ? dragDropElement.endDragDrop() : state.playVideo(nextVideo);
      },
      knownIncorrectDrop: function(video){
        state.playVideo(video);
      },
      unknownDrop: function(video, draggable){
        var failureVideo = dragDropElement.attempts.saveInCorrect(),
            noAttemptsLeft = dragDropElement.attempts.noneLeft();
        noAttemptsLeft ? dragDropElement.endDragDrop() : state.playVideo(video || failureVideo);
      },
      wrongDrop       : function(draggable){
        dragDropElement.__cancelWrongDrop();
        dragDropElement.__wrondDrop = $timeout(function(){
          dragDropElement.unknownDrop(draggable.video, draggable);
        });
      },
      endDragDrop: function(){
        dragDropElement.disabled = true;
        config.highlightAtEnd && state.addHighlight (config.highlightAtEnd);
        state.setButtons([{label: "Proceed", onClick: state.toNextScene}]);
        state.playVideo(dragDropElement.attempts.endVideo());
      }
    };

    return dragDropElement;
  };
}]);
},{}],57:[function(require,module,exports){
app.factory("FindPhraseElement", ["GameAttempts", "PollResultElement", "Phrase", function (GameAttempts, PollResultElement, Phrase) {

  return function(state, config){
    var findPhrase = {
      disabled        : false,
      correct         : config.correct.map(Phrase),
      knownIncorrect  : config.knownIncorrect.map(Phrase) ,
      attempts        : GameAttempts(config.attempts),
      showSubmit        : false,
      selectionIsClose: false,
      submitButtonLabel: "Select",
      userSelection    : false,
      loadElement      : function(){
      },
      textSelected: function(){
        findPhrase.showSubmit = true;
      },
      submitText : function(selection){
        findPhrase.showSubmit = false;
        selection.indices = selection.indices.map(function (index) {
          return parseInt(index);
        });
        var
            correct          =  findPhrase.correct.find(function(option){return option.matches(selection);}),
            partialCorrect   =  findPhrase.correct.find(function(option){return option.partialMatch(selection);}),
            knownIncorrect   =  findPhrase.knownIncorrect.find(function(option){return option.matches(selection);}),
            isCorrect        =   !!correct,
            isPartialCorrect =   !correct && partialCorrect,
            isKnownIncorrect =   !isCorrect && !isPartialCorrect && knownIncorrect,
            isUnknown        = !(isCorrect || isKnownIncorrect || isPartialCorrect);
        isCorrect        && findPhrase.correctSelection(correct);
        isPartialCorrect && findPhrase.partialCorrectSelection(partialCorrect);
        isKnownIncorrect && findPhrase.knownIncorrectSelection(knownIncorrect);
        isUnknown        && findPhrase.unknownSelection(selection);
      },
      correctSelection       : function(selection){
        var attemptVideo   = findPhrase.attempts.saveCorrect(),
            nextVideo      = selection.video || attemptVideo,
            noAttemptsLeft = findPhrase.attempts.noneLeft(),
            proceed = function () {
              noAttemptsLeft && findPhrase.endGame();
            },
            forThisAttempt = function(then){
              var
                  takeInput = function () {
                    findPhrase.disable();
                    state.showInput = true;
                    state.submitInput = function (userInput) {
                      state.showInput = false;
                      findPhrase.enable();
                      state.setVideo(state.video);
                      proceed();
                    };
                    state.playVideo(then.video);
                  },
                  showPollResult = function (pollResult) {
                    var afterPoll = proceed;
                    findPhrase.disable();
                    state.pollResult = PollResultElement(state, pollResult, afterPoll);
                    state.playVideo(then.video);
                  };
              then.showInput && takeInput();
              then.pollResult && showPollResult(then.pollResult);
            };
        state.addHighlight(selection.phrase);
        selection.then ? forThisAttempt(selection.then, nextVideo) : noAttemptsLeft ? proceed() : state.playVideo(nextVideo);
        //noAttemptsLeft ? findPhrase.endGame() : (selection.then ? forThisAttempt(selection.then) : state.playVideo(nextVideo));
      },

      knownIncorrectSelection: function(selection){
        state.playVideo(selection.video);
      },

      partialCorrectSelection: function(selection){
        var video = selection.partialCorrectVideo || config.partialCorrectVideo;
        video ? state.playVideo(video) : findPhrase.unknownSelection()
      },

      unknownSelection: function(){
        var failureVideo = findPhrase.attempts.saveInCorrect(),
            noAttemptsLeft = findPhrase.attempts.noneLeft();
        noAttemptsLeft ? findPhrase.endGame() : state.playVideo(failureVideo);
      },
      disable: function(){
        findPhrase.disabled = true;
      },
      enable: function(){
        findPhrase.disabled = false;
      },
      endGame: function(){
        findPhrase.disable();
        !config.skipHighlightingCorrectEnd && state.highlightAll(findPhrase.correct.map(function(correct){return correct.phrase;}));
        if(config.proceedWithoutConfirm){
          return state.toNextScene();
        }
        state.setButtons([{label: "Proceed", onClick: state.toNextScene}]);
        var endVideo = findPhrase.attempts.endVideo();
        endVideo && state.playVideo(endVideo);
      }
    };

    return findPhrase;
  };
}]);
},{}],58:[function(require,module,exports){
app.factory("GameAttempts", [function () {
  return function(config){
    var attempts = {
      correctAttempts  : 0,
      inCorrectAttempts: 0,
      saveCorrect      : function(){
        attempts.correctAttempts++
        var nextIndex = ((attempts.correctAttempts-1) % config.onCorrectMessages.length);
        return config.onCorrectMessages[nextIndex];
      },
      saveInCorrect    : function(){
        attempts.inCorrectAttempts++;
        var nextIndex = ((attempts.inCorrectAttempts -1)% config.onInCorrectMessages.length);
        return config.onInCorrectMessages[nextIndex ];
      },
      noneLeft   : function(){
        var noMoreCorrect   = attempts.correctAttempts   >= config.correctExpected,
            noMoreIncorrect = attempts.inCorrectAttempts >=config.incorrectAllowed;
        return noMoreCorrect || noMoreIncorrect;
      },
      endVideo: function(){
       var endWithSuccess = attempts.correctAttempts   >= config.correctExpected;
        return endWithSuccess ?  config.onFinishBySuccess : config.onFinishByFailure;
      }
    };
    return attempts;
  };
}]);
},{}],59:[function(require,module,exports){
app.factory("MultiChoiceElement", ["GameAttempts", function (GameAttempts) {
  var selectedOption = function (option) {
        return option.selected;
      },
      incorrectSelections = function (option) {
        return option.correct != option.selected;
      },
      correctSelections = function (option) {
        return option.correct == option.selected;
      },
      optionText = function(option){
        return option.label;
      };

  return function(state, config){
    var toSelectable = function (option) {
      return {
        label     : option.label,
        response  : option.response || {},
        correct   : option.correct,
        selected  : false,
        disabled  : false,
        wrongSelection  : false,
        correctSelection: false,
      }
    };
    var multiChoice = {
      closed      : false,
      selections  : [],
      options     : config.options.map(toSelectable),
      noOfSelectionsAllowed : config.noOfSelectionsAllowed || 1,
      chosen     : null,
      submitButton :       {
        label   : "Submit",
        disabled: true,
        onClick : function(){
          multiChoice.submitOption();
        }
      },
      loadElement: function(){
        state.setButtons([multiChoice.submitButton]);
        multiChoice.submitButton = state.getButton(multiChoice.submitButton.label)
      },
      _resetSelections: function(){
        //var hasSelections         = !multiChoice.selections.length;
        //state.buttons[0].disabled = hasSelections;
        angular.forEach(multiChoice.options, function(option){
          option.selected = ( multiChoice.selections.indexOf(option) > -1);
        });
        multiChoice.chosen = null;
        multiChoice.submitButton.disabled = true;
      },
      setOption  : function(chosen){
        var replaceSelectionIf = multiChoice.selections.length >= multiChoice.noOfSelectionsAllowed;
        replaceSelectionIf && multiChoice.selections.shift();
        multiChoice.selections.push(chosen);
        multiChoice._resetSelections();
        multiChoice.chosen = chosen;
        multiChoice.submitButton.disabled = false;
      },
      getSelectionsAsText : function(){
        return multiChoice.options.filter(selectedOption).map(optionText).join(", ").replace(new RegExp(',$'), '');
      },
      submitOption   : function(){
        var option = multiChoice.chosen;
        state.userSaid(multiChoice.getSelectionsAsText());
        option.correct ? multiChoice.correctSelected(option) : multiChoice.incorrectSelected(option);
      },
      correctSelected  : function(option){
        var attemptVideo   = multiChoice.attempts.saveCorrect(),
            noAttemptsLeft = multiChoice.attempts.noneLeft();
        option.correctSelection = true;
        noAttemptsLeft ? multiChoice.end(option) : multiChoice.respond(option.response, attemptVideo);
      },
      incorrectSelected: function(option){
        var attemptVideo   = multiChoice.attempts.saveInCorrect(),
            noAttemptsLeft = multiChoice.attempts.noneLeft();
        option.wrongSelection = true;
        noAttemptsLeft ? multiChoice.end(option) : multiChoice.respond(option.response, attemptVideo);
      },
      respond: function(response, attemptVideo){
        var responseVideo =  response.video || attemptVideo;
        multiChoice.hideSubmit();
        state.playVideo(responseVideo).then(function(){
          multiChoice.showSubmit();
        });
      },
      hideSubmit : function(){
        state.setButtons([]);
      },
      showSubmit : function(){
        state.setButtons([multiChoice.submitButton]);
      },
      end: function(option){
        multiChoice.closed = true;
        multiChoice.hideSubmit();
        state.saveMultiChoiceAnswer(state.options, option.label, option.correct);

        config.highlightAtEnd && state.addHighlight (config.highlightAtEnd);
        var video = option.response ? option.response.video : null;
        state.playVideo(video || multiChoice.attempts.endVideo()).then(function(){
          state.confirmAndProceed();
        });
      },
      attempts: config.attempts ? GameAttempts(config.attempts) : null
    };
    return multiChoice;
  };
}]);
},{}],60:[function(require,module,exports){
app.factory("Phrase", [function () {
  const MIN_SELECTION_DISTANCE = 0.5,
      PARTIAL_SELECT_DISTANCE = 0.1;
  var
      phraseId = function(phrase){
        return phrase.join();
      },
      indexOf = function(selectableOptions){
        var index  = {};
        selectableOptions.forEach(function(option){
          index[phraseId(option.phrase)] = option;
        });
        return index;
      },
      commonWords = function(phraseOne, phraseTwo){
        return phraseOne.indices.filter(function(index){
          return phraseTwo.indices.indexOf(index) > -1;
        });
      },

      distanceBetween = function(phraseOne, phraseTwo){
        var common     = commonWords(phraseOne, phraseTwo).length,
            largerOne  = phraseOne.indices.length > phraseTwo.indices.length ? phraseOne : phraseTwo;
        return common/largerOne.indices.length;
      },
      matches = function(phraseOne, phraseTwo){
        var areClose = distanceBetween(phraseOne, phraseTwo);
        return areClose >= MIN_SELECTION_DISTANCE;
      },
      partialMatch = function(phraseOne, phraseTwo){
        var areClose = distanceBetween(phraseOne, phraseTwo);
        return areClose >= PARTIAL_SELECT_DISTANCE;
      };

  return function(option){
    option.matches = function(selectedPhrase){
      return matches(selectedPhrase, option.phrase);
    };
    option.partialMatch = function(selectedPhrase){
      return partialMatch(selectedPhrase, option.phrase);
    };
    return option;
  };
}]);
},{}],61:[function(require,module,exports){
app.factory("PollResultElement", ["GameAttempts", "$timeout", function (GameAttempts, $timeout) {
  return function(state, config, then){
    var
        associationFor = function (value) {
          return function (association) {
            return association.value.toLowerCase() == value.toLowerCase();
          };
        },
        addLabel= function(association){
          return {
            label: association.value,
            score: association.score
          }
        },
        afterPollFinishes = then || function(){
          state.setButtons([
            {
              label  : "Proceed",
              onClick: function(){
                state.toNextScene();
              }
            }
          ]);
        };

    var pollResult = {
      attempts      : new Array(config.attemptsAllowed),
      attemptsMade  : 0,
      scores        : [],
      correctAttempts: 0,
      wrongAttempts: 0,
      render        : function(){
        state.multiInput = (config.multiInput || []).map(function(inlineInput){
          var multiInputItem = {
            label       : inlineInput.label,
            value       : inlineInput.value,
            buttonLabel : inlineInput.buttonLabel,
            disabled    : false,
            submit      : function (value) {
              multiInputItem.submitted = true;
              multiInputItem.disabled = true;
              pollResult.submitPollInput(value);
            }
          };
          return multiInputItem
        });
        state.showInput = (config.multiInput.length == 0 && config.attemptsAllowed == 1);
        state.submitInput = function(value) {
          pollResult.submitPollInput(value);
          state.showInput = false;
        }
      },
      submitPollInput: function(value){
        var association = config.scores.find(associationFor(value)),
            action = association ? pollResult.goodGuess(association) : pollResult.badGuess(value);
        if(++pollResult.attemptsMade == config.attemptsAllowed){
          action.then(pollResult.endPoll);
        }
      },
      goodGuess: function(association){
        pollResult.scores.push({
          label: association.value,
          score: association.score,
          success : true,
        });
        pollResult.attempts[pollResult.attemptsMade] = {success: true};
        var video = pollResult.nextCorrectAttemptMessage();
        return video ? state.playVideo(video) : {then: function(callback){
          callback();
        }};
      },
      badGuess: function(value){
        pollResult.scores.push({
          label: value,
          score: 0,
          success : false,
        });
        pollResult.attempts[pollResult.attemptsMade] = {failed: true};
        var video = pollResult.nextWrongAttemptMessage();
        return video ? state.playVideo(video) : {then: function(callback){
          callback();
        }};
      },
      nextWrongAttemptMessage: function(){
        return config.wrongAttemptMessages[(pollResult.wrongAttempts++)%config.wrongAttemptMessages.length];
      },
      nextCorrectAttemptMessage: function(){
        return config.correctAttemptMessages[(pollResult.correctAttempts++)%config.correctAttemptMessages.length];
      },
      endPoll: function(){
        $timeout(function(){
          state.multiInput = [];
          pollResult.scores  = config.scores.map(addLabel).slice(0, config.topPollResultCount);
          state.playVideo(config.endVideo).then(afterPollFinishes);
        });

      }
    };
    pollResult.render();
    return pollResult;
  };
}]);
},{}],62:[function(require,module,exports){
app.directive("rubyEditor", ["aceEditor", "CodeRunner", "$timeout", function( aceEditor, CodeRunner, $timeout){
  return {
    //restrict: "A",
    scope : true,
    link: function(scope, element, attrs){
      var
          codeEditor = scope.$eval(attrs.codeEditor),
          options = {
            mode: "ace/mode/ruby",
            selectionStyle: "text"
          },
          scene = scope.game.player.state,
          editor,
          throttle = 1000,
          lastRunTask = null;;

      $(element).height(codeEditor.style.height);
      editor = aceEditor.create(element[0], options);
      editor.setValue(codeEditor.worksheet.join("\n"));
      scene.codeEditors.add(codeEditor, {
        setEditorText: function(text){
          editor.setValue(text.join("\n"));
        },
        getEditorText: function(text){
          return editor.getValue().split("\n");
        }
      });
      editor.resize();
      editor.setTheme("ace/theme/tomorrow_night_eighties");

      editor.session.on('change', function(delta) {
        $timeout.cancel(lastRunTask);
        scene.codeEditors.running();
        lastRunTask = $timeout(function(){
          CodeRunner.runRuby(editor.getValue().split("\n"), codeEditor.validator, lastRunTask).then(function(result){
            if(result.taskId != lastRunTask){
              // ignore result if new task is already queued
              return;
            }
            scene.codeEditors.respondTo(result)
            scene.codeEditors.afterRun(result);
          });
        }, throttle);
      });
    }
  }
}]);

},{}],63:[function(require,module,exports){
app.directive("readOnlyCode", ["aceEditor", function( aceEditor){
  return {
    //restrict: "A",
    link: function(scope, element, attrs){
      var
          readOnlyCode = scope.$eval(attrs.readOnlyCode),
          options = {
            mode: "ace/mode/ruby",
            selectionStyle: "text",
            highlightActiveLine: false,
            highlightGutterLine: false
          },
          lineHeight = 25,
          editorHeight = readOnlyCode.code.length * lineHeight,
          editor ;


      $(element).height(editorHeight);
      editor = aceEditor.create(element[0], options);
      editor.setReadOnly(true);
      editor.setValue(readOnlyCode.code.join("\n"));
      editor.clearSelection();
      editor.renderer.$cursorLayer.element.style.display = "none";
      editor.container.style.lineHeight = 1;
      editor.renderer.updateFontSize();
      editor.resize();
    }
  }
}]);

},{}],64:[function(require,module,exports){
app.factory("SceneSlideElement", [ "SlideWordIndexer", "SlideSectionElement", "SlideBulletElement" ,function (SlideWordIndexer, SlideSectionElement, SlideBulletElement) {
  return function(state, slideConfig){
    var
        wordIndexer = SlideWordIndexer(),
        sceneSlideElement = {
          title   : slideConfig.title,
          bullets : slideConfig.bullets  ? SlideBulletElement(slideConfig.bullets, wordIndexer) : null,
          sections: slideConfig.sections ? SlideSectionElement(slideConfig.sections, wordIndexer) : null,
          codingChallenge: slideConfig.codingChallenge,

          setFocus : function(phrase){
            wordIndexer.setFocus(phrase)
          },
          setHighlightText: function(phrase){
            wordIndexer.setHighlightText(phrase);
          },
          getTextFor: function(indices){
            return indices.map(function (wordIndex) {
              return wordIndexer.words[wordIndex].text;
            }).join(" ");

          }
        };
    return sceneSlideElement;
  };
}]);
},{}],65:[function(require,module,exports){
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
},{}],66:[function(require,module,exports){
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
},{}],67:[function(require,module,exports){
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
},{}],68:[function(require,module,exports){
app.factory("SlideBulletElement", [ function () {
  return function(bullets, wordIndexer){
    return bullets.map(function(bullet){
      return {
        text : bullet,
        words: wordIndexer.indexed(bullet)
      };
    });
  };
}]);
},{}],69:[function(require,module,exports){
app.factory("SlideSectionElement", [ function () {
  return function(sections, wordIndexer){
    return sections.map(function(section){
      return {
        title: wordIndexer.indexed(section.title),
        text : section.text ? wordIndexer.indexed(section.text) : '',
        codeEditor : section.codeEditor,
        readOnlyCode : section.readOnlyCode,
      };
    });
  };
}]);
},{}],70:[function(require,module,exports){
app.factory("SlideWordIndexer", [ function () {
  return function(){
    var nonEmpty = function(s){return s.length > 0;};
    var
        wordIndexer = {
          words: [],
          next : 0,
          indexed: function(text){
            return text.split(" ").filter(nonEmpty).map(function(word){
              return wordIndexer.add(word);
            })
          },
          add  : function(wordText){
            var word = {
              text      : wordText,
              index     : wordIndexer.next++,
              highlight : false,
              focus     : false,
              linebreak : wordText == "\n"
            };
            wordIndexer.words.push(word);
            return word;
          },
          setFocus: function(phrase){
            angular.forEach(wordIndexer.words, function(word){
              word.focus = phrase.indices.indexOf(word.index) > -1;
            });
          },
          setHighlightText: function(phrase){
            angular.forEach(wordIndexer.words, function(word){
              word.highlight = phrase.indices.indexOf(word.index) > -1;
            });
          },
          getText : function(phrase){
            return wordIndexer.words.filter(function(word){
              return phrase.indices.indexOf(word.index) > -1;
            }).map(function(word){
              return word.text;
            }).join(" ");
          }
        };

    return wordIndexer;
  };
}]);
},{}],71:[function(require,module,exports){
app.factory("BaseScene", ["CRGGameService", "UserActionLogService", "$q", "$timeout", function (game, UserActionLogService, $q, $timeout) {
  return function(scene, config){
    var loaderTimeout;
    scene.sceneLoadVideo    = config.sceneLoadVideo;
    scene.sceneId           = config.sceneId;
    scene.group             = config.group;
    scene.subgroup          = config.subgroup;
    scene.showInput         = scene.showInput;
    scene.disableState      = scene.disableState;

    scene.highlightPhrase   = scene.highlightPhrase || {indices: []};
    scene.focusPhrase       = scene.focusPhrase     || {indices: []};
    scene.transcript        = scene.transcript      || {text: ""};
    scene.showQuotes        = scene.showQuotes;

    scene.nextButtonLabel = config.nextButtonLabel;

    scene.onSubmitInput     = function(onSubmitInput){
      scene.submitInput  = function(input){
        UserActionLogService.logTextInput(scene.sceneId, input);
        onSubmitInput(input);
      };
    };

    scene.onSubmitInput(scene.submitInput || function(userInput){})

    scene.load              = function(renderScene){
      var onSceneVideoLoad = function(metaData){
        loaderTimeout = $timeout(function(){
          renderScene();

          //Fix for consecutive drag and drop scenes
          var dragDrop = scene.dragDropText;
          scene.dragDropText = null;
          $timeout(function(){
            scene.dragDropText = dragDrop;
            if(scene.dragDropText){
              scene.dragDropText.loadElement();
            }
          }, 500);

          scene.multiChoice && scene.multiChoice.loadElement();
        }, config.renderDelay || 0);
      };
      if(config.condition){
        var condition   = config.condition,
            savedAction = UserActionLogService.getAction(condition.sceneId, condition.action),
            skip        = !savedAction || !(!!savedAction.value == !!condition.expected);
        if(skip)  {
          scene.toNextScene();
          return;
        }
      }
      if(config.fetchData && config.fetchData.length){
        scene.$fetchedData = {};
        angular.forEach(config.fetchData, function(data){
          var dataName = Object.keys(data)[0],
              sceneId  = data[dataName].sceneId,
              actionId = data[dataName].action,
              action   = UserActionLogService.getAction(sceneId, actionId);
          scene.$fetchedData[dataName] = action ? action.value : null;
        })
      }
      scene.message && scene.setMessage(scene.message);
      config.fillInputText && scene.fillInputText();

      scene._loadTime        = (new Date()).getTime();
      if(config.sceneLoadVideo){
        scene.playVideo(config.sceneLoadVideo, onSceneVideoLoad).then(function(){
          scene._videoEndedAt   = (new Date()).getTime();
          if(scene.afterVideo){
            scene.afterVideo();
          }
          if(config.sceneLoadVideo.exitOnEnd){
            scene.confirmForExit();
          }
          if(config.sceneLoadVideo.confirmForExit){
            scene.confirmForExit();
          }
        });
      }else{
        onSceneVideoLoad();
      }
    };

    scene.$eval = function(expression){
      return expression.startsWith("$") ? scene.$fetchedData[expression] : expression;
    };

    scene.setMessage = function(message){
      message.text = scene.$eval(message.text);
      scene.message = message;
    };

    scene.fillInputText = function(){
      var input = scene.$eval(config.fillInputText.text);
      scene.inputText = input;
    };

    scene.endOfSceneEvent = function(){
      var now = (new Date().getTime());

      return {
        timestamp       : now,
        incorrectAnswer : scene.wrongAttempts || 0,
        timeSpent       : (now - scene._loadTime)/1000
      };
    };
    scene.showTextSelectionHelp   = scene.showTextSelectionHelp;
    scene.textSelectedIsClose     = scene.textSelectedIsClose;
    scene.drag          = null;
    scene.dragRelations = scene.dragRelations || [];

    scene.dropBoxes  = scene.dropBoxes || [];
    scene.setVideo = function(video){
      scene.playVideo({
        url: video.url,
        type: video.type,
        transcript: ""
      })
      game.player.video.pause();
    };
    scene.playVideo = function(video, onVideoLoad){
      var onVideoStart = function(metaData){
        onVideoLoad && onVideoLoad(metaData);
      };
      var onVideoEnd = $q.defer();
      game.player.video.play(video, onVideoStart).then(function(){
        onVideoEnd.resolve(video);
      });
      return onVideoEnd.promise;
    };
    scene.toNextScene = function(){
      loaderTimeout && $timeout.cancel(loaderTimeout);
      game.player.toNextScene();
    };

    scene.highlight = function(phrase){
      scene.highlightPhrase = phrase;
      game.player.setHighlightText(scene.highlightPhrase);
    };

    scene.addHighlight = function(phrase){
      scene.highlightPhrase = {indices: scene.highlightPhrase.indices.concat(phrase.indices)};
      game.player.setHighlightText(scene.highlightPhrase);
    };

    scene.highlightAll = function(phraseArray){
      var allIndices = [].concat.apply(phraseArray.map(function(phrase){
        return phrase.indices;
      })).reduce(function(a, b){
        return a.concat(b);
      });
      scene.addHighlight({indices: allIndices});
    };
    //scene.clearTranscript = function(){
    //  var flush = scene.transcript.text && scene.transcript.text.length;
    //  flush && scene.agentSaid(scene.transcript.text);
    //  scene.transcript = {text: ""};
    //};
    scene.playTranscript = function(text, speed){
      scene.transcript = {text: text, speed: speed};
    };
    scene.setButtons = function(buttons){
      scene.buttons = buttons.map(function(button){
        return {
          label     : button.label,
          disabled  : button.disabled,
          secondary : button.secondary,
          onClick: function(){
            UserActionLogService.logButton(scene.sceneId, button.label)
            button.onClick();
          }
        };
      })   ;
    };
    scene.getButton = function(label){
      return scene.buttons.find(function(button){return button.label == label;});
    };
    scene.saveMultiChoiceAnswer = function(options, chosen, correctChoice){
      UserActionLogService.saveMultiChoiceAnswer(scene.sceneId, options, chosen, correctChoice);
    };
    scene.userSaid = function(text){
      game.player.chat.add.fromUser(text);
    };
    scene.agentSaid = function(text){
      game.player.chat.add.fromAgent(text);
    };
    scene.transitTo = function(state){
      game.player.transitTo(state);
    };
    scene.disable = function(){
      scene.disableState = true;
    };
    scene.confirmForExit = function(){
      scene.setButtons([{
        label: scene.nextButtonLabel || "Proceed" ,
        onClick: scene.toNextScene
      }]);
    };

    scene.getTextFor = function(indices){
      return game.player.getTextFor(indices);
    };
    scene.setButtons(scene.buttons|| []);
    scene.confirmAndProceed = scene.confirmForExit;
    return scene;
  };
}]);
},{}],72:[function(require,module,exports){
app.service("DragDropTextEditor", ['SceneLoader', function (SceneLoader) {

  var editor = {
        createFor: function(group){
          return             {
            "group"       : group,
            "name"        : "drag-drop-text",
            label         : SceneLoader["drag-drop-text"].label,
            "config"      : {
              "group"       : group,
              "phrase": {"indices": [], "text"  : ""},
              "focus": {"indices" : [], "text"  : ""},
              "transcript": {"text"    : ""},
              "options": []
            }
          };
        }
      };
  return editor;
}]);
},{}],73:[function(require,module,exports){
app.factory("DragDropTextState", ["CRGGameService", "BaseScene", "MultiDragDropTextState", function ( game, BaseScene, MultiDragDropTextState) {
  return function (config) {
    if(config.multiDropTargets){
      return MultiDragDropTextState(config);
    }
    var state = {
      transcript     : config.transcript,
      highlightPhrase: config.highlight,
      focusPhrase    : config.focus,
      dragText       : null,
      dragTarget     : null,
      dragRelations  : config.relations,
      draggingRelation   : null,
      expectedCorrectAnswers : config.expectedCorrectAnswers || config.relations.length,
      answeredCorrect : 0,
      wrongAttemptsAllowed: config.wrongAttemptsAllowed || config.wrongAttemptMessages.length || 0,
      wrongAttempts   : 0,
      draggingText   : function(relation){
                        state.draggingRelation = relation;
                       },
      droppedTextOnRelation: function(relation){
        var correctDrop = relation.droppable.indices.join() == state.draggingRelation.droppable.indices.join();
        correctDrop ? state.correctlyDroppedText(relation): state.wrongTextDropped(relation);
      },
      correctlyDroppedText: function(relation){
        var noneLeft = ++state.answeredCorrect == state.expectedCorrectAnswers;
        state.userSaid(relation.droppable.text);
        state.addHighlight(relation.droppable);
        noneLeft && state.endState(config.onFinish);
      },
      wrongTextDropped: function(relation){
        var noAttemptLeft = (++state.wrongAttempts >  state.wrongAttemptsAllowed),
            video =  config.wrongAttemptMessages[(state.wrongAttempts -1)%config.wrongAttemptMessages.length];
        if(noAttemptLeft){
          return state.endState(config.onFailure)
        }
        state.playVideo(video);
      },
      endState: function(video){
        state.disable();
        state.showResult();
        if(video){
          state.playVideo(video).then(function(){
            state.toNextScene();
          });
        }else{
          state.toNextScene();
        }
      },
      showResult: function(){
        var draggables = [].concat.apply([], config.relations.map(function(relation){
              return relation.draggable.indices;
            })),
            dropppables = [].concat.apply([], config.relations.map(function(relation){
              return relation.droppable.indices;
            })),
            endHighlights = [].concat.apply([], (config.highlightAtEnd || []).map(function(phrase){
              return phrase.indices;
            })),
            allIndices = draggables.concat(dropppables).concat(endHighlights);

        state.addHighlight({indices: allIndices})
      }
    };
    return BaseScene(state, config);
  };
}]);
},{}],74:[function(require,module,exports){
app.factory("MultiDragDropTextState", ["CRGGameService", "BaseScene", function ( game, BaseScene) {
  return function (config) {
    var
        flatten = function (array) {
          return [].concat.apply([], array);
        },
        removeDuplicates = function (phrases) {
          var map = {};
          phrases.forEach(function(phrase){
            map[phrase.indices.join()] = phrase;
          });
          return Object.values(map)
        };
    var droppablePhrases = removeDuplicates(flatten(config.relations.map(function (relation) {
      return relation.droppables;
    })));
    var state = {
      transcript     : config.transcript,
      highlightPhrase: config.highlight,
      focusPhrase    : config.focus,
      dragText       : null,
      dragTarget     : null,
      dragRelations  : config.relations,
      droppables     : droppablePhrases,
      draggingRelation   : null,
      expectedCorrectAnswers : config.expectedCorrectAnswers || config.relations.length,
      answeredCorrect : 0,
      wrongAttemptsAllowed: config.wrongAttemptsAllowed || config.wrongAttemptMessages.length || 0,
      wrongAttempts   : 0,
      draggingText   : function(relation){
                        state.draggingRelation = relation;
                       },
      droppedTextOnRelation: function(droppedAt){
        var validDroppables = state.draggingRelation.droppables,
            matchingDroppable = state.draggingRelation.droppables.filter(function(droppable){
              return droppedAt.indices.join() == droppable.indices.join();;
            }),
            correctDrop = matchingDroppable.length,
            droppable  = correctDrop ? matchingDroppable[0] : droppedAt,
            relation = {draggable: state.draggingRelation.draggable, droppable: droppable, };

        correctDrop ? state.correctlyDroppedText(relation): state.wrongTextDropped(relation);
      },
      correctlyDroppedText: function(relation){
        var noneLeft = ++state.answeredCorrect == state.expectedCorrectAnswers;
        state.userSaid(relation.droppable.text);
        state.addHighlight(relation.droppable);
        noneLeft ? state.endState(config.onFinish) : state.playVideo(relation.droppable.onSuccess);
      },
      wrongTextDropped: function(relation){
        var noAttemptLeft = (++state.wrongAttempts >  state.wrongAttemptsAllowed),
            video =  config.wrongAttemptMessages[(state.wrongAttempts -1)%config.wrongAttemptMessages.length];
        if(noAttemptLeft){
          return state.endState(config.onFailure)
        }
        state.playVideo(video);
      },
      endState: function(video){
        state.disable();
        state.showResult();
        if(video){
          state.playVideo(video).then(function(){
            state.toNextScene();
          });
        }else{
          state.toNextScene();
        }
      },
      showResult: function(){
        var draggables = [].concat.apply([], config.relations.map(function(relation){
              return relation.draggable.indices;
            })),
            dropppables = [].concat.apply([], state.droppables.map(function(phrase){
              return phrase.indices;
            })),
            endHighlights = [].concat.apply([], (config.highlightAtEnd || []).map(function(phrase){
              return phrase.indices;
            })),
            allIndices = draggables.concat(dropppables).concat(endHighlights);

        state.highlight({indices: allIndices})
      }
    };
    return BaseScene(state, config);
  };
}]);
},{}],75:[function(require,module,exports){
app.service("DragDropEditor", ['SceneLoader', function (SceneLoader) {

  var editor = {
        createFor: function(group){
          return             {
            "group"       : group,
            "name"        : "drag-drop",
            label         : SceneLoader["drag-drop"].label,
            "config"      : {
              "group"       : group,
              "phrase": {"indices": [], "text"  : ""},
              "focus": {"indices" : [], "text"  : ""},
              "transcript": {"text"    : ""},
              "options": []
            }
          };
        }
      };
  return editor;
}]);
},{}],76:[function(require,module,exports){
app.factory("DragDropState", ["CRGGameService", "BaseScene", function ( game, BaseScene) {
  return function (config) {
    var transcript = config.transcript.text || "";
    var state = {
      transcript: {text: transcript},
      highlightPhrase: config.highlight,
      focusPhrase    : config.focus,
      dropBoxes      : [
                        {
                          label: "Drag and drop your answer here",
                          onDrop: function(){
                            window.getSelection().empty();
                            setTimeout(function(){
                              alert("Got it !");
                            },500);
                          },
                        }
                      ],
      onTextSelection   : function(selectedPhrase){
        state.drag = selectedPhrase;
      }
    };
    return BaseScene(state, config);
  };
}]);
},{}],77:[function(require,module,exports){
app.factory("SceneEventService", ["EventServer", "$http", "$localStorage", function (EventServer, $http, $localStorage) {
  var SceneEventService = {
        endOfGame: function(passageId, sceneId, event){
          var url = EventServer+"/crg/passages/:passageId/scenes/:sceneId/events/end-of-scene"
              .replace(":passageId", passageId)
              .replace(":sceneId", sceneId);
          return $http.post(url, {event: event});
        },
      feedbackReceived: function(passageId, feedback){
        var url = EventServer+"/crg/passages/:passageId/feedback/:clientId"
                .replace(":passageId", passageId)
                .replace(":clientId", $localStorage.user.email);
        return $http.post(url, {feedback: feedback});
      }
    };

  return SceneEventService;
}]);
},{}],78:[function(require,module,exports){
app.factory("ExitGameState", ["BaseScene", function (BaseScene) {
  return function (config) {
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

    return BaseScene(state, config);
  };
}]);
},{}],79:[function(require,module,exports){
app.service("FindPhraseSceneEditor", ['SceneLoader', function (SceneLoader) {

  var findPhraseEditor = {
        createFor: function(group){
          return             {
            "group"       : group,
            "name"        : "find-phrase",
            label         : SceneLoader["find-phrase"].label,
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
},{}],80:[function(require,module,exports){
app.factory("FindPhrase", ["BaseScene", function ( BaseScene) {

  var phraseId = function(phrase){
        return phrase.indices.join("-");
      },
      optionId = function (options) {
        var indexed = {};
        options.forEach(function (option) {
          indexed[phraseId(option.phrase)] = option;
        });
        return indexed;
      },
      MIN_SELECTION_DISTANCE = 0.66,
      selectionDistance = function(selection, expectedPhrase){
        var common = selection.indices.filter(function(index){
          return expectedPhrase.indices.indexOf(parseInt(index)) > -1;
        });
        return common;
      },
      findCloseMatch = function(selected, options, min_match){
        var match = null;
        options.forEach(function(option){
          var commonChars = selectionDistance(selected, option.phrase),
              matches     = commonChars.length/option.phrase.indices.length > min_match;
          match = matches ? option : match;
        });
        return match;
      };
  return function (config) {
    var state = {
      highlightPhrase     : config.highlight,
      focusPhrase         : config.focus,
      selectingText       : true,
      disabledSelection   : false,
      correctOptions      : optionId(config.correctOptions),
      partialCorrectOptions: optionId(config.partialCorrectOptions),
      wrongAttempts        : 0,
      expectedCorrectAnswers     :  config.expectedCorrectAnswers || config.correctOptions.length,
      onTextSelection   : function(selectedPhrase){
        !state.disabledSelection && (state.selectingText = true);
      },
      submitTextSelection: function(selectedPhrase){
        var correctOption         = state.correctOptions[phraseId(selectedPhrase)],
            partialCorrectOption  = state.partialCorrectOptions[phraseId(selectedPhrase)],
            closeMatch             = (correctOption || partialCorrectOption) ? null : findCloseMatch(selectedPhrase, config.correctOptions, MIN_SELECTION_DISTANCE);
        state.selectingText = false;
        if(!!correctOption){
          state.onCorrectSelection(correctOption);
        } else if(!!partialCorrectOption){
          state.onPartialCorrectSelection(partialCorrectOption);
        } else if(closeMatch){
          state.onCorrectSelection(closeMatch);
        }else{
          state.onWrongAttempt(selectedPhrase);
        }
      },
      onCorrectSelection: function(selection){
        state.expectedCorrectAnswers--;
        state.highlight({indices: state.highlightPhrase.indices.concat(selection.phrase.indices)});
        state.userSaid(selection.phrase.text);
        if(!state.expectedCorrectAnswers) {
          state.buttons = [];
          state.disabledSelection = true;
        }
        state.playVideo(selection.successVideo).then(function(){
          if(!state.expectedCorrectAnswers) {
            state.allCorrectSelected(!config.skipAllSelectionOnSuccess);
          }
        });
      },
      allCorrectSelected: function(showAllVideo){
        state.showAllCorrect();
        if(showAllVideo){
          state.playVideo(config.showAllSelectionsVideo).then(function(){
            state.endGame();
          });
        }else{
          state.endGame();
        }
      },
      showAllCorrect: function(){
        var correctOptionIndices = config.correctOptions.map(function(option){
          return option.phrase.indices;
        });
        config.highlight && correctOptionIndices.push(config.highlight.indices);
        state.highlight({indices: [].concat.apply([], correctOptionIndices)});
      },
      endGame: function(){
        state.buttons = [{
          label: "Proceed",
          onClick : function(){
            state.toNextScene();
          }
        }];
      },
      onPartialCorrectSelection: function(option){
        state.userSaid(option.phrase.text);
        state.playVideo(option.successVideo);
      },
      onWrongAttempt: function(phrase){
        var video = config.wrongAttemptMessages[Math.abs(config.wrongAttemptMessages.length - (state.wrongAttempts++))%config.wrongAttemptMessages.length],
            noAttemptsLeft = state.wrongAttempts > config.wrongAttemptsAllowed;
        if(noAttemptsLeft){
          state.allCorrectSelected(true);
        }else{
          state.playVideo(video).then(function(){});
        }
      },
      buttons: [{
        label: "Help",
        onClick: function(){
          state.showTextSelectionHelp = true;
        }
      }]
    };
    return BaseScene(state, config);
  };
}]);
},{}],81:[function(require,module,exports){
app.factory("GenericSceneState", ["BaseScene", "DragDropTextElement", "FindPhraseElement", "SceneSlideElement", "PollResultElement", "MultiChoiceElement","CodeEditorElement", "CodeChallengeElement", function ( BaseScene, DragDropTextElement, FindPhraseElement, SceneSlideElement, PollResultElement, MultiChoiceElement, CodeEditorElement, CodeChallengeElement) {
  return function(config){

    var state = {
      sceneId        : config.sceneId,
      highlightPhrase: config.highlight,
      focusPhrase    : config.focus,
      showQuotes     : config.showQuotes,
      video          : config.sceneLoadVideo,
      setCodingChallenge: function(config, params){
        state.codingChallenge = CodeChallengeElement(state, config, params);
      },

      codeEditors    : {
        codeEditor : null,
        running     : function(){
          state.codeEditors.status = "running";
        },
        afterRun    : function(result){
          state.codeEditors.errors = result.errorMessages;
          state.codeEditors.status = result.error ? "error" : "success";
        },
        add        : function(config, options){
          state.codeEditors.codeEditor =  CodeEditorElement(state, config, options)
        },
        respondTo  : function(result, options){
          state.codeEditors.codeEditor.respondTo(result);
        }
      },
      skip: {
        onClick: function(){
          state.toNextScene();
        }
      },
      message        : !config.message ?  undefined : {
        text: config.message.text,
        button: {
          label: config.message.button.label,
          onClick: function(){
            state.userSaid(config.message.button.label);
            state.toNextScene()
          }
        }
      },
      multiInputSubmitted: function(){
        var
            notSubmitted = function (input) {
              return !input.submitted
            },
            allSubmitted = !state.multiInput.filter(notSubmitted).length;
        if(allSubmitted) {
          state.toNextScene();
        }
      },
      multiInput: (config.multiInput || []).map(function(inlineInput){
        var multiInputItem = {
          label       : inlineInput.label,
          value       : inlineInput.value,
          buttonLabel : inlineInput.buttonLabel,
          disabled    : false,
          submit      : function (value) {
            multiInputItem.submitted = true;
            multiInputItem.disabled = true;
            state.multiInputSubmitted();
          }
        };
        return multiInputItem
      }),
      buttons        : (config.buttons || []).map(function(button){
        return {
          label: button.label,
          onClick : function(){
            state.userSaid(button.label);
            state.toNextScene();
          }
        }
      }),
      showInput   : config.showInput,
      submitInput : function (userInput) {
        state.toNextScene();
      },
    };
    state.dragDropText = config.dragDropText ? DragDropTextElement(state, config.dragDropText) : null;
    state.findPhrase   = config.findPhrase   ? FindPhraseElement(state  , config.findPhrase)   : null;
    state.slide        = config.slide        ? SceneSlideElement(state  , config.slide)        : null;
    state.pollResult   = config.pollResult   ? PollResultElement(state  , config.pollResult)   : null;
    state.multiChoice  = config.multiChoice  ? MultiChoiceElement(state  , config.multiChoice) : null;

    return BaseScene(state, config);
  };
}]);
},{}],82:[function(require,module,exports){
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
},{}],83:[function(require,module,exports){
app.factory("AskMultiChoiceQuestion", ["MultiChoiceResult", "BaseScene", "SceneSlideElement", function (MultiChoiceResult, BaseScene, SceneSlideElement) {
  return function (config) {
    var selectedByUser = function (option) {
          return option.selected;
        },
        optionText = function(option){
          return option.label;
        };
    var state = {
      showInput: false,
      noOfSelectionsAllowed : config.noOfSelectionsAllowed || 1,
      selections : [],
      setOption  : function(chosen){
        var replaceSelectionIf = state.selections.length >= state.noOfSelectionsAllowed;
        replaceSelectionIf && state.selections.shift();
        state.selections.push(chosen);
        state._resetSelections();
      },
      _resetSelections: function(){
        state.buttons[0].disabled = !state.selections.length;
        angular.forEach(state.options, function(option){
          option.selected = (state.selections.indexOf(option) > -1);
        })
      },
      buttons: [
        {
          label: 'Submit',
          disabled: true,
          onClick: function () {
            var selectedOptions = state.options.filter(selectedByUser).map(optionText).join(", ").replace(new RegExp(',$'), '');
            state.userSaid(selectedOptions);

            var answer = state.options.filter(selectedByUser)[0];
            state.saveMultiChoiceAnswer(state.options, answer.label, answer.correct);

            if (config.correctMessage) {
              state.transitTo(MultiChoiceResult(config, state.options));
            } else {
              state.toNextScene();
            }
          }
        }],
      options: config.options.map(function(usage){
        return {
          label   : usage.label,
          correct : usage.correct,
          selected: false,
        }
      }),
      highlightPhrase: config.highlight,
      focusPhrase    : config.focus,
    };
    state.slide        = config.slide        ? SceneSlideElement(state  , config.slide)        : null;
    return BaseScene(state, config);
  };
}]);
},{}],84:[function(require,module,exports){
app.factory("MultiChoiceResult", ["BaseScene", function ( BaseScene) {
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
            state.agentSaid(message);
            state.toNextScene();
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
},{}],85:[function(require,module,exports){
app.factory("PauseAndReadState", ["BaseScene", function ( BaseScene) {

  return function (config) {

    var
        getTime = function(){return (new Date()).getTime();},
        timeForAction = config.waitForAction.timeToWait*1000,
        askToWaitVideo = config.waitForAction.beforeTimeVideo,
        state = {
          afterVideo: function () {
            state.setButtons([{
              label: config.nextButtonLabel,
              onClick: function () {
                var timePassed = (getTime() - state._videoEndedAt),
                    shouldWait = timeForAction > timePassed;
                  state.userSaid(config.nextButtonLabel);
                if (shouldWait) {
                  state.playVideo(askToWaitVideo);
                } else {
                  state.toNextScene();
                }
              }
            }]);
          },
          buttons: []
        };

    return BaseScene(state, config);
  };
}]);
},{}],86:[function(require,module,exports){
app.service("PlayVideoEditor", ['SceneLoader', function (SceneLoader) {

  var editor = {
        createFor: function(group){
          return             {
            "group"       : group,
            "name"        : "play-video",
            label         : SceneLoader["play-video"].label,
            "config"      : {
              "group"     : group,
              "canSkip"   :  true,
              "autoNext"  :  true,
              "sceneLoadVideo" : {
                "fullscreen" : false,
                "url"        : "",
                "type"       : "video/mp4",
                "transcript" : ""
              }
            }
          };
        }
      };
  return editor;
}]);
},{}],87:[function(require,module,exports){
app.factory("PlayVideoState", ["BaseScene",  "SceneSlideElement", function (BaseScene, SceneSlideElement) {
  return function (config) {
    var
        state = {
          highlightPhrase: config.highlight,
          focusPhrase    : config.focus,
          afterVideo: function () {
            config.autoNext ? state.toNextScene() : state.setButtons([{
                label: config.nextButtonLabel || 'Proceed',
                onClick: function(){
                  state.toNextScene();
                }}]);
          },
          skip: {
            onClick: function(){
              state.agentSaid(config.sceneLoadVideo.transcript);
              state.toNextScene();
            }
          }
        };
    state.slide = config.slide ? SceneSlideElement(state, config.slide) : null;
    return BaseScene(state, config);
  };
}]);
},{}],88:[function(require,module,exports){
app.service("PollResultEditor", ['SceneLoader', function (SceneLoader) {

  var editor = {
        createFor: function(group){
          return             {
            "group"       : group,
            "name"        : "poll-result",
            label         : SceneLoader["poll-result"].label,
            "config"      : {
              "group"       : group,
              "phrase": {"indices": [], "text"  : ""},
              "focus": {"indices" : [], "text"  : ""},
              "transcript": {"text"    : ""},
            }
          };
        }
      };
  return editor;
}]);
},{}],89:[function(require,module,exports){
app.factory("PollResultState", ["BaseScene", function (BaseScene) {
  return function (config) {
    var resultSummary = function () {
          return +config.pollResult.map(function (result) {
            return "<label>(<score>%)".replace("<label>", result.label).replace("<score>", result.score);
          }).join(", ");
        },
        associationFor = function(value){
          return function(association){
            return association.value.toLowerCase() == value.toLowerCase();
          };
        },
        addLabel= function(association){
          return {
            label: association.value,
            score: association.score
          }
        };
    var transcript = resultSummary();
    var state = {
      showPoll        : true,
      highlightPhrase : config.highlight,
      focusPhrase     : config.focus,
      pollResult      : [],
      showInput       : config.showInput,
      buttons         : [],
      pollAttempts    : new Array(config.attemptsAllowed),
      attempts        : 0,
      closePolling    : false,
      pollInputValue  : "",
      wrongAttempts   : 0,
      correctAttempts : 0,
      inputFixed      : true,
      hideSubgroupIndicator: true,
      submitInput     : function(value){
        state.showInput = false;
        state.submitPollInput(value);
      },
      submitPollInput: function(value){
        var association = config.pollResult.find(associationFor(value)),
            action = association ? state.goodGuess(association) : state.badGuess(value);
        state.pollInputValue = "";
        if(++state.attempts == config.attemptsAllowed){
          state.closePolling = true;
          action.then(state.endPoll);
        }
      },
      multiInput: (config.multiInput || []).map(function(inlineInput){
        var multiInputItem = {
          label       : inlineInput.label,
          value       : inlineInput.value,
          buttonLabel : inlineInput.buttonLabel,
          disabled    : false,
          submit      : function (value) {
            multiInputItem.submitted = true;
            multiInputItem.disabled = true;
            state.submitPollInput(value);
          }
        };
        return multiInputItem
      }),
      goodGuess: function(association){
        state.pollResult.push({
          label: association.value,
          score: association.score,
          success : true,
        });
        state.pollAttempts[state.attempts] = {success: true};
        return state.playVideo(state.nextCorrectAttemptMessage());
      },
      badGuess: function(value){
        state.pollResult.push({
          label: value,
          score: 0,
          success : false,
        });
        state.pollAttempts[state.attempts] = {failed: true};
        return state.playVideo(state.nextWrongAttemptMessage());
      },
      nextWrongAttemptMessage: function(){
        return config.wrongAttemptMessages[(state.wrongAttempts++)];
      },
      nextCorrectAttemptMessage: function(){
        return config.correctAttemptMessages[(state.correctAttempts++)];
      },
      endPoll: function(){
        state.pollClosed = true;
        state.pollResult  = config.pollResult.map(addLabel).slice(0, config.topPollResultCount);
        state.playVideo(config.sceneFinishVideo).then(function(){
          state.setButtons([
            {
              label  : "Proceed",
              onClick: function(){
                state.toNextScene();
              }
            }
          ]);
        });
      }
    };
    return BaseScene(state, config);
  };
}]);
},{}],90:[function(require,module,exports){
app.controller("SceneEditorController", ['$scope','$injector', 'MultiChoiceEditor', 'SceneLoader', function ($scope, $injector, MultiChoiceEditor, SceneLoader) {

  var sceneConfigs = [];
  for(var scene in SceneLoader){
    var config = SceneLoader[scene];
    if(config.editor){
      sceneConfigs.push({
        name: scene,
        entry: config.entry,
        label: config.label,
        editor: $injector.get(config.editor),
      });
    }
  }

  $scope.sceneConfigs = sceneConfigs;
  $scope.sceneEditors  = {
    multiChoice: MultiChoiceEditor
  };
}]);
},{}],91:[function(require,module,exports){
require('./coding-challenge/code-editor');
require('./components/ruby-readonly-editor');
require('./components/ruby-editor');
require('./components/ace-editor-service');
require('./components/game-attempts');
require('./components/code-editor-element');
require('./components/drag-drop-text-element');
require('./components/code-runner-service');
require('./components/phrase');
require('./components/find-phrase-scene-element');
require('./components/slide/slide-section-element');
require('./components/slide/slide-bullet-element');
require('./components/slide/slide-words-indexer');
require('./components/scene-slide-element');
require('./components/poll-result-scene-element');
require('./components/multi-choice-element');

require('./scene-editor-controller');
require('./crg-base-scene');
require('./components/set-focus-directive');
require('./components/set-highlight-directive');
require('./components/set-key-image-directive');

require('./exit/states/exit-game-state');

require('./generic-scene/generic-scene-state');

require('./text-input/text-input-editor');
require('./text-input/states/text-input-state');

require('./drag-and-drop/drag-and-drop-editor');
require('./drag-and-drop/states/drag-drop-state');

require('./drag-and-drop-on-text/drag-and-drop-text-editor');
require('./drag-and-drop-on-text/states/drag-and-drop-text-state');
require('./drag-and-drop-on-text/states/multi-drag-and-drop-text-state');

require('./yes-no-choice/states/ask-question');
require('./yes-no-choice/states/wrong-answer');
require('./yes-no-choice/yes-no-editor');

require('./multi-choice/multi-choice-editor');
require('./multi-choice/states/ask-multi-choice-question-state');
require('./multi-choice/states/multi-choice-result-state');


require('./find-phrase/states/find-phrase-state');
require('./find-phrase/find-phrase-editor');

require('./poll-result/states/poll-result-state');
require('./poll-result/poll-result-editor');

require('./play-video/play-video-state');
require('./play-video/play-video-editor');

require('./pause-and-read/reading-text-state');
require('./events/crg-scene-event-service');

},{"./coding-challenge/code-editor":49,"./components/ace-editor-service":53,"./components/code-editor-element":54,"./components/code-runner-service":55,"./components/drag-drop-text-element":56,"./components/find-phrase-scene-element":57,"./components/game-attempts":58,"./components/multi-choice-element":59,"./components/phrase":60,"./components/poll-result-scene-element":61,"./components/ruby-editor":62,"./components/ruby-readonly-editor":63,"./components/scene-slide-element":64,"./components/set-focus-directive":65,"./components/set-highlight-directive":66,"./components/set-key-image-directive":67,"./components/slide/slide-bullet-element":68,"./components/slide/slide-section-element":69,"./components/slide/slide-words-indexer":70,"./crg-base-scene":71,"./drag-and-drop-on-text/drag-and-drop-text-editor":72,"./drag-and-drop-on-text/states/drag-and-drop-text-state":73,"./drag-and-drop-on-text/states/multi-drag-and-drop-text-state":74,"./drag-and-drop/drag-and-drop-editor":75,"./drag-and-drop/states/drag-drop-state":76,"./events/crg-scene-event-service":77,"./exit/states/exit-game-state":78,"./find-phrase/find-phrase-editor":79,"./find-phrase/states/find-phrase-state":80,"./generic-scene/generic-scene-state":81,"./multi-choice/multi-choice-editor":82,"./multi-choice/states/ask-multi-choice-question-state":83,"./multi-choice/states/multi-choice-result-state":84,"./pause-and-read/reading-text-state":85,"./play-video/play-video-editor":86,"./play-video/play-video-state":87,"./poll-result/poll-result-editor":88,"./poll-result/states/poll-result-state":89,"./scene-editor-controller":90,"./text-input/states/text-input-state":92,"./text-input/text-input-editor":93,"./yes-no-choice/states/ask-question":94,"./yes-no-choice/states/wrong-answer":95,"./yes-no-choice/yes-no-editor":96}],92:[function(require,module,exports){
app.factory("TextInputState", ["BaseScene", function (BaseScene) {
  return function (config) {
    var state = {
      highlightPhrase: config.highlight,
      focusPhrase    : config.focus,
      showInput      : true,
      submitInput: function (userInput) {
        state.userSaid(userInput);
        state.toNextScene();
      }
    };
    return BaseScene(state, config);
  };
}]);
},{}],93:[function(require,module,exports){
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
},{}],94:[function(require,module,exports){
app.factory("AskQuestion", ['WrongAnswerToYesNo',  'BaseScene', function ( WrongAnswerToYesNo, BaseScene) {
  return function (config) {
    var
        onCorrectAnswer = function(answer){
          state.setButtons([]);
          state.playVideo(config.correctAnswerMessageVideo).then(function(){
            state.toNextScene();
          });
        },
        onWrongAnswer = function(){
          state.transitTo(WrongAnswerToYesNo(config));
        },
        state = {
          showInput: false,
          buttons: [
            {
              label: 'Yes',
              onClick: function(){
                state.userSaid("Yes");
                config.expectedYes ? onCorrectAnswer("Yes") : onWrongAnswer();
              }
            },
            {
              label: 'No',
              onClick: function(){
                state.userSaid("No");
                config.expectedYes ?  onWrongAnswer("No") : onCorrectAnswer();
              }
            }
          ],
          highlightPhrase   : config.highlight,
          focusPhrase       : config.focus
    };
    return BaseScene(state, config);
  };
}]);
},{}],95:[function(require,module,exports){
app.factory("WrongAnswerToYesNo", ["CRGGameService", "BaseScene", function ( game, BaseScene) {
  return function (config) {
    var state = {
      buttons: [],
      transcript: {text: config.wrongAnswerMessageVideo.transcript},
      highlightPhrase: config.highlight,
      focusPhrase    : config.focus,
      afterVideo: function(){
        game.player.toNextScene();
      }
    };
    return BaseScene(state, {
      group: config.group,
      subgroup: config.subgroup,
      sceneLoadVideo: config.wrongAnswerMessageVideo
    });
  };
}]);
},{}],96:[function(require,module,exports){
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
},{}],97:[function(require,module,exports){
app.value("SkillVideos", {
  "zincing"   : {
    undefined   : {
      "url"       : "http://res.cloudinary.com/zinc-learning-labs/video/upload/v1506589369/assets/crg-demo/skill-videos/sophia/a._zincing.mp4",
      "type"      : "video/mp4",
      "transcript": "What makes reading so compelling for people who love it and so, uh… BORING for people who don’t? Reading is different from other media. Video puts images directly into our brains through our eyes. But when we read, there’s an extra step. Our brains turn the letters, words and sentences into pictures and meanings. We call that ZINCING—ZINCING is when the words turn into meanings in your head. The process of Zincing—or turning great writing into images and meanings in the brain—FEELS GOOD. If you’re NOT Zincing, the text might as well be a solid rock wall. When that happens, finding words you can picture is like finding handholds that let you climb the wall."
    },
    "visualize": {
      "url": "http://res.cloudinary.com/zinc-learning-labs/video/upload/v1506589333/assets/crg-demo/skill-videos/sophia/a.1._zinc-visualize.mov",
      "type": "video/mp4",
      "transcript": "Your first Zincing move is always to look for words or phrases you can easily picture in your mind. Good writers give you stuff you can visualize. No matter how hard a text is, you can always start by finding something to visualize."
    },
    "key-images": {
      "url"       : "http://res.cloudinary.com/zinc-learning-labs/video/upload/v1506589353/assets/crg-demo/skill-videos/sophia/a.2._key-images.mp4",
      "type"      : "video/mp4",
      "transcript": "Great writing uses key images to let you understand the writer’s point on a deeper level. If you tune them in, that’s when you’re really getting it. As you’re reading, keep looking for the STRONGEST IMAGES. Your insights about these KEY IMAGES make the text come to life and give you your deepest understanding."
    },
    "imagine": {
      "url": "http://res.cloudinary.com/zinc-learning-labs/video/upload/v1506589336/assets/crg-demo/skill-videos/sophia/a.3._imagine.mov",
      "type": "video/mp4",
      "transcript": "Sometimes a writer mentions something without giving a specific visual: “She was competitive and clever.” What does that look like? You’ll probably get a clearer picture about that character as you read on, but, to understand what you’re reading, use your imagination. Don’t make up crazy stuff. “Competitive and clever” does not mean the character is a secret agent. Come up with something that makes sense and keep reading to find out more."
    }
  },
  "navigators": {
    undefined : {
      "url"       : "http://res.cloudinary.com/zinc-learning-labs/video/upload/v1506589340/assets/crg-demo/skill-videos/sophia/b._navigators.mov",
      "type"      : "video/mp4",
      "transcript": "When you’re driving, everything from stop lights to brake lights to the paint on the street tells you how to navigate. Ignoring these could cause a dangerous crash. No one gets physically hurt when you miss navigation signals in a text, but your comprehension gets run over."
    },
    "road-signs" : {
      "url": "http://res.cloudinary.com/zinc-learning-labs/video/upload/v1506589333/assets/crg-demo/skill-videos/sophia/b.1_roadsigns.mov",
      "type": "video/mp4",
      "transcript": "Words like, however, because, although, also, in addition—these words act like ROAD SIGNS. They direct your reading or call out a shift. Usually, they’re either saying, “Keep going” or “Go in a new direction."
    },
    "pronouns" : {
      "url": "http://res.cloudinary.com/zinc-learning-labs/video/upload/v1506589333/assets/crg-demo/skill-videos/sophia/b.2_pronouns.mov",
      "type": "video/mp4",
      "transcript": "Pronouns are those words like “he,” “she,” “it,” “this,” “which,” “those”—they’re words that represent something that’s just been mentioned or is about to be mentioned. Whenever you see a pronoun, you have to connect it to the word or phrase it represents."
    },
    "explainers" : {
      "url": "http://res.cloudinary.com/zinc-learning-labs/video/upload/v1506589359/assets/crg-demo/skill-videos/sophia/b.%203explainer.mp4",
      "type": "video/mp4",
      "transcript": "A big part of what writers do is explain. They say something—maybe something that’s hard to understand—and then they explain by adding details, giving examples or about a million other things that help you get what they mean."
    }
  }
});
},{}],98:[function(require,module,exports){
app.config(["$stateProvider", "$urlRouterProvider", "$locationProvider",function($stateProvider, $urlRouterProvider, $locationProvider){

	$urlRouterProvider.otherwise('/crg/play/ruby-for-qa');
	$stateProvider
			.state('crg', {
				url: '/crg',
				templateUrl: 'assets/templates/crg-template.html'
			})
      .state('crg-home', {
				url: '/crg-home',
				templateUrl: 'assets/templates/crg-home-template.html'
			})
      .state('reports', {
				url: '/reports',
        controller: 'CRGReportsController',
        templateUrl: 'assets/templates/crg-reports-template.html'
			})
      .state('reports.passages', {
				url: '/passages/:id',
        controller: 'CRGPassageReportController',
        templateUrl: 'assets/templates/crg-passage-report-template.html',
        resolve : {
          passage: ['CRGDataService','$stateParams', function(CRGDataService,  $stateParams){
            return CRGDataService.getGame($stateParams.id).then(function(gameData){
              return gameData.passage;
            });
          }],
          passageReport: ['CRGReportsService','$stateParams', function(CRGReportsService,  $stateParams){
            return CRGReportsService.byPassageId($stateParams.id);
          }]
        }
      })
      .state('crg-demo', {
				url: '/crg-demo',
				templateUrl: 'assets/templates/crg-demo-template.html'
			})
      .state('scene-editor', {
				url: '/scene-editor',
				templateUrl: 'assets/templates/crg-scene-editor-template.html',
        controller: "SceneEditorController"
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
      .state('crg.gameplay.scene', {
				url: '/scenes?select"',
				templateUrl: 'assets/templates/crg-gameplay-template.html',
        controller: 'CRGameplayController',
        resolve : {
          gamePlan: ['CRGDataService', 'CRGPlayer', 'CRGGameService','ExitGameState', '$stateParams', function(CRGDataService, CRGPlayer,game, ExitGameState, $stateParams){
            return CRGDataService.getGame($stateParams.id).then(function(gameData){
              var selectedSceneIds = $stateParams.select.split(",");
              gameData.script.scenes = gameData.script.scenes.filter(function (scene) {
                return selectedSceneIds.indexOf(scene.config.sceneId) > -1;
              });
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

},{}],99:[function(require,module,exports){
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

app.value("TYPING_SPEED", 100);

app.value("SceneLoader", {
  "pause-and-read" :{
    entry: "PauseAndReadState",
    label: "Pause and Read",
    editor: "PlayVideoEditor"
  },
  "generic-scene" :{
    entry: "GenericSceneState",
    label: "Generic Scene",
    editor: "PlayVideoEditor"
  },
  "play-video"                 :{
    entry: "PlayVideoState",
    label: "Play Video",
    editor: "PlayVideoEditor",
  },
  "text-input"            :{
    entry: "TextInputState",
    label: "Input Text",
    editor: "TextInputEditor",
  },
  "drag-drop"            :{
    entry: "DragDropState",
    label: "Drag and Drop To Box",
    editor: "DragDropEditor",
  },
  "drag-drop-text"            :{
    entry: "DragDropTextState",
    label: "Drag and Drop To Text",
    editor: "DragDropTextEditor",
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
  "find-phrase"   :{
    entry: "FindPhrase",
    label: "Find Phrase",
    editor: "FindPhraseSceneEditor"
  },
  "poll-result"   :{
    entry: "PollResultState",
    label: "Poll Result",
    editor: "PollResultEditor"
  },
  "exit"                  : {
    entry: "ExitGameState",
    label: "Exit"
  }
});

app.value("SceneGroups", {
  "intro": {
    label: "Main Idea",
    subgroups: []
  },
  "zincing": {
    label: "Zincing",
    subgroups: [
      {id: "visualize"  , label:"Visualise"},
      {id: "key-images" , label:"Key Images"},
      {id: "imagine"    , label:"Imagine"}
    ]
  },
  "navigators": {
    label: "Navigators",
    subgroups: [
      {id: "road-signs"  , label:"Road Signs"},
      {id: "pronouns"    , label:"Pronouns"},
      {id: "explainers" , label:"Explainers"}
    ]
  },
  "tone": {
    label: "Tone",
    subgroups: [{id: "contrast"  , label:"Contrast"}]
  },
  "exit": {
    label: "Main Idea",
    subgroups: []
  }
})
},{}],100:[function(require,module,exports){
require("./app/app");
require("./app/variables");
require("./app/config");
require("./app/routes");
require("./app/components/viewport-safari-fix");
require("./app/components/forms/drop-down");
require("./app/components/throttle");
require("./app/components/state-loader/state-loader");
require("./app/components/typewriter/typewriter");
require("./app/components/feedback/feedback");
require("./app/components/typewriter/hard-typewriter");
require("./app/components/google-login/google-login");
require("./app/components/login-page/login-controller");

require("./app/crg/crg");
},{"./app/app":1,"./app/components/feedback/feedback":4,"./app/components/forms/drop-down":5,"./app/components/google-login/google-login":6,"./app/components/login-page/login-controller":7,"./app/components/state-loader/state-loader":8,"./app/components/throttle":9,"./app/components/typewriter/hard-typewriter":10,"./app/components/typewriter/typewriter":11,"./app/components/viewport-safari-fix":12,"./app/config":13,"./app/crg/crg":23,"./app/routes":98,"./app/variables":99}]},{},[100]);
