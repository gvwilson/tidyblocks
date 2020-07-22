import ReactDOM from 'react-dom'
import React, {useState} from 'react'
import SplitPane from 'react-split-pane/lib/SplitPane'
import Pane from 'react-split-pane/lib/Pane'
import Resizer, { RESIZER_DEFAULT_CLASSNAME } from 'react-split-pane'
import ReactBlocklyComponent from 'react-blockly'
import parseWorkspaceXml from 'react-blockly/src/BlocklyHelper.jsx'
import DataGrid from 'react-data-grid';
import Grid from "@material-ui/core/Grid"
import Paper from '@material-ui/core/Paper'
import Container from "@material-ui/core/Container"
import {MenuBar} from './menuBar.jsx'
import Select from 'react-select'

// Temporary dummy options for selecting a dataset
const data_options = [
  { value: 'chocolate', label: 'Earthquake.csv' },
  { value: 'strawberry', label: 'Something Else' },
  { value: 'vanilla', label: 'And Another Thingy' }
]

const DataTabSelect = () => (
  <Select className="sourceSelect" classNamePrefix="sourceSelectInner" options={data_options}
    defaultValue={ data_options[0] }
  />
)

// Temporary dummy options for selecting a plot
const plot_options = [
  { value: 'chocolate', label: 'colours.csv' },
  { value: 'strawberry', label: 'Something Else' },
  { value: 'vanilla', label: 'And Another Thingy' }
]

const PlotTabSelect = () => (
  <Select className="sourceSelect" classNamePrefix="sourceSelectInner" options={plot_options}
    defaultValue={ plot_options[0] }
  />
)


// Temporary test data.
import earthquakeData from '../../data/earthquakes.js'
const boxPlotJson = {
  "data": {
    "values": [
      {
        "name": "black",
        "red": 0,
        "green": 0,
        "blue": 0
      },
      {
        "name": "red",
        "red": 255,
        "green": 0,
        "blue": 0
      },
      {
        "name": "maroon",
        "red": 128,
        "green": 0,
        "blue": 0
      },
      {
        "name": "lime",
        "red": 0,
        "green": 255,
        "blue": 0
      },
      {
        "name": "green",
        "red": 0,
        "green": 128,
        "blue": 0
      },
      {
        "name": "blue",
        "red": 0,
        "green": 0,
        "blue": 255
      },
      {
        "name": "navy",
        "red": 0,
        "green": 0,
        "blue": 128
      },
      {
        "name": "yellow",
        "red": 255,
        "green": 255,
        "blue": 0
      },
      {
        "name": "fuchsia",
        "red": 255,
        "green": 0,
        "blue": 255
      },
      {
        "name": "aqua",
        "red": 0,
        "green": 255,
        "blue": 255
      },
      {
        "name": "white",
        "red": 255,
        "green": 255,
        "blue": 255
      }
    ]
  },
  "mark": {
    "type": "boxplot",
    "extent": 1.5
  },
  "encoding": {
    "x": {
      "field": "red",
      "type": "ordinal"
    },
    "y": {
      "field": "green",
      "type": "quantitative"
    }
  },
  "axisX": "red",
  "axisY": "green",
  "name": "box"
}


// Temporary test data for ReactDataGrid.
const columns = [{ key: 'Time', name: 'Time', sortable: true, resizable: true},
  { key: 'Latitude', name: 'Latitude', sortable: true, resizable: true },
  { key: 'Longitude', name: 'Longitude', sortable: true, resizable: true },
  { key: 'Depth_Km', name: 'Depth_Km', sortable: true, resizable: true },
  { key: 'Magnitude', name: 'Magnitude', sortable: true, resizable: true }
];
const initialRows = earthquakeData

// Size of standard plotting areas.
const FULL_PLOT_SIZE = {width: 500, height: 300}
const STATS_PLOT_SIZE = {width: 300, height: 150}

const TidyBlocksStatsTable = React.forwardRef((props, forwardedRef) => {
  class TidyBlocksStatsTable extends React.Component{

    constructor(props){
      super(props);
      this.state = {
        rows: initialRows,
      }
      this.sortRows = this.sortRows.bind(this)
    }

    // Sorts the rows of the table when the column headings are clicked.
    sortRows(initialRows, sortColumn, sortDirection){
      const comparer = (a, b) => {
        if (sortDirection === "ASC") {
          return a[sortColumn] > b[sortColumn] ? 1 : -1;
        } else if (sortDirection === "DESC") {
          return a[sortColumn] < b[sortColumn] ? 1 : -1;
        }
      };
      if (sortDirection === "NONE"){
        this.setState({rows: initialRows});
      } else{
        this.setState({rows: [...this.state.rows].sort(comparer)});
      }
    }

    render(){
      const rowGetter = rowNumber => this.state.rows[rowNumber]
      let tableHeight = '200px'
      if (this.props.tableHeight){
        tableHeight = this.props.tableHeight
      }
      return (
        <DataGrid
          ref={forwardedRef}
          columns={columns}
          rowGetter={rowNumber => this.state.rows[rowNumber]}
          rowsCount={this.state.rows.length}
          enableCellAutoFocus={false}
          minHeight={tableHeight}
          onGridSort={(sortColumn, sortDirection) =>
            this.sortRows(this.state.rows, sortColumn, sortDirection)
          }/>
      )
    }
  }
  return (<TidyBlocksStatsTable tableHeight={props.tableHeight} />)
})

