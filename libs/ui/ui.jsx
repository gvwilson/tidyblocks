import ReactDOM from 'react-dom'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import ReactBlocklyComponent from 'react-blockly'
import parseWorkspaceXml from 'react-blockly/src/BlocklyHelper.jsx'
import DataGrid from 'react-data-grid'
import Grid from "@material-ui/core/Grid"
import Paper from '@material-ui/core/Paper'
import Container from "@material-ui/core/Container"
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { withStyles, makeStyles, useStyles, styled } from '@material-ui/core/styles'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import Blockly from 'blockly/blockly_compressed'
import {csvToTable} from '../util'
import DataFrame from '../dataframe'
import Splitter from 'm-react-splitters'
import 'm-react-splitters/lib/splitters.css'
import Tooltip from '@material-ui/core/Tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowMaximize, faWindowMinimize, faWindowRestore } from '@fortawesome/free-solid-svg-icons'
import { MenuBar } from './menuBar.jsx'
import { SaveCsvFormDialog, SaveWorkspaceFormDialog, SaveSvgFormDialog } from './saveDialog.jsx'
import { DataTabSelect, StatsTabSelect, PlotTabSelect} from './select.jsx'

const TAB_HEIGHT = '34px'
const TAB_WIDTH = '130px'
const DATA_USER = 'user'
const DATA_REPORT = 'results'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1C313A',
      light: '#455a64',
      dark: '#000914',
      contrastText: "#ffffff"
    },
    secondary: {
      light: '#2b313a',
      main: '#000914',
      dark: '#000000',
      contrastText: '#ffffff',
    },
  },
  overrides: {
    MuiTabs: {
      root: {
        minHeight: TAB_HEIGHT,
        height: TAB_HEIGHT
      },
      indicator: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#b1b4b5'
      }
    },
    MuiTab: {
      root: {
        minHeight: TAB_HEIGHT,
        height: TAB_HEIGHT,
        minWidth: TAB_WIDTH + " !important",
      },
      wrapper: {
        fontSize: '12px'
      }
    },
    MuiPaper: {
      root: {
        backgroundColor: '#f5f5f5',
        padding: '0px'
      }
    }
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  }
})

const TabPanel = (props) => {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={"div"}>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

const a11yProps = (index) => {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  }
}

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

function TabHeader (props) {
  return(
    <Paper>
    <Grid container alignContent="center" alignItems="center" spacing={0}>
      <Grid item xs={7}>
        <Grid container spacing={0}>
          {props.selectDropdown}
        </Grid>
      </Grid>
      <Grid item xs={5}>
        <Grid container justify="flex-end" spacing={1}>
          <Tooltip title={"Minimize Panel"}>
            <Grid item className="resizeIconGrid" onClick={props.minimizePanel}>
              <FontAwesomeIcon className="resizeIcon"icon={faWindowMinimize} />
            </Grid>
          </Tooltip>
          <Tooltip title={"Maximize Panel"}>
            <Grid item className="resizeIconGrid" onClick={props.maximizePanel}>
              <FontAwesomeIcon className="resizeIcon"icon={faWindowMaximize} />
            </Grid>
          </Tooltip>
          <Tooltip title={"Restore Panel"}>
            <Grid item className="resizeIconGrid" onClick={props.restorePanel}>
              <FontAwesomeIcon className="resizeIcon"icon={faWindowRestore} />
            </Grid>
          </Tooltip>
        </Grid>
      </Grid>
    </Grid>
    </Paper>
  )
}

