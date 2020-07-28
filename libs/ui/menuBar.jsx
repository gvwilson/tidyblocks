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
  }

  render(){
    return (
      <React.Fragment>
        <Link id="downloadWorkspace">
          <MenuItem onClick={this.props.saveWorkspace}>
              Save Workspace
          </MenuItem>
        </Link>
        <Link id="downloadData">
          <MenuItem onClick={this.props.saveData}>Save Data</MenuItem>
        </Link>
      </React.Fragment>
    )
  }
}

class HelpMenuItems extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return (
      <React.Fragment>
        <Link target="_blank" href="./guide">
          <MenuItem>Guide</MenuItem>
        </Link>
        <Link target="_blank" href="./license">
          <MenuItem>License</MenuItem>
        </Link>
        <Link target="_blank" href="./blog">
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

// Create a Menu Item for the top TidyBlocks bar.
function TidyBlocksMenuItem({name, icon, menuItems}) {
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
      <Tooltip title={name}>
      <IconButton
        aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
          {icon}
      </IconButton>
      </Tooltip>
      {menuItems &&
        <Menu
          id="fade-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}>
          { menuItems }
        </Menu>
      }
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

  render(){
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
              <TidyBlocksMenuItem name="Save"
                menuItems={<SaveMenuItems
                  saveWorkspace={this.props.saveWorkspace}
                  saveData={this.props.saveData}/>}
                icon={<SaveIcon className="menuIcon" />}/>
              <TidyBlocksMenuItem edge="start" name="Help" menuItems={<HelpMenuItems/>}
                icon={<HelpIcon className="menuIcon" />}/>
          </Toolbar>
        </AppBar>
        <Toolbar />
      </div>
    )
  }
}
