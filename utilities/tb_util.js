//
// Need to share the demo workspace between functions.
//
let DemoWorkspace = null

//
// Create function to synchronously parse CSV to JSON
// Convert JSON to TidyBlocksDataFrame object
//

function readCSV (url) {
  const request = new XMLHttpRequest()
  request.open('GET', url, false)
  request.send(null)
  if (request.status !== 200) {
    console.log(`ERROR: ${request.status}`)
    return null
  }
  else {
    const result = Papa.parse(request.responseText, {
      header: true
    })
    return new TidyBlocksDataFrame(result.data)
  }
}

// 
// Create dynamic table from array from JSON.
// One table column per property (each object has the same properties).
//

function json2table (json) {
  // get key names and set as column headers
  const cols = Object.keys(json[0])

  // create column headers from col
  let headerRow = ''
  cols.forEach(col => {
    headerRow += `<th>${col}</th>`
  })

  // build the rows
  let bodyRows = ''
  json.forEach(row => {
    bodyRows += '<tr>'
    cols.forEach(colName => {
      bodyRows += `<td>${row[colName]}</td>`
    })
    bodyRows += '</tr>'
  })

  return `<table><thead><tr>${headerRow}</tr></thead><tbody>${bodyRows}</tbody></table>`
}

//
// Set the display property of the two input panes.
//
function initializeDisplay () {
  for (let [nodeId, state] of [
    ['codeOutput', 'none'],
    ['blockDisplay', 'block']]) {
    document.getElementById(nodeId).style.display = state
  }
}

//
// Toggle between block input and text input panes.
//
function blockToText () {
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

//
// Set up Blockly display.
//
function setUpBlockly () {
  blocklyDiv = document.getElementById('blockDisplay')
  DemoWorkspace = Blockly.inject(
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
function runCode () {
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null
  const code = Blockly.JavaScript.workspaceToCode(DemoWorkspace)
  if (code.includes('vega')) {
    splitdf = code.split('SPLIT', 2)
    const dfArray = eval(splitdf[0]).toArray()
    eval(splitdf[1])
  }
  else {
    dfArray = eval(code).toArray()
    document.getElementById('dataOutput').innerHTML = json2table(dfArray)
  }
}

//
// Setup after DOM has initialized.
//
document.addEventListener('DOMContentLoaded', (event) => {
  initializeDisplay()
  setUpBlockly()
})