// The main TidyBlocks App UI. Contains resizable panes for the Blockly section,
// tabs for data display/plotting/logs.
export class TidyBlocksApp extends React.Component {
  constructor (props) {
    super(props)
    this.blocklyRef = React.createRef()
    this.plotOutputRef = React.createRef()
    this.dataGridRef = React.createRef()
    this.workspaceFileUploader = React.createRef()
    this.csvFileUploader = React.createRef()
    this.saveCsvNameDialog = React.createRef()
    this.saveWorkspaceDialog = React.createRef()
    this.saveSvgDialog = React.createRef()

    // Get the initial environment so that we can pre-populate the datasets.
    const initialEnv = props.initialEnv

    this.state = {
      isDraggingPane: false,
      topRightPaneHeight: 200,
      toolboxCategories: createToolboxCategories(this.props),
      tabValue: 0,
      tabUpdated: {
        'data': false,
        'stats': false,
        'plot': false,
        'console': false
      },
      DATA_TAB_INDEX: 0,
      STATS_TAB_INDEX: 1,
      PLOT_TAB_INDEX: 2,
      CONSOLE_TAB_INDEX: 3,
      CONSOLE_SUCCESS: 'CONSOLE_SUCCESS',
      CONSOLE_WARNING: 'CONSOLE_WARNING',
      CONSOLE_ERROR: 'CONSOLE_ERROR',

      tabValueBottom: 0,
      zoom: '1.00',
      // The results returned from running the program. We store them in full
      // in env for use during updates/changes, but may also use more specific
      // helper variables for intermediate results.
      env: initialEnv,
      dataKeys: null,
      data: null,
      dataColumns: null,
      dataOptions: [],
      dataValue: null,
      activeDataOption: null,

      plotKeys: null,
      plotData: null,
      plotOptions: [],
      plotValue: null,
      activePlotOption: null,

      stats: null,
      statsKeys: null,
      statsOptions: [],
      statsValue: null,
      activeStatsOption: null,

      logMessages: null
    }

    this.paneVerticalResize = this.paneVerticalResize.bind(this)
    this.updatePlot = this.updatePlot.bind(this)
    this.changePlot = this.changePlot.bind(this)
    this.runProgram = this.runProgram.bind(this)
    this.loadWorkspaceClick = this.loadWorkspaceClick.bind(this)
    this.loadWorkspace = this.loadWorkspace.bind(this)
    this.loadCsvClick = this.loadCsvClick.bind(this)
    this.loadCsv = this.loadCsv.bind(this)
    this.changeData = this.changeData.bind(this)
    this.changeStats = this.changeStats.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.sortRows = this.sortRows.bind(this)
    this.updateLogMessages = this.updateLogMessages.bind(this)
    this.saveWorkspace = this.saveWorkspace.bind(this)
    this.saveData = this.saveData.bind(this)
    this.saveSvg = this.saveSvg.bind(this)
    this.maximizePanel = this.maximizePanel.bind(this)
    this.minimizePanel = this.minimizePanel.bind(this)
    this.restorePanel = this.restorePanel.bind(this)
    this.updateZoom = this.updateZoom.bind(this)
  }

