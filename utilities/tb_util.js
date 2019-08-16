/**
 * Share the demo workspace between functions.
 */
let DemoWorkspace = null

/**
 * Read CSV from a URL and parse to create TidyBlocks data frame.
 * @param {string} url - URL to read from.
 */
const readCSV  = (url) => {
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
    return data = new TidyBlocksDataFrame(result.data)
  }
}

/**
 * Create dynamic table from array from JSON with one table column per property.
 * Each object must have the same properties.
 * @param {JSON} json - JSON object to convert to table.
 */
const json2table = (json) => {
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
  // Blockly.JavaScript.INFINITE_LOOP_TRAP = null
  const code = Blockly.JavaScript.workspaceToCode(DemoWorkspace)
  document.getElementById('codeOutput').innerHTML = code
}

/**
 * Set up Blockly display by injecting XML data into blockDisplay div.
 * As a side effect, sets the global DemoWorkspace variable for later use.
 */
function setUpBlockly () {
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

/**
* Setup after DOM has initialized.
**/
document.addEventListener('DOMContentLoaded', (event) => {
  initializeDisplay()
  setUpBlockly()
})


/**
* LM
* Statistical functions to apply to plots
* As an example, here is a linear model using least squares
**/

function findLineByLeastSquares(values_x, values_y) {
  var x_sum = 0;
  var y_sum = 0;
  var xy_sum = 0;
  var xx_sum = 0;
  var count = 0;

  // The above is just for quick access, makes the program faster
  var x = 0;
  var y = 0;
  var values_length = values_x.length;

  if (values_length != values_y.length) {
      throw new Error('The parameters values_x and values_y need to have same size!');
  }

  // Above and below cover edge cases
  if (values_length === 0) {
      return [ [], [] ];
  }

  // Calculate the sum for each of the parts necessary.
  for (let i = 0; i< values_length; i++) {
      x = values_x[i];
      y = values_y[i];
      x_sum+= x;
      y_sum+= y;
      xx_sum += x*x;
      xy_sum += x*y;
      count++;
  }

  // Calculate m and b for the line equation:
  // y = x * m + b
  var m = (count*xy_sum - x_sum*y_sum) / (count*xx_sum - x_sum*x_sum);
  var b = (y_sum/count) - (m*x_sum)/count;

  // solve for x and y intercept
  return [m, b]
}
