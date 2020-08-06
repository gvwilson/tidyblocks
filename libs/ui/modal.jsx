import React from 'react'
import Modal from '@material-ui/core/Modal'
import ReactMarkdown from 'react-markdown'


export class HelpModal extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      contents: '',
    }
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.update = this.update.bind(this)

  }

  handleOpen () {
    this.update()
    this.setState({open: true})
  }

  handleClose () {
    this.setState({open: false})
  }

  update(){
    fetch('/docs/modal/test.yml', {mode:'cors'}).then(response => response.text()).then(text => {
      console.log(text)
      this.setState({contents: text})
    })
  }

  render () {
    const body = (
      <div className="helpModal">
        <h2 id="simple-modal-title">Text in a modal</h2>
        <p id="simple-modal-description">
          <ReactMarkdown source={this.state.contents} />
        </p>
        <HelpModal />
      </div>
    )
    return (
      <Modal
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    )
  }
}