// The main TidyBlocks App UI. Contains resizable panes for the Blockly section,
// tabs for data display/plotting/logs.
export class TidyBlocksApp extends React.Component{
  constructor(props){
    super(props);
    this.blocklyRef = React.createRef();
    this.bottomRightPaneRef = React.createRef();
    this.dataGridRef = React.createRef();

    this.state = {
      topRightPaneHeight: '200px',
      toolboxCategories: parseWorkspaceXml(this.props.toolbox),
    };
    this.paneVerticalResize = this.paneVerticalResize.bind(this);
    this.paneHorizontalResize = this.paneHorizontalResize.bind(this);
    this.updatePlot = this.updatePlot.bind(this);
    this.updateTopRightPaneHeight = this.updateTopRightPaneHeight.bind(this);

  }

  componentDidMount() {
    this.updatePlot ()
    this.updateTopRightPaneHeight()
  }

  // Returns the workspace for use by our JavaScript code.
  getWorkspace(){
    return this.blocklyRef.current.workspace
  }

  // Handles a change in the vertical divider postion.
  paneVerticalResize(){
    this.dataGridRef.current.metricsUpdated()
    this.blocklyRef.current.resize()
    this.updatePlot()
  }

  // Updates the height of the topRightPane. This allows our ReactDataGrid to
  // update it's height.
  updateTopRightPaneHeight(){
    const topRightPane = ReactDOM.findDOMNode(this).querySelector('.topRightPane')
    const TOP_RIGHT_HEIGHT_OFFSET = 90
    if (topRightPane){
      const topRightPaneHeight = (topRightPane.offsetHeight - TOP_RIGHT_HEIGHT_OFFSET).toString() + 'px'
      this.setState({topRightPaneHeight: topRightPaneHeight})
    }
  }

  //Handles a change in the horizontal divider position.
  paneHorizontalResize(){
    this.updatePlot()
    this.updateTopRightPaneHeight()
  }

  // Updates the plot vega drawing.
  updatePlot() {

    // Would be nice to use a ref instead of querying the DOM directly. Panes
    // don't seem to give an offsetWidth though. The alternative would involve
    // computing window sizes (on pane drag or window resize) from
    // percentages.
    const bottomRightPane = ReactDOM.findDOMNode(this).querySelector('.bottomRightPane')
    const WIDTH_OFFSET = 120
    const HEIGHT_OFFSET = 150
    if (bottomRightPane){
      boxPlotJson.width = bottomRightPane.offsetWidth - WIDTH_OFFSET
      boxPlotJson.height = bottomRightPane.offsetHeight - HEIGHT_OFFSET
    }
    vegaEmbed('#plotOutput', boxPlotJson, {})
  }

  render(){
    return (
      <div >
        <MenuBar/>
        <SplitPane className="splitPaneWrapper"
          split="vertical"  primary="primary"
          onChange={this.paneVerticalResize}>
          <Pane minSize="200px">
            <ReactBlocklyComponent.BlocklyEditor
              ref={this.blocklyRef}
              toolboxCategories={this.state.toolboxCategories}
              workspaceConfiguration={this.props.settings}
              wrapperDivClassName="fill-height"
            />
          </Pane>
          <SplitPane split="horizontal" minSize="100px"
            primary="secondary" onChange={this.paneHorizontalResize}>
            <Pane className="topRightPane" minSize="100px" initialSize="50%">
            <div className="relativeWrapper">
              <div className="absoluteWrapper">
                <DataTabSelect />
                <div className="dataWrapper">
                  <TidyBlocksStatsTable ref={this.dataGridRef} tableHeight={this.state.topRightPaneHeight}/>
                </div>
              </div>
            </div>
            </Pane>
            <Pane ref={this.bottomRightPaneRef} id="bottomRightPane" className="bottomRightPane"
              minSize="100px" initialSize="50%">
              <PlotTabSelect/>
              <div className="plotWrapper">
                <div id="plotOutput"></div>
              </div>
            </Pane>
          </SplitPane>
        </SplitPane>
      </div>
    )
  }
}
