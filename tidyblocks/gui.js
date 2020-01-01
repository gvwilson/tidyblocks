// Share the workspace between functions.
let TidyBlocksWorkspace = null

// Precision for number display.
const PRECISION = 6

// Regular expressions to match valid single column names and multiple column names.
const SINGLE_COLUMN_NAME = /^ *[_A-Za-z][_A-Za-z0-9]* *$/
const MULTIPLE_COLUMN_NAMES = /^ *([_A-Za-z][_A-Za-z0-9]*)( *, *[_A-Za-z][_A-Za-z0-9]*)* *$/

// Names of single-column fields in various blocks (for generating validators).
const SINGLE_COLUMN_FIELDS = [
  'COLOR',
  'COLUMN',
  'FORMAT',
  'GROUPS',
  'LEFT_COLUMN',
  'LEFT_TABLE',
  'NAME',
  'RIGHT_COLUMN',
  'RIGHT_TABLE',
  'VALUES',
  'X_AXIS',
  'Y_AXIS'
]

// Names of multiple-column fields in various blocks (for generating validators).
const MULTIPLE_COLUMN_FIELDS = [
  'MULTIPLE_COLUMNS'
]

// Location of standard datasets.
STANDARD_DATASET_BASE_URL = 'https://raw.githubusercontent.com/tidyblocks/tidyblocks/master/data/'

//--------------------------------------------------------------------------------

/**
 * Class to handle connections to the outside world.  (A different class with
 * the same methods is used for testing purposes.)
 */
class GuiEnvironment {

  constructor () {
  }

  /**
   * Get the code to run.
   * @returns {string} The code to run.
   */
  getCode () {
    return Blockly.JavaScript.workspaceToCode(TidyBlocksWorkspace)
  }

  /**
   * Read CSV from a URL and parse to create TidyBlocks data frame.
   * @param {string} url URL to read from.
   * @param {boolean} standard Add prefix for standard dataset location.
   * @return dataframe containing that data.
   */
  readCSV (url, standard=false) {
    if ((url === "url") || (url.length === 0)) {
      throw new Error('Cannot fetch empty URL')
    }

    if (standard) {
      url = `${STANDARD_DATASET_BASE_URL}/${url}`
    }

    const request = new XMLHttpRequest()
    request.open('GET', url, false)
    request.send(null)

    if (request.status !== 200) {
      console.log(`ERROR: ${request.status}`)
      return null
    }
    else {
      return TbManager.csv2tbDataFrame(request.responseText)
    }
  }

  /**
   * Use a previously-loaded local CSV file.
   * @param {string} name Name of file to use.
   * @return dataframe containing that data.
   */
  useLocal (name) {
    return TbManager.files.get(name)
  }

  /**
   * Display a plot.
   * @param {Object} spec Vega-Lite spec for plot with data filled in.
   */
  displayPlot (spec) {
    vegaEmbed('#plotOutput', spec, {})
  }

  /**
   * Display statistical test results.
   * @param {Object} values stdlib results for statistical test.
   * @param {Object} legend Text values describing results.
   */
  displayStats (values, legend) {
    document.getElementById('statsOutput').innerHTML = stats2table(values, legend)
  }

  /**
   * Display a dataframe as HTML.
   * @param {Object} table JSON array of uniform objects.
   */
  displayFrame (frame) {
    document.getElementById('dataOutput').innerHTML = json2table(frame.data)
  }

  /**
   * Display an error.
   * @param {string} error The message to display.
   */
  displayError (error) {
    document.getElementById('errorOutput').innerHTML = error
  }
}

//--------------------------------------------------------------------------------

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
  document.getElementById('dataButton').click()
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
 * Show the code corresponding to current blocks.
 */
const showCode = () => {
  const rawCode = Blockly.JavaScript.workspaceToCode(TidyBlocksWorkspace)
  const fixedCode = TbManager.fixCode(rawCode)
  document.getElementById('codeOutput').innerHTML = fixedCode
}

/**
 * Set up Blockly display by injecting XML data into blockDisplay div.
 * As a side effect, sets the global TidyBlocksWorkspace variable for later use.
 */
