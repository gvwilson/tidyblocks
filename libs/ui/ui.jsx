import ReactDOM from 'react-dom';
import React, {useState} from 'react';
import SplitPane, {Pane} from 'react-split-pane';
import ReactBlocklyComponent from 'react-blockly';
import parseWorkspaceXml from 'react-blockly/src/BlocklyHelper.jsx';
import ConfigFiles from './blocklyConfig.jsx';
import ReactDataGrid from 'react-data-grid';
import colorData from '../../data/earthquakes.js'

// Temporary test data for ReactDataGrid.
const columns = [{ key: 'Time', name: 'Time', sortable: true, resizable: true},
  { key: 'Latitude', name: 'Latitude', sortable: true, resizable: true },
  { key: 'Longitude', name: 'Longitude', sortable: true, resizable: true },
  { key: 'Depth_Km', name: 'Depth_Km', sortable: true, resizable: true },
  { key: 'Magnitude', name: 'Magnitude', sortable: true, resizable: true }
];
const initialRows = colorData

// https://codesandbox.io/s/54pk3r46o4?from-embed=&file=/src/index.js
// Create a table with sortable columns.
const Grid = () => {
  const [rows, setRows] = useState(initialRows);
  const rowGetter = rowNumber => rows[rowNumber];

  const sortRows = (initialRows, sortColumn, sortDirection) => rows => {
    const comparer = (a, b) => {
      if (sortDirection === "ASC") {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else if (sortDirection === "DESC") {
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      }
    };
    return sortDirection === "NONE" ? initialRows : [...rows].sort(comparer);
  };

  return (<ReactDataGrid
    columns={columns}
    rowGetter={rowGetter}
    rowsCount={rows.length}
    minHeight={500}
    onGridSort={(sortColumn, sortDirection) =>
      setRows(sortRows(rows, sortColumn, sortDirection))
    }
    />)
}

// The main TidyBlocks App UI. Contains resizable panes for the Blockly section,
// tabs for data display/plotting/logs.
export class TidyBlocksApp extends React.Component{
    constructor(props){
      super(props);
      this.blocklyRef = React.createRef();
      this.state = {
        toolboxCategories: parseWorkspaceXml(this.props.toolbox)
      };
      this.paneResize = this.paneResize.bind(this);
      this.updatePlot = this.updatePlot.bind(this);

    }

    paneResize(){
      this.blocklyRef.current.resize()
    }

    updatePlot (spec) {
      spec.width = FULL_PLOT_SIZE.width
      spec.height = FULL_PLOT_SIZE.height
      vegaEmbed('#plotOutput', spec, {})
    }

    render(){
      return (
        <div >
          <h1>Hello, TidyBlocks!</h1>
          <SplitPane className="splitPaneWrapper"
            split="vertical" defaultSize={"50%"} primary="second"
            onDragFinished={this.paneResize}
            minSize="200px">
          <ReactBlocklyComponent.BlocklyEditor
            ref={this.blocklyRef}
            toolboxCategories={this.state.toolboxCategories}
            workspaceConfiguration={this.props.settings}
            wrapperDivClassName="fill-height"

          />

            <SplitPane split="horizontal" defaultSize={"50%"} minSize="200px">
              <Pane className="topRightPane" initialSize="50%">
              <Grid
                />

              </Pane>
              <Pane className="bottomRightPane" initialSize="50%">This Pane has a minimum size of 200px. It's the bottom pane.</Pane>
            </SplitPane>

          </SplitPane>

        </div>
      )
    }
}
