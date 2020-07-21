import ReactDOM from 'react-dom';
import React from 'react';
import SplitPane, {Pane} from 'react-split-pane';
import ReactBlocklyComponent from 'react-blockly';
import parseWorkspaceXml from 'react-blockly/src/BlocklyHelper.jsx';
import ConfigFiles from './blocklyContent.jsx';
// import DataGrid from 'react-data-grid';
// import 'react-data-grid/dist/react-data-grid.css';


// Temporary import to test tables.
// import colorData from '../../data/colors.js'

export class TidyBlocksApp extends React.Component{
    constructor(props){
      super(props);
      this.blocklyRef = React.createRef();

      this.state = {
        toolboxCategories: parseWorkspaceXml(this.props.toolbox)

      };

      this.paneResize = this.paneResize.bind(this);
    }

    workspaceDidChange(workspace){
      alert("hi")
      workspace.registerButtonCallback('myFirstButtonPressed', () => {
        alert('button is pressed');
      });
      const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
      document.getElementById('generated-xml').innerText = newXml;

      const code = Blockly.JavaScript.workspaceToCode(workspace);
      document.getElementById('code').value = code;
    }

    paneResize(){
      this.blocklyRef.current.resize()
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

              </Pane>
              <Pane className="bottomRightPane" initialSize="50%">This Pane has a minimum size of 200px. It's the bottom pane.</Pane>
            </SplitPane>

          </SplitPane>

        </div>
      )
    }
}
