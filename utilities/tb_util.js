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
// Run the code corresponding to the user's blocks.
//
function runCode() {
  console.log(`I'm in your code and running it.`) // FIXME
}

//
// Set up Blockly display.
//
function setUpBlockly() {
  const blocklyDiv = document.getElementById('blockDisplay')
  const demoWorkspace = Blockly.inject(
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
// Setup after DOM has initialized.
//
document.addEventListener("DOMContentLoaded", (event) => {
  initializeDisplay()
  setUpBlockly()
})
