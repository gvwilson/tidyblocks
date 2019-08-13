//
// Set the display property of the two input panes.
//
function initializeDisplay() {
  for (let [nodeId, state] of [['codeOutput', 'none'],
                               ['blockDisplay', 'block']]) {
    document.getElementById(nodeId).style.display = state
  }
}

//
// Toggle between block input and text input panes.
//
function blockToText() {
  for (let nodeId of ['codeOutput', 'blockDisplay']) {
    const node = document.getElementById(nodeId)
    if (node.style.display === 'none') {
      node.style.display = 'block'
    } else {
      node.style.display = 'none'
    }
  }
}

//
// Set up Blockly display.
//
let blocklyDiv = null
let demoWorkspace = null

function setUpBlockly() {
  blocklyDiv = document.getElementById('blockDisplay')
  demoWorkspace = Blockly.inject(
    blocklyDiv,
    {
      media: 'media/',
      toolbox: document.getElementById('toolbox'),
      horizontalLayout: false,
      scrollbars: false, 
      theme: Blockly.Themes.Tidy
    }
  )
}

//
// Run the code corresponding to the user's blocks.
//

function runCode() {
  // run code and show in field
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  var code = Blockly.JavaScript.workspaceToCode(demoWorkspace);
  if (code.includes("vega")) {
    console.log(code)
    splitdf = code.split("SPLIT", 2)
    console.log(splitdf)
    const dfArray = eval(splitdf[0]).toArray()
    console.log(dfArray)
    eval(splitdf[1])
  } else {
    console.log(code)
    dfArray = eval(code).toArray()
    document.getElementById('dataTableOutput').innerHTML = json2table(dfArray);
  }
  
}

//
// Setup after DOM has initialized.
//
document.addEventListener("DOMContentLoaded", (event) => {
  initializeDisplay()
  setUpBlockly()
})
