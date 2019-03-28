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
  //"find-all-key-images"   :{
  //  entry: "FindAllKeyImages",
  //  label: "Find Phrase",
  //  editor: "FindPhraseEditor"
  //},
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
      {id: "imagine"    , label:"Imagine"},
      {id: "key-images" , label:"Key Images"}
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
  "exit": {
    label: "Main Idea",
    subgroups: []
  }
})