const setUpBlockly = () => {
  TidyBlocksWorkspace = Blockly.inject(
    document.getElementById('blockDisplay'),
    {
      media: 'media/',
      toolbox: document.getElementById('toolbox'),
      zoom:
         {controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2},
      horizontalLayout: false,
      scrollbars: false, 
      theme: Blockly.Themes.Tidy
    }
  )

  TidyBlocksWorkspace.addChangeListener(Blockly.Events.disableOrphans)

  TidyBlocksWorkspace.addChangeListener((event) => {
    if (event.type === Blockly.Events.CREATE) {
      const block = TidyBlocksWorkspace.getBlockById(event.blockId)
      TbManager.addNewBlock(block)
    }
    else if (event.type === Blockly.Events.DELETE) {
      // FIXME: handle deletion
    }
  })

  SINGLE_COLUMN_FIELDS.forEach(col => {
    Blockly.Extensions.register(`validate_${col}`, createValidator(col, SINGLE_COLUMN_NAME))
  })

  MULTIPLE_COLUMN_FIELDS.forEach(col => {
    Blockly.Extensions.register(`validate_${col}`, createValidator(col, MULTIPLE_COLUMN_NAMES))
  })

  Blockly.Extensions.register('local_file_extension',
  function() {
    this.getInput('INPUT')
      .appendField(new Blockly.FieldDropdown(
        function() {
          const options = Array.from(TbManager.files.keys()).map(name => [name, name])
          return options;
        }), 'FILENAME');
  });
}

/**
 * Create a Blockly field validation function for a column.
 * See https://developers.google.com/blockly/guides/create-custom-blocks/fields/validators
 * and https://developers.google.com/blockly/guides/create-custom-blocks/extensions for details.
 * @param {string} columnName Name of column to be validated.
 * @param {regex} pattern Regular expression that must be matched.
 * @returns A function (defined with old-style syntax so that 'this' manipulation will work) to validate column values.
 */
const createValidator = (columnName, pattern) => {
  return function () {
    const field = this.getField(columnName)
    field.setValidator((newValue) => {
      if (newValue.match(pattern)) {
        return newValue.trim() // strip leading and trailing spaces
      }
      return null // fails validation
    })
  }
}

/**
 * Run the code generated from the user's blocks.
 * Depends on the global TidyBlocksWorkspace variable.
 */
const runCode = () => {
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null
  TbManager.run(new GuiEnvironment())
}

/**
 * Save the code generated from the user's workspace.
 * Depends on the global TidyBlocksWorkspace variable.
 */
const saveCode = () => {
  const filename = 'Workspace_' + new Date().toLocaleDateString() + '.txt'
  const xml = Blockly.Xml.workspaceToDom(TidyBlocksWorkspace)
  const text = Blockly.Xml.domToText(xml)
  const link = document.getElementById('download')
  link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
  link.setAttribute('download', filename)
}

/**
 * Save the data pane as csv 
 * Convert JSON to array
 * Function to export as CSV
 * First need to clean up JSON before exporting
 */
