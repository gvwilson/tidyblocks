// Not bundled during development.

/**
 * Browser-based interface.
 */
class UI {
  /**
   * Set up after DOM is loaded: create singleton and show default tab.
   * @param {object} briq Other code.
   */
  static Setup (briq) {
    UI.instance = new UI(briq)

    REDIPS.drag.init('redips-drag')
    REDIPS.drag.dropMode = 'single' // one item per cell
    REDIPS.drag.trash.question = null // don't confirm deletion

    Array.from(document.getElementsByClassName('buttonDefault')).forEach(b => b.click())
  }

  /**
   * Get a named dataset (provided as callback to runtime environment objects).
   * @param {string} name Name of previously-loaded data set.
   * @returns Tabular data to be converted to dataframe.
   */
  static GetData (name) {
    if (UI.instance === undefined) {
      throw new Error('UI instance not defined')
    }
    UI.instance.briq.util.check(name && (typeof name === 'string'),
                                `Require non-empty string as dataset name`)
    UI.instance.briq.util.check(UI.instance.data.has(name),
                                `Cannot get unknown dataset ${name}`)
    return UI.instance.data.get(name).data
  }

  // ----------------------------------------------------------------------
  // Build singleton instance.
  // ----------------------------------------------------------------------

  /**
   * @param {object} util Utilities.
   */
  constructor (briq) {
    if (!briq) {
      throw new Error('require code during instance construction')
    }
    this.briq = briq
    this.data = new Map()
    this.env = new this.briq.Environment(UI.GetData)
    this.program = null
    this.factory = new this.briq.HTMLFactory()
    this.redisplay()
  }

  // ----------------------------------------------------------------------
  // Buttons and tabs.
  // ----------------------------------------------------------------------

  /**
   * Show the specified tab.
   * @param {event} evt Browser event.
   * @param {string} tabName Name of the tab (must match an id in the page).
   */
  showTab (evt, tabName, tabButtonClass) {
    const chosenButton = evt.target
    const buttonGroup = chosenButton.getAttribute('data-briq-buttongroup')
    if (buttonGroup) {
      const buttons = document.querySelectorAll(`[data-briq-buttongroup=${buttonGroup}]`)
      Array.from(buttons)
        .forEach(button => {button.classList.remove('active')})
    }
    chosenButton.classList.add('active')

    const chosenTab = document.getElementById(tabName)
    const tabParent = chosenTab.parentNode
    Array.from(tabParent.getElementsByClassName('tabContent'))
      .forEach(tab => {tab.style.display = 'none'})
    chosenTab.style.display = 'block'
  }

  /**
   * Trigger an input element when a button is clicked.
   * @param {string} id ID of element to trigger.
   */
  triggerInput (id) {
    document.getElementById(id).click()
  }

  // ----------------------------------------------------------------------
  // Displays.
  // ----------------------------------------------------------------------

  /**
   * Reset stored data and displays before running program.
   */
  redisplay () {
    this.displayToolbox()
    this.displayProgram(null)
    this.displayTable('data')
    this.displayTable('results')
    this.displayPlot(null)
    this.displayStatistics(null, null)
    this.displayLog(null)
    this.displayError(null)
  }

  /**
   * Display a named data table as an HTML table.
   * @param {string} which Which table to display.
   * @param {string} name Name of dataset to select.
   */
  displayTable (which, name = null) {
    const [selectorId, areaId, available] = {
      data: ['dataSelect', 'dataArea', this.data],
      results: ['resultsSelect', 'resultsArea', this.env.results]
    }[which]
    this.briq.util.check(selectorId && areaId,
                         `Unknown name ${name}`)

    // Elements.
    const selector = document.getElementById(selectorId)
    const area = document.getElementById(areaId)

    // Nothing to select.
    if (available.size === 0) {
      selector.innerHTML = '<option value="">-none-</option>'
      area.innerHTML = ''
      return
    }

    // Show all available datasets, potentially selecting one.
    const desired = name || selector.value || available.keys().next().value
    const makeSelected = (key) => ((key === desired) ? 'selected="selected"' : '')
    selector.innerHTML =
      Array.from(available.keys())
      .map(key => `<option value="${key}"${makeSelected(key)}>${key}</option>`)
      .join('')

    // Display the selected dataset.
    const table = this.dataFrameToHTML(available.get(desired))
    area.innerHTML = table
  }

