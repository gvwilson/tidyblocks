import ReactDOM from 'react-dom'
import React, {useState} from 'react'
import ReactBlocklyComponent from 'react-blockly'
import parseWorkspaceXml from 'react-blockly/src/BlocklyHelper.jsx'
import Grid from "@material-ui/core/Grid"
import Paper from '@material-ui/core/Paper'
import Container from "@material-ui/core/Container"
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { withStyles, makeStyles, useStyles,
  styled } from '@material-ui/core/styles'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Blockly from 'blockly/blockly_compressed'
import Splitter from 'm-react-splitters'
import 'm-react-splitters/lib/splitters.css'

import {csvToTable} from '../util'
import DataFrame from '../dataframe'
import { MenuBar } from './menuBar.jsx'
import { SaveCsvFormDialog, SaveWorkspaceFormDialog,
  SaveSvgFormDialog, SaveAllSvgFormDialog, LoadCsvDialog } from './saveDialog.jsx'
import { DataTabSelect, StatsTabSelect, PlotTabSelect} from './select.jsx'
import { TabSelectionBar, TabPanels } from './tabs.jsx'
import { theme } from './theme.jsx'

const createToolboxCategories = (props) => {
  const categories = parseWorkspaceXml(props.toolbox)
  const styles = props.settings.theme.categoryStyles
  categories.forEach(c => {
    const name = c.name
    if (styles[name]) {
      c.colour = styles[name].colour
    }
  })
  return categories
}

// The main TidyBlocks App UI. Contains resizable panes for the Blockly section,
// tabs for data display/plotting/logs.
export class TidyBlocksApp extends React.Component {
  constructor (props) {
    super(props)
    this.blocklyRef = React.createRef()
    this.plotOutputRef = React.createRef()
    this.dataGridRef = React.createRef()
    this.resultGridRef = React.createRef()
    this.workspaceFileUploader = React.createRef()
    this.csvFileUploader = React.createRef()
    this.saveCsvNameDialog = React.createRef()
    this.saveWorkspaceDialog = React.createRef()
    this.saveSvgDialog = React.createRef()
    this.saveAllSvgDialog = React.createRef()
    this.loadCsvDialog = React.createRef()

    // Get the initial environment so that we can pre-populate the datasets.
    const initialEnv = props.initialEnv

    this.state = {
      isDraggingPane: false,
      topRightPaneHeight: 200,
      toolboxCategories: createToolboxCategories(this.props),
      tabValue: 0,
      tabUpdated: {
        'data': false,
        'results': false,
        'stats': false,
        'plot': false,
        'console': false
      },
      DATA_TAB_INDEX: 0,
      RESULTS_TAB_INDEX: 1,
      STATS_TAB_INDEX: 2,
      PLOT_TAB_INDEX: 3,
      CONSOLE_TAB_INDEX: 4,
      CONSOLE_SUCCESS: 'CONSOLE_SUCCESS',
      CONSOLE_WARNING: 'CONSOLE_WARNING',
      CONSOLE_ERROR: 'CONSOLE_ERROR',

      tabValueBottom: 0,
      saveData: [],
      zoom: '1.00',
      // The results returned from running the program. We store them in full
      // in env for use during updates/changes, but may also use more specific
      // helper variables for intermediate results.
      env: initialEnv,
      dataKeys: null,
      data: [],
      dataColumns: [],
      dataOptions: [],
      dataValue: null,
      activeDataOptions: [],
      hideDataTable: false,

      resultKeys: null,
      results: [],
      resultColumns: [],
      resultOptions: [],
      resultValue: null,
      activeResultOptions: [],
      hideResultTable: false,

      plotKeys: null,
      plotData: [],
      plotOptions: [],
      plotValue: null,
      activePlotOptions: [],

      stats: [],
      statsKeys: null,
      statsOptions: [],
      statsValue: null,
      activeStatsOptions: [],
      hideStatsTable: false,

      logMessages: null,
    }

    this.paneVerticalResize = this.paneVerticalResize.bind(this)
    this.updatePlot = this.updatePlot.bind(this)
    this.changePlot = this.changePlot.bind(this)
    this.runProgram = this.runProgram.bind(this)
    this.loadWorkspaceClick = this.loadWorkspaceClick.bind(this)
    this.loadWorkspace = this.loadWorkspace.bind(this)
    this.loadCsvClick = this.loadCsvClick.bind(this)
    this.loadCsv = this.loadCsv.bind(this)
    this.loadCsvUrl = this.loadCsvUrl.bind(this)
    this.changeData = this.changeData.bind(this)
    this.changeResults = this.changeResults.bind(this)
    this.changeStats = this.changeStats.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.sortRows = this.sortRows.bind(this)
    this.updateLogMessages = this.updateLogMessages.bind(this)
    this.saveWorkspace = this.saveWorkspace.bind(this)
    this.saveData = this.saveData.bind(this)
    this.saveSvg = this.saveSvg.bind(this)
    this.saveAllSvg = this.saveAllSvg.bind(this)
    this.maximizePanel = this.maximizePanel.bind(this)
    this.minimizePanel = this.minimizePanel.bind(this)
    this.restorePanel = this.restorePanel.bind(this)
    this.updateZoom = this.updateZoom.bind(this)
    this.workspaceChanged = this.workspaceChanged.bind(this)
  }

