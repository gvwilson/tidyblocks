import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Link from '@material-ui/core/Link'

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
      csvFileName: filename,
    }
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDownload = this.handleDownload.bind(this)
  }

  handleClickOpen () {
    this.setState({open: true})
  }

  handleClose () {
    this.setState({open: false})
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
    const filename = this.state.csvFileName
    let link = document.getElementById('downloadData')
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv))
    link.setAttribute('download', filename)
  }

  render () {
    return (
      <div>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Save Data</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the file name for your data file.
            </DialogContentText>
            <TextField
              autoFocus
              required id="standard-required"
              margin="dense"
              id="name"
              label="Data File Name"
              type="text"
              value={this.state.csvFileName}
              fullWidth
              onChange={event => {
                const { value } = event.target
                this.setState({ csvFileName: value })
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Link id="downloadData">
              <Button onClick={() => this.handleDownload(this.props.data)} color="primary" >
                Download
              </Button>
            </Link>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}