  /**
   * Display a plot.
   * @param {Object} spec Vega-Lite plot spec (or null to clear)..
   */
  displayPlot (spec) {
    if (spec === null) {
      this.displayInArea('plotArea', null)
    }
    else {
      spec = Object.assign({}, spec, this.FULL_PLOT_SIZE)
      vegaEmbed('#plotArea', spec, {})
    }
  }

  /**
   * Display statistics.
   * @param {Object} results Results of statistical test.
   * @param {Object} legend Explanatory legend.
   */
  displayStatistics (results, legend) {
    const html = (results && legend) ? this.statisticsToHTML(results, legend) : ''
    this.displayInArea('statisticsArea', html)
  }

  /**
   * Display log messages.
   * @param {string[]} message To display.
   */
  displayLog (messages) {
    if (messages) {
      messages = this.listToHTML(messages)
    }
    this.displayInArea('logArea', messages)
  }

  /**
   * Display error messages.
   * @param {string[]} message To display.
   */
  displayError (messages) {
    if (messages) {
      messages.forEach(m => console.log(m))
      messages = this.listToHTML(messages)
    }
    this.displayInArea('errorArea', messages)
  }

  /**
   * Make and display the toolbox.
   */
  displayToolbox () {
    const allTabs = [
      ['exprTab', this.briq.Expr.CLASSES],
      ['transformTab', this.briq.Stage.CLASSES]
    ]
    for (const [id, classes] of allTabs) {
      const toolbox = this.factory.makeToolbox(classes)
      const div = document.getElementById(id)
      div.innerHTML = toolbox
    }
  }

  /**
   * Display a program's structure.
   * @param {Object} program Program to display.
   */
  displayProgram (program) {
    if (program) {
      this.displayLog([`<pre>${JSON.stringify(program.toJSON(), null, 1)}</pre>`])
      program = program.toHTML(this.factory)
    }
    else {
      this.displayLog(['clear program'])
      program = this.briq.Program.EmptyHTML(this.factory)
    }
    this.displayInArea('programArea', program)
  }

  // ----------------------------------------------------------------------
  // Data management.
  // ----------------------------------------------------------------------

  /**
   * Load a CSV data file.
   * @param {FileList} fileList List of files provided by browser file selection dialog.
   */
  loadData (fileList) {
    const file = fileList[0]
    const name = file.name
    file.text().then(text => {
      const data = this.briq.util.csvToTable(text)
      const df = new this.briq.DataFrame(data)
      this.data.set(name, df)
      this.displayTable('data', name)
    })
  }

  /**
   * Save the current results to disk.
   * @param {event} evt Browser event (ignored).
   */
  saveResults (evt) {
    const filename = 'result.csv' // FIXME how to trigger dialog to ask for filename?
    const text = 'a,b,c' // FIXME get the current result
    this.saveFile(filename, text)
  }

  // ----------------------------------------------------------------------
  // Program management.
  // ----------------------------------------------------------------------

  /**
   * Load a program from disk.
   * @param {FileList} fileList List of files provided by browser file selection dialog.
   */
  loadProgram (fileList) {
    if (fileList.length === 0) {
      return
    }
    const file = fileList[0]
    const name = file.name
    file.text().then(text => {
      const json = JSON.parse(text)
      this.program = this.briq.util.fromJSON(json)
      this.displayProgram(this.program)
    })
  }

  /**
   * Save a program to disk.
   * @param {event} evt Browser event (ignored).
   */
  saveProgram (evt) {
    const filename = 'program.briq' // FIXME how to trigger dialog to ask for filename?
    const text = 'saved program' // FIXME get the actual JSON
    this.saveFile(filename, text)
  }

