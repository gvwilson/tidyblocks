import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Link from '@material-ui/core/Link'
import Blockly from 'blockly/blockly_compressed'

function SaveDialog (props) {
  return (
    <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {props.contentText}
        </DialogContentText>
        <TextField
          autoFocus
          required id="standard-required"
          margin="dense"
          id="name"
          label="Data File Name"
          type="text"
          value={props.filename}
          fullWidth
          onChange={(evt) => props.handleFilenameChange(evt)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
          Cancel
        </Button>
        <Link id={props.linkId}>
          <Button onClick={() => props.handleDownload(props.data)} color="primary" >
            Download
          </Button>
        </Link>
      </DialogActions>
    </Dialog>
  )
}

export class SaveCsvFormDialog extends React.Component{
  constructor(props) {
    super(props)
    const dateObj = new Date()
    const month = dateObj.getUTCMonth() + 1
    const day = dateObj.getUTCDate()
    const year = dateObj.getUTCFullYear()
    const filename = 'data_' + year + '_' + month + '_' + day + '.csv'

    this.state = {
      open: false,
      filename: filename,
      linkId: 'downloadData',
      title: 'Save CSV Data',
      contentText: 'Enter the name for your data file.'
    }
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDownload = this.handleDownload.bind(this)
    this.handleFilenameChange = this.handleFilenameChange.bind(this)
  }

  handleClickOpen () {
    this.setState({open: true})
  }

  handleClose () {
    this.setState({open: false})
  }

  handleFilenameChange (evt) {
    const value = evt.target.value
    this.setState({ filename: value })
  }

  handleDownload (data){
    const fields = Object.keys(data[0])
    const replacer = function(key, value) { return value === null ? '' : value }
    let csv = data.map(function(row){
      return fields.map(function(fieldName){
        return JSON.stringify(row[fieldName], replacer)
      }).join(',')
    })
    csv.unshift(fields.join(',')) // add header column
    csv = csv.join('\r\n')
    const filename = this.state.filename
    let link = document.getElementById('downloadData')
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv))
    link.setAttribute('download', filename)
    this.handleClose()
  }

  render () {
    return (
      <div>
        <SaveDialog
          open={this.state.open}
          title={this.state.title}
          handleClose={this.handleClose}
          handleDownload={this.handleDownload}
          handleFilenameChange={this.handleFilenameChange}
          contentText={this.state.contentText}
          linkId={this.state.linkId}
          filename={this.state.filename}
          data={this.props.data}/>
      </div>
    )
  }
}

export class SaveWorkspaceFormDialog extends React.Component{
  constructor(props) {
    super(props)
    const dateObj = new Date()
    const month = dateObj.getUTCMonth() + 1
    const day = dateObj.getUTCDate()
    const year = dateObj.getUTCFullYear()
    const filename = 'workspace_' + year + '_' + month + '_' + day + '.jeff'

    this.state = {
      open: false,
      filename: filename,
      linkId: 'downloadWorkspace',
      title: 'Save Workspace',
      contentText: 'Enter the name for your workspace file.'
    }
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDownload = this.handleDownload.bind(this)
    this.handleFilenameChange = this.handleFilenameChange.bind(this)
  }

  handleClickOpen () {
    this.setState({open: true})
  }

  handleClose () {
    this.setState({open: false})
  }

  handleFilenameChange (evt) {
    const value = evt.target.value
    this.setState({ filename: value })
  }

  handleDownload (data){
    const workspace = data
    const xml = Blockly.Xml.workspaceToDom(workspace)
    const text = Blockly.Xml.domToText(xml)
    const link = document.getElementById('downloadWorkspace')
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    link.setAttribute('download', this.state.filename)
    this.handleClose()
  }

  render () {
    return (
      <div>
        <SaveDialog
          open={this.state.open}
          title={this.state.title}
          handleClose={this.handleClose}
          handleDownload={this.handleDownload}
          handleFilenameChange={this.handleFilenameChange}
          contentText={this.state.contentText}
          linkId={this.state.linkId}
          filename={this.state.filename}
          data={this.props.data}/>
      </div>
    )
  }
}

export class SaveSvgFormDialog extends React.Component{
  constructor(props) {
    super(props)
    const dateObj = new Date()
    const month = dateObj.getUTCMonth() + 1
    const day = dateObj.getUTCDate()
    const year = dateObj.getUTCFullYear()
    const filename = 'svg_' + year + '_' + month + '_' + day + '.svg'

    this.state = {
      open: false,
      filename: filename,
      linkId: 'downloadSvg',
      title: 'Save Svg',
      contentText: 'Enter the name for your svg file.'
    }
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDownload = this.handleDownload.bind(this)
    this.handleFilenameChange = this.handleFilenameChange.bind(this)
  }

  handleClickOpen () {
    this.setState({open: true})
  }

  handleClose () {
    this.setState({open: false})
  }

  handleFilenameChange (evt) {
    const value = evt.target.value
    this.setState({ filename: value })
  }

  handleDownload (workspace){
    const canvas = workspace.svgBlockCanvas_.cloneNode(true)
    canvas.removeAttribute("transform");
    let themeCss = document.getElementById("blockly-renderer-style-geras-tidyblocks").innerHTML
    // Theme name isn't inserted on our pulled svg so we remove it.
    themeCss = themeCss.replace(/.geras-renderer.tidyblocks-theme/g, '')
    // Default blockly css.
    let blocklyCss = document.getElementById("blockly-common-style").innerHTML
    const css = `<defs><style type="text/css">` + themeCss + blocklyCss + `</style></defs>`
    const bboxElement = document.getElementsByClassName("blocklyBlockCanvas")[0];
    const bbox = bboxElement.getBBox();
    const content = new XMLSerializer().serializeToString(canvas);
    const xml = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${
      bbox.width}" height="${bbox.height}" viewBox=" ${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}">${
      css}">${content}</svg>`
    const blob = new Blob([xml])
    const link = document.getElementById('downloadSvg')
    link.setAttribute('href', URL.createObjectURL(blob))
    link.setAttribute('download', this.state.filename)
    this.handleClose()
  }

  render () {
    return (
      <div>
        <SaveDialog
          open={this.state.open}
          title={this.state.title}
          handleClose={this.handleClose}
          handleDownload={this.handleDownload}
          handleFilenameChange={this.handleFilenameChange}
          contentText={this.state.contentText}
          linkId={this.state.linkId}
          filename={this.state.filename}
          data={this.props.data}/>
      </div>
    )
  }
}