  componentDidMount () {
    window.addEventListener('resize', this.paneVerticalResize)
    // Listeners to resize during a pane drag. Note: The postPoned prop for
    // the Splitters doesn't currently handle this accurately on React 16.13
    ReactDOM.findDOMNode(this).querySelector('.handle-bar').addEventListener('mousedown', () => {
      this.setState({isDraggingPane: true})
    }, {passive: true})
    ReactDOM.findDOMNode(this).querySelector('.handle-bar').addEventListener('mouseup', () => {
      this.setState({isDraggingPane: false})
    })
    ReactDOM.findDOMNode(this).querySelector('.handle-bar').addEventListener('mousemove', () => {
      if (this.state.isDraggingPane){
        this.paneVerticalResize()
      }
    })
    // Update the zoom display after touch/gesture events while on the blockly panel.
    ReactDOM.findDOMNode(this).querySelector('.blocklyWrapper').addEventListener('touchend', () => {
      this.updateZoom()
    }, {passive: true})
    ReactDOM.findDOMNode(this).querySelector('.blocklyWrapper').addEventListener('wheel', () => {
      this.updateZoom()
    }, {passive: true})
    ReactDOM.findDOMNode(this).querySelector('.blocklyWrapper').addEventListener('gestureend', () => {
      this.updateZoom()
    }, {passive: true})
    this.updateDataInformation (this.state.env)
    this.updatePlot ()
    this.updateTopRightPaneHeight()
    this.workspaceChanged()
  }

  componentDidUpdate(prevProps, prevState){
    // Toggle visibility to trigger fadeIn animations on react-data-grid.
    if(this.state.data != prevState.data){
      this.setState({hideDataTable: true}, () => {
        this.setState({hideDataTable: false})
      })
    } else if(this.state.stats != prevState.stats){
      this.setState({hideStatsTable: true}, () => {
        this.setState({hideStatsTable: false})
      })
    } else if(this.state.results != prevState.results){
      this.setState({hideResultTable: true}, () => {
        this.setState({hideResultTable: false})
      })
    }
  }

  // Returns the workspace for use by our JavaScript code.
  getWorkspace () {
    return this.blocklyRef.current.workspace
  }

  // Handles a change in the vertical divider postion.
  paneVerticalResize () {
    this.blocklyRef.current.resize()
    this.updatePlot()
  }

  // Maximizes the size of the right panel.
  maximizePanel () {
    const primaryPane = ReactDOM.findDOMNode(this).querySelector('.primary')
    // The pane splitter will automatically adjust to it's minimum, setting to
    // 0% ensures we hit that.
    primaryPane.style['width'] = "0%"
    this.paneVerticalResize()
    // To force react-data-grid to scale.
    window.dispatchEvent(new Event('resize'))

  }

  // Minimizes the size of the right panel.
  minimizePanel () {
    const primaryPane = ReactDOM.findDOMNode(this).querySelector('.primary')
    // The pane splitter will automatically adjust to it's max, setting to
    // 100% ensures we hit that.
    primaryPane.style['width'] = "100%"
    this.paneVerticalResize()
    // To force react-data-grid to scale.
    window.dispatchEvent(new Event('resize'))

  }