  /**
   * Run the current program.
   */
  runProgram () {
    const body = this.getProgramBody()
    const temp = this.briq.Program.fromHTML(body)
    if (this.program === null) {
      this.displayError([`No program available`])
      return
    }
    this.env = new this.briq.Environment(UI.GetData)
    this.program.run(this.env)
    this.displayLog(this.env.log)
    this.displayError(this.env.errors)
  }

  /**
   * Add a row to the program area.
   */
  addProgramRow () {
    const body = this.getProgramBody()
    const height = body.children.length
    const width = body.firstChild.children.length
    this.briq.util.check(width > 1,
                         `Must have some columns in order to add a row`)
    const content = [
      this.factory.pipelineIDCell(height),
      ...Array(width-1).fill(this.factory.placeholder()).join('')
    ].join('')
    const newRow = document.createElement('tr')
    newRow.innerHTML = content
    body.appendChild(newRow)
  }

  /**
   * Add a column to the program area.
   */
  addProgramCol () {
    const body = this.getProgramBody()
    const temp = document.createElement('tr')
    const children = Array.from(body.children)
    children.forEach(row => {
      temp.innerHTML = this.factory.placeholder()
      row.appendChild(temp.firstChild)
    })
  }

  /**
   * Get body of program table.
   */
  getProgramBody () {
    const table = document.getElementById('briq-program')
    if ((table === null) || (table.tagName.toUpperCase() != 'TABLE')) {
      throw new Error('cannot find valid program')
    }
    const body = table.firstChild
    if ((body === null) || (body.tagName.toUpperCase() != 'TBODY')) {
      throw new Error('program table does not have valid body')
    }
    return body
  }

  // ----------------------------------------------------------------------
  // Utilities.
  // ----------------------------------------------------------------------

  /**
   * Display some HTML in a browser element.
   * @param {string} id ID of element to display in.
   * @param {string} html What to display.
   */
  displayInArea (id, html) {
    const div = document.getElementById(id)
    div.innerHTML = html ? html : ''
  }

  /**
   * Convert dataframe to HTML.
   * @param {DataFrame} df Dataframe to display.
   */
  dataFrameToHTML (df) {
    if (!df) {
      return '-empty-'
    }
    const data = df.data
    const keys = Array.from(Object.keys(data[0]))
    const header = '<tr>' + keys.map(k => `<th>${k}</th>`).join('') + '</tr>'
    const body = data.map(row => '<tr>' + keys.map(k => `<td>${row[k]}</td>`).join('') + '</tr>').join('')
    const html = `<table class="data">${header}${body}</table>`
    return html
  }

  /**
   * Convert results of statistical test to HTML.
   */
  statisticsToHTML (results, legend) {
    const title = legend._title
    const header = '<tr><th>Result</th><th>Value</th><th>Explanation</th></tr>'
    const body = Object.keys(legend).map(key => {
      if (key === '_title') {
        return ''
      }
      let value = results[key]
      if (value === undefined) {
        value = ''
      }
      else if (Array.isArray(value)) {
        value = value.map(x => x.toPrecision(this.PRECISION)).join(',<br/>')
      }
      else if (typeof value === 'number') {
        value = value.toPrecision(this.PRECISION)
      }
      return `<tr><td>${key}</td><td>${value}</td><td>${legend[key]}</td></tr>`
    }).join('')
    const html = `<p>${title}</p><table class="statistics">${header}${body}</table>`
    return html
  }

  /**
   * Convert array of messages to HTML list.
   * @param {string[]} messages To convert.
   * @returns HTML
   */
  listToHTML (messages) {
    return '<ol>' + messages.map(m => `<li>${m}</li>`).join('') + '</ol>'
  }

  /**
   * Save a file locally.
   * @param {string} filename Name of file to save to.
   * @param {whatever} content Data to save.
   */
  saveFile (filename, content) {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plaincharset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', filename)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }
}

/**
 * Size of standard plotting area.
 */
this.FULL_PLOT_SIZE = {
  width: 500,
  height: 300
}

/**
 * Precision for displaying floating-point values.
 */
this.PRECISION = 6
