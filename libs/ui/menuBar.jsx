import ReactDOM from 'react-dom'
import React, {useState} from 'react'
import { createStyles, makeStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import HelpIcon from '@material-ui/icons/Help';
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Fade from '@material-ui/core/Fade'
import SaveIcon from '@material-ui/icons/Save'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PublishIcon from '@material-ui/icons/Publish'
import TableChartIcon from '@material-ui/icons/TableChart'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import CssBaseline from '@material-ui/core/CssBaseline'
import Hidden from '@material-ui/core/Hidden'
import CloseIcon from '@material-ui/icons/Close'
import Tooltip from '@material-ui/core/Tooltip';
import Link from '@material-ui/core/Link';

// Menu Items to display for the Save button.
class SaveMenuItems extends React.Component{
  constructor(props){
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (buttonCallback) {
    this.props.onClose()
    buttonCallback()
  }

  render () {
    return (
      <React.Fragment>
        <Link >
          <MenuItem onClick={() => this.handleClick(this.props.saveWorkspace)}>
            Save Workspace
          </MenuItem>
        </Link>
        <Link>
          <MenuItem onClick={() => this.handleClick(this.props.saveData)}>
            Save Data</MenuItem>
        </Link>
        <Link>
          <MenuItem onClick={() => this.handleClick(this.props.saveSvg)}>
            Save Svg</MenuItem>
        </Link>
      </React.Fragment>
    )
  }
}

class HelpMenuItems extends React.Component{
  constructor(props){
    super(props)
  }

  render () {
    return (
      <React.Fragment>
        <Link target="_blank" href="./guide" onClick={this.props.onClose}>
          <MenuItem>Guide</MenuItem>
        </Link>
        <Link target="_blank" href="./license" onClick={this.props.onClose}>
          <MenuItem>License</MenuItem>
        </Link>
        <Link target="_blank" href="./blog" onClick={this.props.onClose}>
          <MenuItem>Blog</MenuItem>
        </Link>
      </React.Fragment>
    )
  }
}

function TidyBlocksButtonItem({name, icon, handleClick}) {
  return (
    <div>
      <Tooltip title={name}>
      <IconButton
        className="tbMenuButton" aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
          {icon}
      </IconButton>
      </Tooltip>
    </div>
  )
}

function MenuItemsButton ({name, icon, handleClick}) {
  return (
    <Tooltip title={name}>
    <IconButton
      aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
        {icon}
    </IconButton>
    </Tooltip>
  )
}

// Create the Save items for the top TidyBlocks bar.
function TidyBlocksSaveMenuItems({name, icon, menuItems, saveWorkspace, saveData, saveSvg}) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <MenuItemsButton name={name} icon={icon} handleClick={handleClick}/>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}>
        <SaveMenuItems
          onClose={handleClose}
          saveWorkspace={saveWorkspace}
          saveData={saveData}
          saveSvg={saveSvg}/>
      </Menu>
    </div>
  )
}

// Create the Help Items for the top TidyBlocks bar.
function TidyBlocksHelpMenuItems({name, icon, menuItems}) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <MenuItemsButton name={name} icon={icon} handleClick={handleClick}/>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}>
        <HelpMenuItems onClose={handleClose}/>
      </Menu>
    </div>
  )
}


// Defines the top level menu bar for the page.
export class MenuBar extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      mobileOpen: false,
    }
  }

  render () {
    const filename = 'TbDataFrame_' + new Date().toLocaleDateString() + '.csv';

    return (
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <Box display='flex' flexGrow={1}>
            <Typography variant="h6">
              TidyBlocks
            </Typography>
            </Box>
              <TidyBlocksButtonItem name="Run"
                icon={<PlayArrowIcon className="menuIcon"/>}
                handleClick={this.props.runProgram}/>
              <TidyBlocksButtonItem name="Load Workspace"
                icon={<PublishIcon className="menuIcon" />}
                handleClick={this.props.loadWorkspaceClick}/>
              <TidyBlocksButtonItem name="Load CSV"
                icon={<TableChartIcon className="menuIcon" />}
                handleClick={this.props.loadCsvClick}/>
              <TidyBlocksSaveMenuItems name="Save"
                saveWorkspace={this.props.saveWorkspace}
                saveData={this.props.saveData}
                saveSvg={this.props.saveSvg}
                icon={<SaveIcon className="menuIcon" />}/>
              <TidyBlocksHelpMenuItems edge="start" name="Help"
                icon={<HelpIcon className="menuIcon" />}/>
          </Toolbar>
        </AppBar>
        <Toolbar />
      </div>
    )
  }
}