function saveTable(table_id) {
  // Select rows from table_id
  var rows = document.querySelectorAll('table#' + table_id + ' tr');
  // Construct csv
  var csv = [];
  for (var i = 0; i < rows.length; i++) {
    var row = [], cols = rows[i].querySelectorAll('td, th');
    for (var j = 0; j < cols.length; j++) {
      // Clean innertext to remove multiple spaces and jumpline (break csv)
      var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
      // Escape double-quote with double-double-quote.
      // see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
      data = data.replace(/"/g, '""');
      // Push escaped string
      row.push('"' + data + '"');
    }
    csv.push(row.join(','));
  }
  var csv_string = csv.join('\n');
  // Download it
  var filename = 'TbDataFrame_' + new Date().toLocaleDateString() + '.csv';
  var link = document.createElement('a');
  link.style.display = 'none';
  link.setAttribute('target', '_blank');
  link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/*
* Save plot using html2canvas
*/
$(function() {
  $("#savePlot").click(function() {
    html2canvas($("#plotOutput"), {
      onrendered: function(canvas) {
        saveAs(canvas.toDataURL(), 'Plot.png');
      }
    });
  });

  function saveAs(uri, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
      link.href = uri;
      link.download = filename;

      //Firefox requires the link to be in the body
      document.body.appendChild(link);

      //simulate click
      link.click();

      //remove the link when done
      document.body.removeChild(link);
    } else {
      window.open(uri);
    }
  }
})

/**
 * Load saved code.
 * Depends on the global TidyBlocksWorkspace variable.
 * @param {string[]} fileList List of files (only first element is valid).
 */
const loadCode = (fileList) => {
  const file = fileList[0]
  const text = file.text().then((text) => {
    const xml = Blockly.Xml.textToDom(text)
    Blockly.Xml.clearWorkspaceAndLoadFromXml(xml, TidyBlocksWorkspace)
  })
}

/*
 * Upload workspace when button clicked.
 */
$('#OpenImgUpload').click(function() {
  $('#imgupload').trigger('click')
})

/**
 * Load local data file for later use.
 * Depends on the global TidyBlocksWorkspace variable.
 * @param {string[]} fileList List of files (only first element is valid).
 */
const loadData = (fileList) => {
  const file = fileList[0]
  const name = file.name
  const text = file.text().then(text => {
    const df = TbManager.csv2tbDataFrame(text)
    TbManager.files.set(name, df)
  })
}

/*
 * Upload data file when button clicked.
 */
$('#OpenDataUpload').click(function() {
  $('#dataupload').trigger('click')
})

/**
 * Produce a human-friendly name for the type of a column.
 * @param value The value whose type is checked.
 * @returns The name of the type
 */
const colTypeName = (value) => {
  if (value instanceof Date) {
    return 'datetime'
  }
  return typeof value
}

/**
 * Create dynamic table from array from JSON with one table column per property.
 * Each object must have the same properties.
 * @param {JSON} json JSON object to convert to table.
 */
const json2table = (json) => {
  if (json.length === 0) {
    return '<p>empty</p>'
  }
  const cols = Object.keys(json[0])
  const headerRow = '<tr>' + cols.map(c => `<th>${c}</th>`).join('') + '</tr>'
  const typeRow = '<tr>' + cols.map(c => `<th>${colTypeName(json[0][c])}</th>`).join('') + '</tr>'
  const bodyRows = json.map(row => {
    return '<tr>' + cols.map(c => value2html(row[c])).join('') + '</tr>'
  }).join('')
  return `<table id="dataFrame"><thead>${headerRow}</thead><tbody>${typeRow}${bodyRows}</tbody></table>`
}

/**
 * Create a tabular display of statistical results.
 * @param {Object} values stdlib results for statistical test.
 * @param {Object} legend Text values describing results.
 */
const stats2table = (values, legend) => {
  const title = legend._title
  delete legend._title
  const headerRow = '<tr><th>Result</th><th>Value</th><th>Explanation</th></tr>'
  const bodyRows = Object.keys(legend).map(key => {
    let value = values[key]
    if (value === undefined) {
      value = ''
    }
    else if (Array.isArray(value)) {
      value = value.map(x => x.toPrecision(PRECISION)).join(',<br/>')
    }
    else if (typeof value === 'number') {
      value = value.toPrecision(PRECISION)
    }
    return `<tr><td>${key}</td><td>${value}</td><td>${legend[key]}</td></tr>`
  }).join('')
  return `<p>${title}</p><table id="statsResult"><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`
}

/**
 * Convert a single value to HTML (to handle numeric precision and undefined).
 * @param {Object} value To be converted.
 * @returns A string.
 */
const value2html = (value) => {
  if (value === undefined) {
    return '<td class="undefined"></td>'
  }
  if (typeof value === 'number') {
    if (! Number.isInteger(value)) {
      value = value.toPrecision(PRECISION)
    }
  }
  return `<td>${value}</td>`
}

/**
 * Toggle between tabs for dataframe and error pane
 */
const displayTab = (event, tabName) => {
  Array.from(document.getElementsByClassName('tabContent')).forEach(element => {
    element.style.display = 'none'
  })
  Array.from(document.getElementsByClassName('tablink')).forEach(element => {
    element.className = element.classList.remove('active')
  })
  document.getElementById(tabName).style.display = 'block';
  event.currentTarget.classList.add('active')
}



/**
 * Code for slider between blockly pane and tabs
 */
// function is used for dragging and moving
function dragElement( element, direction)
{
    var   md; // remember mouse down info
    const first  = document.getElementById("first");
    const second = document.getElementById("second");
    
    element.onmousedown = onMouseDown;
    
    function onMouseDown( e )
    {
  //console.log("mouse down: " + e.clientX);
  md = {e,
        offsetLeft:  element.offsetLeft,
        offsetTop:   element.offsetTop,
        firstWidth:  first.offsetWidth,
        secondWidth: second.offsetWidth};
  document.onmousemove = onMouseMove;
  document.onmouseup = () => { 
      //console.log("mouse up");
      document.onmousemove = document.onmouseup = null;
  }
    }
    
    function onMouseMove( e )
    {
  //console.log("mouse move: " + e.clientX);
  var delta = {x: e.clientX - md.e.x,
         y: e.clientY - md.e.y};
  
  if (direction === "H" ) // Horizontal
  {
      // prevent negative-sized elements
      delta.x = Math.min(Math.max(delta.x, -md.firstWidth),
             md.secondWidth);
      
      element.style.left = md.offsetLeft + delta.x + "px";
      first.style.width = (md.firstWidth + delta.x) + "px";
      second.style.width = (md.secondWidth - delta.x) + "px";
  }
    }
}

dragElement( document.getElementById("separator"), "H" );

var x, i, j, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
selElmnt = x[i].getElementsByTagName("select")[0];
/*for each element, create a new DIV that will act as the selected item:*/
a = document.createElement("DIV");
a.setAttribute("class", "select-selected");
a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
x[i].appendChild(a);
/*for each element, create a new DIV that will contain the option list:*/
b = document.createElement("DIV");
b.setAttribute("class", "select-items select-hide");
for (j = 1; j < selElmnt.length; j++) {
/*for each option in the original select element,
create a new DIV that will act as an option item:*/
c = document.createElement("DIV");
c.innerHTML = selElmnt.options[j].innerHTML;
c.addEventListener("click", function(e) {
    /*when an item is clicked, update the original select box,
    and the selected item:*/
    var y, i, k, s, h;
    s = this.parentNode.parentNode.getElementsByTagName("select")[0];
    h = this.parentNode.previousSibling;
    for (i = 0; i < s.length; i++) {
      if (s.options[i].innerHTML == this.innerHTML) {
        s.selectedIndex = i;
        h.innerHTML = this.innerHTML;
        y = this.parentNode.getElementsByClassName("same-as-selected");
        for (k = 0; k < y.length; k++) {
          y[k].removeAttribute("class");
        }
        this.setAttribute("class", "same-as-selected");
        break;
      }
    }
    h.click();
});
b.appendChild(c);
}
x[i].appendChild(b);
a.addEventListener("click", function(e) {
  /*when the select box is clicked, close any other select boxes,
  and open/close the current select box:*/
  e.stopPropagation();
  closeAllSelect(this);
  this.nextSibling.classList.toggle("select-hide");
  this.classList.toggle("select-arrow-active");
});
}
function closeAllSelect(elmnt) {
/*a function that will close all select boxes in the document,
except the current select box:*/
var x, y, i, arrNo = [];
x = document.getElementsByClassName("select-items");
y = document.getElementsByClassName("select-selected");
for (i = 0; i < y.length; i++) {
if (elmnt == y[i]) {
  arrNo.push(i)
} else {
  y[i].classList.remove("select-arrow-active");
}
}
for (i = 0; i < x.length; i++) {
if (arrNo.indexOf(i)) {
  x[i].classList.add("select-hide");
}
}
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);
