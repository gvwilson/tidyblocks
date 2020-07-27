import ReactDOM from 'react-dom'
import React, {useState} from 'react'
import { createStyles, withStyles, makeStyles, withTheme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
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

// Menu Items to display for the Save button.
function SaveMenuItems(){

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <React.Fragment>
      <MenuItem onClick={handleClose}>Save Workspace</MenuItem>
      <MenuItem onClick={handleClose}>Save Data</MenuItem>
      <MenuItem onClick={handleClose}>Save Plot</MenuItem>
    </React.Fragment>
  )
}

const useStyles = makeStyles({
  root: {
    fontSize: '20px',
  },
  label: {
    fontSize: '12px',
  },
});

function TidyBlocksButtonItem({name, icon, handleClick}) {
  const classes = useStyles();

  return (
    <div>
      <Tooltip title={name}>
      <Button
        classes={{
          root: classes.root, // class name, e.g. `classes-nesting-root-x`
          label: classes.label, // class name, e.g. `classes-nesting-label-x`
        }}
        className="tbMenuButton" aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
          {icon}
      </Button>
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
  const classes = useStyles();

  return (
    <div>
      <Tooltip title={name}>
      <Button
        classes={{
          root: classes.root, // class name, e.g. `classes-nesting-root-x`
          label: classes.label, // class name, e.g. `classes-nesting-label-x`
        }}
        aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
          {icon}
      </Button>
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

    this.handleDrawerToggle = this.handleDrawerToggle.bind(this)
  }

  handleDrawerToggle() {
    console.log("here")
    console.log(this.state.mobileOpen)

    const mobileOpen = this.state.mobileOpen
    this.setState({mobileOpen: !mobileOpen})
    // setMobileOpen(!mobileOpen)
  }

  render(){
    const classes = withStyles(MenuBar)
    const theme = withTheme(MenuBar)

    // const [mobileOpen, setMobileOpen] = React.useState(false)
    const drawer = (
      <div>
      <List>
        <p> Todo: Icons/prettify</p>
        <ListItem button>
          <ListItemText primary="Guide" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="License" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="About" />
        </ListItem>
      </List>
      </div>
    )


    return (
      <React.Fragment>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton edge="start" onClick={this.handleDrawerToggle}
              className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Box display='flex' flexGrow={1}>
            <Typography variant="h6" className={classes.title}>
              TidyBlocks
            </Typography>
            </Box>
              <TidyBlocksButtonItem name="Run" icon={<PlayArrowIcon
                className="menuIcon" />} handleClick={this.props.runProgram}/>
              <TidyBlocksButtonItem name="Load Workspace"
                icon={<PublishIcon className="menuIcon" />} 
                handleClick={this.props.loadWorkspaceClick}/>
              <TidyBlocksButtonItem name="Load CSV"
                icon={<TableChartIcon className="menuIcon" />}
                handleClick={this.props.loadCsvClick}/>
              <TidyBlocksMenuItem name="Save" menuItems={<SaveMenuItems/>}
                icon={<SaveIcon className="menuIcon" />}/>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <nav className={classes.drawer}>
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true,
              }}
            >
              <IconButton onClick={this.handleDrawerToggle} className={classes.closeMenuButton}>
                <CloseIcon/>
              </IconButton>
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
      </React.Fragment>
    )
  }
}
