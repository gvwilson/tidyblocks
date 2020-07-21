import ReactDOM from 'react-dom'
import React, {useState} from 'react'
import SplitPane, {Pane} from 'react-split-pane'
import ReactBlocklyComponent from 'react-blockly'
import parseWorkspaceXml from 'react-blockly/src/BlocklyHelper.jsx'
import ConfigFiles from './blocklyConfig.jsx'
import ReactDataGrid from 'react-data-grid'

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
]
const initialRows = earthquakeData

// Size of standard plotting areas.
const FULL_PLOT_SIZE = {width: 500, height: 300}
const STATS_PLOT_SIZE = {width: 300, height: 150}

// https://codesandbox.io/s/54pk3r46o4?from-embed=&file=/src/index.js
// Create a table with sortable columns.
const Grid = () => {
  const [rows, setRows] = useState(initialRows)
  const rowGetter = rowNumber => rows[rowNumber]

  const sortRows = (initialRows, sortColumn, sortDirection) => rows => {
    const comparer = (a, b) => {
      if (sortDirection === "ASC") {
        return a[sortColumn] > b[sortColumn] ? 1 : -1
      } else if (sortDirection === "DESC") {
        return a[sortColumn] < b[sortColumn] ? 1 : -1
      }
    }
    return sortDirection === "NONE" ? initialRows : [...rows].sort(comparer)
  }

  return (
    <ReactDataGrid
      columns={columns}
      rowGetter={rowGetter}
      rowsCount={rows.length}
      minHeight={500}
      onGridSort={(sortColumn, sortDirection) =>
        setRows(sortRows(rows, sortColumn, sortDirection))
      }
    />
  )
}

// The main TidyBlocks App UI. Contains resizable panes for the Blockly section,
// tabs for data display/plotting/logs.
export class TidyBlocksApp extends React.Component{
  constructor (props) {
    super(props)
    this.blocklyRef = React.createRef()
    this.state = {
      toolboxCategories: parseWorkspaceXml(this.props.toolbox)
    }
    this.paneResize = this.paneResize.bind(this)
    this.updatePlot = this.updatePlot.bind(this)
  }
  
  componentDidMount() {
    this.updatePlot ()
  }

  paneResize(){
    this.blocklyRef.current.resize()
  }

  updatePlot () {
    boxPlotJson.width = FULL_PLOT_SIZE.width
    boxPlotJson.height = FULL_PLOT_SIZE.height
    vegaEmbed('#plotOutput', boxPlotJson, {})
  }

  render () {
    return (
        <div >
        <h1>TidyBlocks</h1>
        <SplitPane className="splitPaneWrapper"
          split="vertical" defaultSize={"50%"} primary="second"
          onDragFinished={this.paneResize}
          minSize="200px">

          <ReactBlocklyComponent.BlocklyEditor
            ref={this.blocklyRef}
            toolboxCategories={this.state.toolboxCategories}
            workspaceConfiguration={this.props.settings}
            wrapperDivClassName="fill-height" />

          <SplitPane split="horizontal" defaultSize={"50%"} minSize="200px">
            <Pane className="topRightPane" initialSize="50%">
              <Grid />
            </Pane>
            <Pane className="bottomRightPane" initialSize="50%">
              <div id="plotOutput"></div>
            </Pane>
          </SplitPane>
        </SplitPane>
      </div>
    )
  }
}