  // Restores both panels to their default positions.
  restorePanel () {
    const primaryPane = ReactDOM.findDOMNode(this).querySelector('.primary')
    primaryPane.style['width'] = "50%"
    this.paneVerticalResize()
    // To force react-data-grid to scale.
    window.dispatchEvent(new Event('resize'))
  }


  // Updates the height of the topRightPane. This allows our ReactDataGrid to
  // update it's height.
  updateTopRightPaneHeight () {
    const topRightPane = ReactDOM.findDOMNode(this).querySelector('.topRightPane')
    const TOP_RIGHT_HEIGHT_OFFSET = 110
    if (topRightPane){
      const topRightPaneHeight = (topRightPane.offsetHeight - TOP_RIGHT_HEIGHT_OFFSET)
      this.setState({topRightPaneHeight: topRightPaneHeight})
    }
  }

  // Sorting function for our react-data-grids.
  sortRows (sortColumn, sortDirection) {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return (a[sortColumn]> b[sortColumn]) ? 1 : -1
      } else if (sortDirection === 'DESC') {
        return (a[sortColumn]< b[sortColumn]) ? 1 : -1
      }
    }

    // Can access the initial data for 'None'. For now will just return the
    // same data unchanged.
    const rows = sortDirection === 'NONE' ? this.state.data : this.state.data.sort(comparer)
    this.setState({data: rows})
  }

  // Updates the plot vega drawing.
  updatePlot () {
    // Would be nice to use a ref instead of querying the DOM directly. Panes
    // don't seem to give an offsetWidth though. The alternative would involve
    // computing window sizes (on pane drag or window resize) from
    // percentages.
    const topRightPane = ReactDOM.findDOMNode(this).querySelector('.topRightPane')
    const WIDTH_OFFSET = 120
    const HEIGHT_OFFSET = 150
    if (this.state.plotData) {
      let plotData = this.state.plotData
      if (this.state.plotData.length == 1){
        if (this.plotOutputRef.current) {
          if (topRightPane) {
            plotData[0].width = topRightPane.offsetWidth - WIDTH_OFFSET
            plotData[0].height = topRightPane.offsetHeight - HEIGHT_OFFSET
          }
          vegaEmbed('#plotOutputTop', plotData[0], {})
          vegaEmbed('#plotOutputBottom', [], {})
        }
      } else if (this.state.plotData.length == 2){
        if (this.plotOutputRef.current) {
          if (topRightPane) {
            plotData[0].width = topRightPane.offsetWidth - WIDTH_OFFSET
            plotData[0].height = (topRightPane.offsetHeight - HEIGHT_OFFSET) / 2
            plotData[1].width = topRightPane.offsetWidth - WIDTH_OFFSET
            plotData[1].height = (topRightPane.offsetHeight - HEIGHT_OFFSET) / 2
          }
          vegaEmbed('#plotOutputTop', plotData[0], {})
          vegaEmbed('#plotOutputBottom', plotData[1], {})
        }
      }
    }
  }

  // Handles changing the displayed plot using the react-select dropdown.
  changePlot (e) {
    const activePlotOptions = e
    let plotData = []
    if (!e) {
      this.setState({activePlotOptions: [], plotData: []})
    } else {
      for (let optIndex = 0; optIndex < activePlotOptions.length; optIndex++){
        plotData.push(this.state.env.plots.get(activePlotOptions[optIndex].value))
      }
      this.setState({activePlotOptions: activePlotOptions, plotData: plotData}, () => {
        this.updatePlot()
      })
    }
  }

  changeData (e) {
    const activeDataOptions = e ? e : []
    let formattedColumns = []
    let data = []
    let dataColumns = []
    if (!e) {
      this.setState({activeDataOptions: [], data: [],
        dataColumns: []})
    } else {
      // Swap the stored data depending on whether we're showing userData or
      // results.
      for (let optIndex = 0; optIndex < activeDataOptions.length; optIndex++){
        let tempColumns = []
        data.push(this.state.env.ui.userData.get(activeDataOptions[optIndex].label)['data'])
        dataColumns = this.state.env.ui.userData.get(activeDataOptions[optIndex].label)['columns']
        dataColumns.forEach(c => tempColumns.push({key: c, name: c, sortable: true, resizable: true}))
        formattedColumns.push(tempColumns)
      }
      this.setState({activeDataOptions: activeDataOptions, data: data,
        dataColumns: formattedColumns})
    }
  }

  changeResults (e) {
    const activeResultOptions = e ? e : []
    let formattedColumns = []
    let results = []
    let resultColumns = []
    if (!e) {
      this.setState({activeResultOptions: [], results: [],
        resultColumns: []})
    } else {
      // Swap the stored data depending on whether we're showing userData or
      // results.
      for (let optIndex = 0; optIndex < activeResultOptions.length; optIndex++){
        let tempColumns = []
        results.push(this.state.env.results.get(activeResultOptions[optIndex].label)['data'])
        resultColumns = this.state.env.results.get(activeResultOptions[optIndex].label)['columns']
        resultColumns.forEach(c => tempColumns.push({key: c, name: c, sortable: true, resizable: true}))
        formattedColumns.push(tempColumns)
      }
      this.setState({activeResultOptions: activeResultOptions, results: results,
        resultColumns: formattedColumns})
    }
  }

  changeStats (e) {
    const activeStatsOptions = e
    let stats = []

    if (!e) {
      this.setState({activeStatsOptions: [], stats: []})
    } else {
      for (let optIndex = 0; optIndex < activeStatsOptions.length; optIndex++){
        stats.push([{'name': activeStatsOptions[optIndex].value, 'result': this.state.env.stats.get(activeStatsOptions[optIndex].value)}])
      }
      this.setState({activeStatsOptions: activeStatsOptions, stats: stats})
    }
  }

  updateLogMessages (env) {
    let tabUpdated = this.state.tabUpdated
    tabUpdated.console = false
    if (env.log.length > 0 && this.state.tabValue != this.state.CONSOLE_TAB_INDEX){
      for (let index in env.log){
        if (env.log[index][0] == 'error'){
          tabUpdated.console = this.state.CONSOLE_ERROR
          break
        } else if (env.log[index][0] == 'warn'){
          tabUpdated.console = this.state.CONSOLE_WARNING
        }
      }
      if (tabUpdated.console == false){
        tabUpdated.console = this.state.CONSOLE_SUCCESS
      }
    }
    this.setState({logMessages: env.log, tabUpdated: tabUpdated})
  }

  updateZoom () {
    this.setState({zoom: this.blocklyRef.current.workspace.state.workspace.scale.toFixed(2)})
  }

  workspaceChanged () {
    // Hide scrollbars if there are no blocks otherwise show them. Blockly
    // doesn't reload it's settings when they're changed, so we need to
    // manually toggle this.
    const verticalScroll = ReactDOM.findDOMNode(this).querySelector('.blocklyScrollbarVertical')
    const horizontalScroll = ReactDOM.findDOMNode(this).querySelector('.blocklyScrollbarHorizontal')
    if (this.blocklyRef.current.workspace.state.workspace.topBlocks_.length == 0){
      if (verticalScroll){
        verticalScroll.style.visibility = "hidden"
      }
      if (horizontalScroll){
        horizontalScroll.style.visibility = "hidden"
      }
    } else {
      if (verticalScroll){
        verticalScroll.style.visibility = "visible"
      }
      if (horizontalScroll){
        horizontalScroll.style.visibility = "visible"
      }
    }

    this.updateZoom()
  }

  runProgram () {
    TidyBlocksUI.runProgram()
    const env = TidyBlocksUI.env
    this.updateDataInformation(env)
    this.updateResultsInformation(env)
    this.updatePlotInformation(env)
    this.updateStatsInformation(env)
    this.updateLogMessages(env)

    // Switch tabs based on precdence if they're showing data.
    if (!env.plots.keys().next().done) {
      this.handleTabChange(null, this.state.PLOT_TAB_INDEX)
    } else if (!env.results.keys().next().done){
      this.handleTabChange(null, this.state.RESULTS_TAB_INDEX)
    } else if (!env.stats.keys().next().done) {
      this.handleTabChange(null, this.state.STATS_TAB_INDEX)
    } else {
      this.handleTabChange(null, this.state.DATA_TAB_INDEX)
    }
  }

  updateDataInformation (env) {
    const dataKeys = env.ui.userData.keys()
    let data = []
    let dataColumns = []
    let activeDataOptions = []
    let formattedColumns = []
    let tempColumns = []

    if (this.state.activeDataOptions.length > 0){
      for (let optIndex = 0; optIndex < this.state.activeDataOptions.length; optIndex++){
        tempColumns = []
        if (this.state.activeDataOptions[optIndex]) {
          if (env.ui.userData.has(this.state.activeDataOptions[optIndex].label)){
            data.push(env.ui.userData.get(this.state.activeDataOptions[optIndex].label)['data'])
            dataColumns = env.ui.userData.get(this.state.activeDataOptions[optIndex].label)['columns']
            dataColumns.forEach(c => tempColumns.push({key: c, name: c, sortable: true, resizable: true}))
            formattedColumns.push(tempColumns)
            activeDataOptions.push(this.state.activeDataOptions[optIndex])
          }
        }
      }
    } else {
      let dataResult = env.ui.userData.keys().next()
      if (!dataResult.done){
        activeDataOptions = [{'value': dataResult.value, 'label': dataResult.value}]
        data = [env.ui.userData.get(activeDataOptions[0].value)['data']]
        dataColumns = env.ui.userData.get(activeDataOptions[0].label)['columns']
        dataColumns.forEach(c => tempColumns.push({key: c, name: c, sortable: true, resizable: true}))
        formattedColumns.push(tempColumns)
      }
    }

    let dataOptions = []
    for (let key of env.ui.userData.keys()){
      dataOptions.push({value: key, label: key})
    }

    // Indicate the tab was updated if it has been.
    let tabUpdated = this.state.tabUpdated
    if (data && data.length != this.state.data.length && this.state.tabValue != this.state.DATA_TAB_INDEX){
      tabUpdated.data = true
    }
    this.setState({dataKeys:dataKeys, data: data, dataColumns: formattedColumns,
      activeDataOptions: activeDataOptions, dataOptions: dataOptions,
      tabUpdated: tabUpdated})
  }

  updateResultsInformation (env) {
    const resultKeys = env.results.keys()
    let results = []
    let resultColumns = []
    let activeResultOptions = []
    let formattedColumns = []
    let tempColumns = []

    if (this.state.activeResultOptions.length > 0){
      for (let optIndex = 0; optIndex < this.state.activeResultOptions.length; optIndex++){
        tempColumns = []
        if (this.state.activeResultOptions[optIndex]) {
          if (env.results.has(this.state.activeResultOptions[optIndex].label)){
            results.push(env.results.get(this.state.activeResultOptions[optIndex].label)['data'])
            resultColumns = env.results.get(this.state.activeResultOptions[optIndex].label)['columns']
            resultColumns.forEach(c => tempColumns.push({key: c, name: c, sortable: true, resizable: true}))
            formattedColumns.push(tempColumns)
            activeResultOptions.push(this.state.activeResultOptions[optIndex])
          }
        }
      }
    } else {
      let reportResult = env.results.keys().next()
      if (!reportResult.done){
        activeResultOptions = [{'value': reportResult.value, 'label': reportResult.value}]
        results = [env.results.get(activeResultOptions[0].value)['data']]
        resultColumns = env.results.get(activeResultOptions[0].label)['columns']
        resultColumns.forEach(c => tempColumns.push({key: c, name: c, sortable: true, resizable: true}))
        formattedColumns.push(tempColumns)
      }
    }

    let resultOptions = []
    for (let key of env.results.keys()){
      resultOptions.push({value: key, label: key})
    }

    // Indicate the tab was updated if it has been.
    let tabUpdated = this.state.tabUpdated
    if (results && results.length != this.state.results.length && this.state.tabValue != this.state.RESULTS_TAB_INDEX){
      tabUpdated.results = true
    }
    this.setState({resultKeys:resultKeys, results: results, resultColumns: formattedColumns,
      activeResultOptions: activeResultOptions, resultOptions: resultOptions,
      tabUpdated: tabUpdated})
  }


  updatePlotInformation (env) {
    const plotKeys = env.plots.keys()
    let plotData = []
    let activePlotOptions = []
    // If there's a current activePlotOptions try to load it. Otherwise get the
    // first plot provided by env.
    if (this.state.activePlotOptions.length > 0) {
      for (let optIndex = 0; optIndex < this.state.activePlotOptions.length; optIndex++){
        if (env.plots.has(this.state.activePlotOptions[optIndex].value)){
          plotData.push(env.plots.get(this.state.activePlotOptions[optIndex].value))
          activePlotOptions.push(this.state.activePlotOptions[optIndex])
        }
      }
    } else {
      let result = plotKeys.next()
      if (!result.done){
        activePlotOptions = [{'value': result.value, 'label': result.value}]
        plotData = [env.plots.get(activePlotOptions[0].value)]
      }
    }

    let plotOptions = []
    for (let key of env.plots.keys()){
      plotOptions.push({value: key, label: key})
    }
    // Indicate the tab was updated if it has been.
    let tabUpdated = this.state.tabUpdated
    if (plotData && plotData.length != this.state.plotData.length && this.state.tabValue != this.state.PLOT_TAB_INDEX){
      tabUpdated.plot = true
    }
    this.setState({env: env, plotKeys:plotKeys, plotData: plotData,
      activePlotOptions: activePlotOptions, plotOptions: plotOptions,
      tabUpdated: tabUpdated}, () => {
      this.updatePlot()
    })
  }

  // Updates Stats information.
  updateStatsInformation (env) {
    const statsKeys = env.stats.keys()
    let stats = []
    let statsColumns = []
    let activeStatsOptions = []
    let STATS_COLUMNS = [{key: "name", name: "name", sortable: true, resizable: true},
      {key: "result", name: "result", sortable: true, resizable: true}]

    if (this.state.activeStatsOptions.length > 0) {
      for (let optIndex = 0; optIndex < this.state.activeStatsOptions.length; optIndex++){
        if (env.stats.has(this.state.activeStatsOptions[optIndex].value)){
          stats.push([{'name': this.state.activeStatsOptions[optIndex].value,
            'result': env.stats.get(this.state.activeStatsOptions[optIndex].value)}])
          activeStatsOptions.push(this.state.activeStatsOptions[optIndex])
        }
      }
    } else {
      let result = statsKeys.next()
      if (!result.done){
        activeStatsOptions = [{'value': result.value, 'label': result.value}]
        stats = [[{'name': result.value, 'result': env.stats.get(activeStatsOptions[0].value)}]]
      }
    }

    let statsOptions = []
    for (let key of env.stats.keys()){
      statsOptions.push({value: key, label: key})
    }
    // Indicate the tab was updated if it has been.
    let tabUpdated = this.state.tabUpdated
    if (stats && stats.length != this.state.stats.length && this.state.tabValue != this.state.STATS_TAB_INDEX){
      tabUpdated.stats = true
    }
    this.setState({statsKeys:statsKeys, stats: stats, statsColumns: STATS_COLUMNS,
      activeStatsOptions: activeStatsOptions, statsOptions: statsOptions})
  }

  handleTabChange (event, newValue) {
    // Turn off tab indicators on the newly clicked tab.
    let tabUpdated = this.state.tabUpdated
    switch(newValue) {
      case this.state.DATA_TAB_INDEX:
        tabUpdated.data = false
        break
      case this.state.RESULTS_TAB_INDEX:
        tabUpdated.results = false
        break
      case this.state.STATS_TAB_INDEX:
        tabUpdated.stats = false
        break
      case this.state.PLOT_TAB_INDEX:
        tabUpdated.plot = false
        break
      case this.state.CONSOLE_TAB_INDEX:
        tabUpdated.console = false
        break
    }
    this.setState({tabValue: newValue, tabUpdated: tabUpdated}, () => {
      if (newValue == this.state.PLOT_TAB_INDEX){
        this.updatePlot()
      }
    })
  }

  // Saves the currently displayed data table to a file.
  saveData(){

    // If we're on the results tab, and there're results download them,
    // otherwise download the data.
    if (this.state.tabValue == this.state.RESULTS_TAB_INDEX
      && this.state.resultColumns.length > 0){
      this.setState({saveData: this.state.results}, () => {
        this.saveCsvNameDialog.current.handleClickOpen()
      })
    } else {
      this.setState({saveData: this.state.data}, () => {
        this.saveCsvNameDialog.current.handleClickOpen()
      })
    }
  }

  // Saves the current Blockly workspace to a file.
  saveWorkspace(){
    this.saveWorkspaceDialog.current.handleClickOpen()
  }

  // Saves the svg on the Blockly workspace to a file.
  saveSvg(){
    this.saveSvgDialog.current.handleClickOpen()
  }

  // Saves all the svg files (used as a developer tool to update documentation).
  saveAllSvg(){
    this.saveAllSvgDialog.current.handleClickOpen()
  }

  // Calls the file upload input.
  loadWorkspaceClick () {
    this.refs.workspaceFileUploader.click()
  }

  // Updates the workspace after a file has been uploaded.
  loadWorkspace () {
    const text = this.refs.workspaceFileUploader.files[0].text().then((text) => {
      const xml = Blockly.Xml.textToDom(text)
      const workspace = this.getWorkspace().state.workspace
      Blockly.Xml.clearWorkspaceAndLoadFromXml(xml, workspace)
    })
  }

  // Calls the file upload input.
  loadCsvClick () {
    this.loadCsvDialog.current.handleClickOpen()
  }

  // Processes and loads the csv after the file has been uploaded
  loadCsv () {
    const file = this.refs.csvFileUploader.files[0]
    const name = file.name
    file.text().then(text => {
      const label = name.replace('.csv', '')
      const workspace = this.getWorkspace().state.workspace
      const df = new DataFrame(csvToTable(text))
      this.state.env.ui.userData.set(label, df)
      this.setState({env: this.state.env}, () => {
        this.updateDataInformation(this.state.env)
      })
    })
  }

  // Loads a csv file from a URL
  loadCsvUrl(url){
    // Get the end of the url, removing the extension (if it's there)
    const formattedUrl = url.replace(/#[^#]+$/, "").replace(/\?[^\?]+$/, "").replace(/\/$/, "");
    const label = formattedUrl.substr(formattedUrl.lastIndexOf("/") + 1).replace('.csv', '')
    fetch(url, {mode:'cors'}).then(response => response.text()).then(text => {
      const workspace = this.getWorkspace().state.workspace
      const df = new DataFrame(csvToTable(text))
      this.state.env.ui.userData.set(label, df)
      this.setState({env: this.state.env}, () => {
        this.updateDataInformation(this.state.env)})
    })
  }

  render () {
    const logMessages = (!this.state.logMessages) ?
          <li className="tb-log" key="message-0">No messages</li> :
          this.state.logMessages.map((msg, i) => {
            const key = `message-${i}`
            const cls = `tb-${msg[0]}`
            return (<li className={cls} key={key}><code>{msg[1]}</code></li>)
          })
    const logMessageList = <ul className="tb-messages">{logMessages}</ul>
    const dataDropdown = <DataTabSelect options={this.state.dataOptions}
      onChange={this.changeData} value={this.state.activeDataOptions}/>
    const resultsDropdown = <DataTabSelect options={this.state.resultOptions}
      onChange={this.changeResults} value={this.state.activeResultOptions}/>
    const statsDropdown = <StatsTabSelect options={this.state.statsOptions}
      onChange={this.changeStats} value={this.state.activeStatsOptions}/>
    const plotDropdown = <PlotTabSelect options={this.state.plotOptions}
      onChange={this.changePlot} value={this.state.activePlotOptions}/>
    let consoleDotClass = "animated fadeIn dotIndicator"
    if (this.state.tabUpdated.console == this.state.CONSOLE_ERROR){
      consoleDotClass = "animated fadeIn dotIndicator errorDotIndicator"
    } else if (this.state.tabUpdated.console == this.state.CONSOLE_WARNING){
      consoleDotClass = "animated fadeIn dotIndicator warningDotIndicator"
    } else if (this.state.tabUpdated.console == this.state.CONSOLE_SUCCESS){
      consoleDotClass = "animated fadeIn dotIndicator successDotIndicator"
    }
    return (
      <div className="splitPaneWrapper">
        <MuiThemeProvider theme={theme}>
          <LoadCsvDialog ref={this.loadCsvDialog} fileUploadRef={this.refs.csvFileUploader} loadCsvUrl={this.loadCsvUrl}/>
          <SaveCsvFormDialog ref={this.saveCsvNameDialog} saveData={this.state.saveData}/>
          { this.blocklyRef.current &&
            <>
              <SaveWorkspaceFormDialog ref={this.saveWorkspaceDialog} data={this.getWorkspace().state.workspace}/>
              <SaveSvgFormDialog ref={this.saveSvgDialog} data={this.getWorkspace().state.workspace}/>
              <SaveAllSvgFormDialog ref={this.saveAllSvgDialog}
                toolbox={this.props.toolbox}
                blocklyRef={this.blocklyRef}
                data={this.getWorkspace().state.workspace}/>

            </>
          }
          <MenuBar
            loadCsvClick={this.loadCsvClick}
            loadWorkspaceClick={this.loadWorkspaceClick}
            saveWorkspace={this.saveWorkspace}
            saveData={this.saveData}
            saveSvg={this.saveSvg}
            saveAllSvg={this.saveAllSvg}/>
          <input type="file" id="workspaceFile" ref="workspaceFileUploader"
            onChange={this.loadWorkspace}
            style={{display: "none"}}/>
          <input type="file" id="csvFile" ref="csvFileUploader"
            onChange={this.loadCsv}
            style={{display: "none"}}/>
            <Splitter
              key="vertical-split"
              postPoned={false}
              position="vertical"
              secondaryPaneMinWidth="250px"
              primaryPaneMinWidth="20px"
              primaryPaneWidth="50%"
              dispatchResize={true}
              >
              <div className="blocklyWrapper" onClick={this.updateZoom}>
                {this.blocklyRef.current &&
                  <div className="zoomLevel">Zoom: {this.state.zoom}x</div>
                }
                <ReactBlocklyComponent.BlocklyEditor
                  ref={this.blocklyRef}
                  toolboxCategories={this.state.toolboxCategories}
                  workspaceConfiguration={this.props.settings}
                  wrapperDivClassName="fill-height"
                  workspaceDidChange={this.workspaceChanged}
                />
                <a className="runBtn" onClick={this.runProgram}> Run </a>
              </div>
              <div className="topRightPane">
                <AppBar position="static" color="default" component={'span'}>
                  <TabSelectionBar
                    tabValue={this.state.tabValue}
                    handleTabChange={this.handleTabChange}
                    dataIndex={this.state.DATA_TAB_INDEX}
                    resultIndex={this.state.RESULTS_TAB_INDEX}
                    statsIndex={this.state.STATS_TAB_INDEX}
                    plotIndex={this.state.PLOT_TAB_INDEX}
                    tabUpdated={this.state.tabUpdated}
                    consoleDotClass={consoleDotClass}/>
                </AppBar>
                <TabPanels
                  tabValue={this.state.tabValue}
                  minimizePanel={this.minimizePanel}
                  restorePanel={this.restorePanel}
                  maximizePanel={this.maximizePanel}
                  dataDropdown={dataDropdown}
                  resultsDropdown={resultsDropdown}
                  statsDropdown={statsDropdown}
                  plotDropdown={plotDropdown}
                  plotOutputRef={this.plotOutputRef}
                  logMessageList={logMessageList}
                  dataColumns={this.state.dataColumns}
                  dataGridRef={this.dataGridRef}
                  data={this.state.data}
                  topRightPaneHeight={this.state.topRightPaneHeight}
                  sortRows={this.state.sortRows}
                  resultColumns={this.state.resultColumns}
                  resultGridRef={this.resultGridRef}
                  results={this.state.results}
                  stats={this.state.stats}
                  statsColumns={this.state.statsColumns}
                  plotData={this.state.plotData}
                  isDraggingPane={this.state.isDraggingPane}
                  hideDataTable={this.state.hideDataTable}
                  hideResultTable={this.state.hideResultTable}
                  hideStatsTable={this.state.hideStatsTable}
                />
              </div>
          </Splitter>
        </MuiThemeProvider>
      </div>
    )
  }
}