  componentDidMount () {
    window.addEventListener('resize', this.paneVerticalResize)
    // Listeners to resize during a pane drag. Note: The postPoned prop for
    // the Splitters doesn't currently handle this accurately on React 16.13
    ReactDOM.findDOMNode(this).querySelector('.handle-bar').addEventListener('mousedown', () => {
      this.setState({isDraggingPane: true})
    })
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
    })
    ReactDOM.findDOMNode(this).querySelector('.blocklyWrapper').addEventListener('wheel', () => {
      this.updateZoom()
    })
    ReactDOM.findDOMNode(this).querySelector('.blocklyWrapper').addEventListener('gestureend', () => {
      this.updateZoom()
    })
    this.updateDataInformation (this.state.env)
    this.updatePlot ()
    this.updateTopRightPaneHeight()
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
      const plotData = this.state.plotData

      //Only redraw if the pane is visible.
      if (this.plotOutputRef.current) {
        if (topRightPane) {
          plotData.width = topRightPane.offsetWidth - WIDTH_OFFSET
          plotData.height = topRightPane.offsetHeight - HEIGHT_OFFSET
        }
        vegaEmbed('#plotOutput', plotData, {})
      }
    }
  }

  // Handles changing the displayed plot using the react-select dropdown.
  changePlot (e) {
    const activePlotOption = e
    const plotData = this.state.env.plots.get(activePlotOption.value)
    this.setState({activePlotOption: activePlotOption, plotData: plotData}, () => {
      this.updatePlot()
    })
  }

  changeData (e) {
    const activeDataOption = e
    let formattedColumns = []
    // Swap the stored data depending on whether we're showing userData or
    // results.
    if (activeDataOption.type == DATA_USER){
      const data = this.state.env.ui.userData.get(activeDataOption.label)['data']
      const dataColumns = this.state.env.ui.userData.get(activeDataOption.label)['columns']
      dataColumns.forEach(c => formattedColumns.push({key: c, name: c, sortable: true, resizable: true}))
      this.setState({activeDataOption: activeDataOption, data: data,
        dataColumns: formattedColumns})

    } else if (activeDataOption.type == DATA_REPORT){
      const data = this.state.env.results.get(activeDataOption.label)['data']
      const dataColumns = this.state.env.results.get(activeDataOption.label)['columns']
      dataColumns.forEach(c => formattedColumns.push({key: c, name: c, sortable: true, resizable: true}))
      this.setState({activeDataOption: activeDataOption, data: data,
        dataColumns: formattedColumns})
    }
  }

  changeStats (e) {
    const activeStatsOption = e
    let formattedColumns = []
    const stats = [{'name': activeStatsOption.value, 'result': this.state.env.stats.get(activeStatsOption.value)}]
    this.setState({activeStatsOption: activeStatsOption, stats: stats})
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

  runProgram () {
    TidyBlocksUI.runProgram()
    const env = TidyBlocksUI.env
    this.updateDataInformation(env)
    this.updatePlotInformation(env)
    this.updateStatsInformation(env)
    this.updateLogMessages(env)
  }

  updateDataInformation (env) {
    const dataKeys = env.ui.userData.keys()
    let data = null
    let dataColumns = null
    let activeDataOption = null
    let formattedColumns = []
    // If the active data option no longer exists remove it. This happens
    // when the currently displayed table has been deleted or renamed.
    if (this.state.activeDataOption) {
      if (!(env.ui.userData.has(this.state.activeDataOption.label)
        || env.results.has(this.state.activeDataOption.label))){
        this.state.activeDataOption = null
      }
    }
    if (this.state.activeDataOption) {
      // Swap the stored data depending on whether we're showing userData or
      // results.
      if (this.state.activeDataOption.type == DATA_USER){
        data = env.ui.userData.get(this.state.activeDataOption.label)['data']
        dataColumns = env.ui.userData.get(this.state.activeDataOption.label)['columns']
        dataColumns.forEach(c => formattedColumns.push({key: c, name: c, sortable: true, resizable: true}))
      } else if (this.state.activeDataOption.type == DATA_REPORT){
        data = env.results.get(this.state.activeDataOption.label)['data']
        dataColumns = env.results.get(this.state.activeDataOption.label)['columns']
        dataColumns.forEach(c => formattedColumns.push({key: c, name: c, sortable: true, resizable: true}))
      }
      activeDataOption = this.state.activeDataOption
    } else {
      let result = dataKeys.next()
      if (!result.done){
        activeDataOption = {value: DATA_USER + '_' + result.value, type: DATA_USER, label: result.value}
        data = env.ui.userData.get(activeDataOption.label)['data']
        dataColumns = env.ui.userData.get(activeDataOption.label)['columns']
        dataColumns.forEach(c => formattedColumns.push({key: c, name: c, sortable: true, resizable: true}))
      }
    }
    let dataOptions = []
    for (let key of env.ui.userData.keys()){
      dataOptions.push({value: DATA_USER + '_' + key, type: DATA_USER, label: key})
    }
    for (let key of env.results.keys()){
      dataOptions.push({value: DATA_REPORT + '_' + key, type: DATA_REPORT, label: key})
    }
    // Indicate the tab was updated if it has been.
    let tabUpdated = this.state.tabUpdated
    if (data && data != this.state.data && this.state.tabValue != this.state.DATA_TAB_INDEX){
      tabUpdated.data = true
    }
    this.setState({dataKeys:dataKeys, data: data, dataColumns: formattedColumns,
      activeDataOption: activeDataOption, dataOptions: dataOptions,
      tabUpdated: tabUpdated})
  }

  updatePlotInformation (env) {
    const plotKeys = env.plots.keys()
    let plotData = null
    let activePlotOption = null

    // If there's a current activePlotOption try to load it. Otherwise get the
    // first plot provided by env.
    if (this.state.activePlotOption) {
      if (env.plots.has(this.state.activePlotOption.value)){
        plotData = env.plots.get(this.state.activePlotOption.value)
        activePlotOption = this.state.activePlotOption
      }
    } else {
      let result = plotKeys.next()
      if (!result.done){
        activePlotOption = {'value': result.value, 'label': result.value}
        plotData = env.plots.get(activePlotOption.value)
      }
    }

    let plotOptions = []
    for (let key of env.plots.keys()){
      plotOptions.push({value: key, label: key})
    }
    // Indicate the tab was updated if it has been.
    let tabUpdated = this.state.tabUpdated
    if (plotData && plotData != this.state.plotData && this.state.tabValue != this.state.PLOT_TAB_INDEX){
      tabUpdated.plot = true
    }
    this.setState({env: env, plotKeys:plotKeys, plotData: plotData,
      activePlotOption: activePlotOption, plotOptions: plotOptions,
      tabUpdated: tabUpdated}, () => {
      this.updatePlot()
    })
  }

  // Updates Stats information.
  updateStatsInformation (env) {
    const statsKeys = env.stats.keys()
    let stats = null
    let statsColumns = null
    let activeStatsOption = null
    let STATS_COLUMNS = [{key: "name", name: "name", sortable: true, resizable: true},
      {key: "result", name: "result", sortable: true, resizable: true}]

    if (this.state.activeStatsOption) {
      if (env.stats.has(this.state.activeStatsOption.value)){
        stats = [{'name': this.state.activeStatsOption.value,
          'result': env.stats.get(this.state.activeStatsOption.value)}]
        activeStatsOption = this.state.activeStatsOption
      }
    } else {
      let result = statsKeys.next()
      if (!result.done){
        activeStatsOption = {'value': result.value, 'label': result.value}
        stats = [{'name': result.value, 'result': env.stats.get(activeStatsOption.value)}]
      }
    }

    let statsOptions = []
    for (let key of env.stats.keys()){
      statsOptions.push({value: key, label: key})
    }
    // Indicate the tab was updated if it has been.
    let tabUpdated = this.state.tabUpdated
    if (stats && stats != this.state.stats && this.state.tabValue != this.state.STATS_TAB_INDEX){
      tabUpdated.stats = true
    }
    this.setState({statsKeys:statsKeys, stats: stats, statsColumns: STATS_COLUMNS,
      activeStatsOption: activeStatsOption, statsOptions: statsOptions})
  }

  handleTabChange (event, newValue) {
    // Turn off tab indicators on the newly clicked tab.
    let tabUpdated = this.state.tabUpdated
    switch(newValue) {
      case this.state.DATA_TAB_INDEX:
        tabUpdated.data = false
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
    this.saveCsvNameDialog.current.handleClickOpen()
  }

  // Saves the current Blockly workspace to a file.
  saveWorkspace(){
    this.saveWorkspaceDialog.current.handleClickOpen()
  }

  // Saves the svg on the Blockly workspace to a file.
  saveSvg(){
    this.saveSvgDialog.current.handleClickOpen()
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
    this.refs.csvFileUploader.click()
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

  render () {
    const classes = withStyles(Tabs)
    const tabClasses = withStyles(Tab)
    const logMessages = (!this.state.logMessages) ?
          <li className="tb-log" key="message-0">No messages</li> :
          this.state.logMessages.map((msg, i) => {
            const key = `message-${i}`
            const cls = `tb-${msg[0]}`
            return (<li className={cls} key={key}><code>{msg[1]}</code></li>)
          })
    const logMessageList = <ul className="tb-messages">{logMessages}</ul>
    const dataDropdown = <DataTabSelect options={this.state.dataOptions}
      onChange={this.changeData} value={this.state.activeDataOption}/>
    const statsDropdown = <StatsTabSelect options={this.state.statsOptions}
      onChange={this.changeStats} value={this.state.activeStatsOption}/>
    const plotDropdown = <PlotTabSelect options={this.state.plotOptions}
      onChange={this.changePlot} value={this.state.activePlotOption}/>

    return (
      <div className="splitPaneWrapper">
        <MuiThemeProvider theme={theme}>
          <SaveCsvFormDialog ref={this.saveCsvNameDialog} data={this.state.data}/>
          { this.blocklyRef.current &&
            <>
              <SaveWorkspaceFormDialog ref={this.saveWorkspaceDialog} data={this.getWorkspace().state.workspace}/>
              <SaveSvgFormDialog ref={this.saveSvgDialog} data={this.getWorkspace().state.workspace}/>
            </>
          }

          <MenuBar runProgram={this.runProgram}
            loadCsvClick={this.loadCsvClick}
            loadWorkspaceClick={this.loadWorkspaceClick}
            saveWorkspace={this.saveWorkspace}
            saveData={this.saveData}
            saveSvg={this.saveSvg}/>
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
              secondaryPaneMinWidth="250px%"
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
                  workspaceDidChange={this.updateZoom}
                />
              </div>
              <div className="topRightPane">
                <div className={classes.root}>
                  <AppBar position="static" color="default" component={'span'}>
                    <Tabs component={'span'}
                      value={this.state.tabValue}
                      onChange={this.handleTabChange}
                      variant="scrollable"
                      scrollButtons="on"
                      indicatorColor="primary"
                      textColor="primary"
                      >
                      <Tab {...a11yProps(this.state.DATA_TAB_INDEX)}
                        label={
                          <p>
                            Data
                            {this.state.tabUpdated.data &&
                              <span className="dotIndicator defaultDotIndicator"></span>
                            }
                          </p>
                        }/>
                      <Tab {...a11yProps(this.state.STATS_TAB_INDEX)}
                        label={
                          <p>
                            Stats
                            {this.state.tabUpdated.stats &&
                              <span className="dotIndicator defaultDotIndicator"></span>
                            }
                          </p>
                        }/>
                      <Tab {...a11yProps(this.state.PLOT_TAB_INDEX)}
                        label={
                          <p>
                            Plot
                            {this.state.tabUpdated.plot &&
                              <span className="dotIndicator defaultDotIndicator"></span>
                            }
                          </p>
                        }/>
                      <Tab {...a11yProps(3)}
                        label={
                          <p>
                            Console
                            {this.state.tabUpdated.console && this.state.tabUpdated.console == this.state.CONSOLE_ERROR &&
                              <span class="dotIndicator errorDotIndicator"></span>
                            }
                            { this.state.tabUpdated.console && this.state.tabUpdated.console == this.state.CONSOLE_SUCCESS &&
                              <span class="dotIndicator successDotIndicator"></span>
                            }
                            { this.state.tabUpdated.console && this.state.tabUpdated.console == this.state.CONSOLE_WARNING &&
                              <span class="dotIndicator warningDotIndicator"></span>
                            }
                          </p>
                        }/>
                    </Tabs>
                  </AppBar>
                  <TabPanel value={this.state.tabValue} index={0} component="div">
                    <TabHeader
                      maximizePanel={this.maximizePanel}
                      minimizePanel={this.minimizePanel}
                      restorePanel={this.restorePanel}
                      selectDropdown={dataDropdown}/>
                    <div className="relativeWrapper">
                      <div className="">
                        <div className="dataWrapper">
                          {this.state.dataColumns &&
                            <DataGrid
                              ref={this.dataGridRef}
                              columns={this.state.dataColumns}
                              rows={this.state.data}
                              enableCellAutoFocus={false}
                              height={this.state.topRightPaneHeight}
                              onGridSort={this.sortRows}
                              />
                          }
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel value={this.state.tabValue} index={1}>
                    <TabHeader maximizePanel={this.maximizePanel}
                      minimizePanel={this.minimizePanel}
                      restorePanel={this.restorePanel}
                      selectDropdown={statsDropdown}/>
                    <div className="relativeWrapper">
                      <div className="absoluteWrapper">
                        <div className="dataWrapper">
                          {this.state.stats &&
                            <DataGrid
                              columns={this.state.statsColumns}
                              rows={this.state.stats}
                              enableCellAutoFocus={false}
                              height={this.state.topRightPaneHeight}
                              onGridSort={this.sortRows}
                              />
                          }
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel value={this.state.tabValue} index={2} component="div">
                    <TabHeader maximizePanel={this.maximizePanel}
                      minimizePanel={this.minimizePanel}
                      restorePanel={this.restorePanel}
                      selectDropdown={plotDropdown}/>
                    <div className="plotWrapper">
                      <div id="plotOutput" ref={this.plotOutputRef}></div>
                    </div>
                  </TabPanel>
                  <TabPanel value={this.state.tabValue} index={3}>
                    <TabHeader maximizePanel={this.maximizePanel}
                      minimizePanel={this.minimizePanel}
                      restorePanel={this.restorePanel}
                      />
                    {logMessageList}
                  </TabPanel>
                </div>
              </div>
          </Splitter>
        </MuiThemeProvider>
      </div>
    )
  }
}
