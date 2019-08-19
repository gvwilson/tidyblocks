/**
 * Share the demo workspace between functions.
 */
let DemoWorkspace = null

/**
 * Set the display property of the two input toggleable panes.
 * (Has to be done manually rather than in CSS because properties are being reset.)
 */
const initializeDisplay = () => {
  for (let [nodeId, state] of [
    ['codeOutput', 'none'],
    ['blockDisplay', 'block']]) {
    document.getElementById(nodeId).style.display = state
  }
}

/**
 * Toggle between block input and text input panes.
 */
const generateCodePane = () => {
  for (let nodeId of ['codeOutput', 'blockDisplay']) {
    const node = document.getElementById(nodeId)
    if (node.style.display === 'none') {
      node.style.display = 'block'
    }
    else {
      node.style.display = 'none'
    }
  }
}

/**
 * Show the text based code corresponding to selected blocks.
 */
const showCode = () => {
  const code = Blockly.JavaScript.workspaceToCode(DemoWorkspace)
  document.getElementById('codeOutput').innerHTML = code
}

/**
 * Set up Blockly display by injecting XML data into blockDisplay div.
 * As a side effect, sets the global DemoWorkspace variable for later use.
 */
const setUpBlockly = () => {
  DemoWorkspace = Blockly.inject(
    document.getElementById('blockDisplay'),
    {
      media: 'media/',
      toolbox: document.getElementById('toolbox'),
      horizontalLayout: false,
      scrollbars: false, 
      theme: Blockly.Themes.Tidy
    }
  )
}

/**
 * Run the code generated from the user's blocks.
 * Depends on the global DemoWorkspace variable.
 */
function runCode () {
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null
  const code = Blockly.JavaScript.workspaceToCode(DemoWorkspace)
  const result = eval(code).toArray()
  document.getElementById('dataOutput').innerHTML = json2table(result)
}
