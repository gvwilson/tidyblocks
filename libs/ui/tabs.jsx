import ReactDOM from 'react-dom'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Grid from "@material-ui/core/Grid"
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Container from "@material-ui/core/Container"
import Tooltip from '@material-ui/core/Tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowMaximize, faWindowMinimize, faWindowRestore, faChartBar,
  faTable } from '@fortawesome/free-solid-svg-icons'
import { Animated } from "react-animated-css"
import DataGrid from 'react-data-grid'

export const TabPanel = (props) => {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={"div"}>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

export const a11yProps = (index) => {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  }
}

export function TabHeader (props) {
  return(
    <Paper>
    <Grid container alignContent="center" alignItems="center" spacing={0}>
      <Grid item xs={7}>
        <Grid container spacing={0}>
          {props.selectDropdown}
        </Grid>
      </Grid>
      <Grid item xs={5}>
        <Grid container justify="flex-end" spacing={1}>
          <Tooltip title={"Minimize Panel"}>
            <Grid item className="resizeIconGrid" onClick={props.minimizePanel}>
              <FontAwesomeIcon className="resizeIcon"icon={faWindowMinimize} />
            </Grid>
          </Tooltip>
          <Tooltip title={"Maximize Panel"}>
            <Grid item className="resizeIconGrid" onClick={props.maximizePanel}>
              <FontAwesomeIcon className="resizeIcon"icon={faWindowMaximize} />
            </Grid>
          </Tooltip>
          <Tooltip title={"Restore Panel"}>
            <Grid item className="resizeIconGrid" onClick={props.restorePanel}>
              <FontAwesomeIcon className="resizeIcon"icon={faWindowRestore} />
            </Grid>
          </Tooltip>
        </Grid>
      </Grid>
    </Grid>
    </Paper>
  )
}
export function TabSelectionBar (props) {
  return(
    <Tabs component={'span'}
      value={props.tabValue}
      onChange={props.handleTabChange}
      variant="scrollable"
      scrollButtons="on"
      indicatorColor="primary"
      textColor="primary"
      >
      <Tab {...a11yProps(props.dataIndex)}
        label={
          <div className="tabWrapper">
            <span className="dotPadding"></span>
            Data
            <Animated
              animationIn="fadeIn"
              animationOut="fadeOut"
              animateOnMount={false}
              isVisible={props.tabUpdated.data}>
                <span className="dotIndicator defaultDotIndicator"></span>
            </Animated>
          </div>
        }/>
        <Tab {...a11yProps(props.resultsIndex)}
          label={
            <div className="tabWrapper">
              <span className="dotPadding"></span>
              Results
              <Animated
                animationIn="fadeIn"
                animationOut="fadeOut"
                animateOnMount={false}
                isVisible={props.tabUpdated.results}>
                  <span className="dotIndicator defaultDotIndicator"></span>
              </Animated>
            </div>
          }/>
      <Tab {...a11yProps(props.statsIndex)}
        label={
          <div className="tabWrapper">
            <span className="dotPadding"></span>
            Stats
            <Animated
              animationIn="fadeIn"
              animationOut="fadeOut"
              animateOnMount={false}
              isVisible={props.tabUpdated.stats}>
                <span className="dotIndicator defaultDotIndicator"></span>
            </Animated>
          </div>
        }/>
      <Tab {...a11yProps(props.plotIndex)}
        label={
          <div className="tabWrapper">
            <span className="dotPadding"></span>
            Plot
            <Animated
              animationIn="fadeIn"
              animationOut="fadeOut"
              animateOnMount={false}
              isVisible={props.tabUpdated.plot}>
                <span className="dotIndicator defaultDotIndicator"></span>
            </Animated>
          </div>
        }/>
      <Tab {...a11yProps(3)}
        label={
          <div className="tabWrapper">
            <span className="dotPadding"></span>
            Console
            <Animated
              animationIn="fadeIn"
              animationOut="fadeOut"
              animateOnMount={false}
              >
                <span className={props.consoleDotClass}></span>
            </Animated>
          </div>
        }/>
    </Tabs>
  )
}

export function TabPanels (props) {
  return(
    <>
      <TabPanel value={props.tabValue} index={0} component="div">
        <TabHeader
          maximizePanel={props.maximizePanel}
          minimizePanel={props.minimizePanel}
          restorePanel={props.restorePanel}
          selectDropdown={props.dataDropdown}/>
        <Animated
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInDuration={800}
          animationOutDuration={800}
          >
          <div className="relativeWrapper">
            <div className="dataWrapper">
              {props.dataColumns &&
                <Animated
                  animationIn="fadeIn"
                  animationOut="fadeOut"
                  animationInDuration={800}
                  animationOutDuration={800}
                  isVisible={!props.hideDataTable}>
                  <DataGrid
                    ref={props.dataGridRef}
                    columns={props.dataColumns}
                    rows={props.data}
                    enableCellAutoFocus={false}
                    height={props.topRightPaneHeight}
                    onGridSort={props.sortRows}
                    />
                </Animated>
              }
            </div>
          </div>
        </Animated>
      </TabPanel>
      <TabPanel value={props.tabValue} index={1} component="div">
        <TabHeader
          maximizePanel={props.maximizePanel}
          minimizePanel={props.minimizePanel}
          restorePanel={props.restorePanel}
          selectDropdown={props.resultsDropdown}/>
        <Animated
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInDuration={800}
          animationOutDuration={800}
          >
          <div className="relativeWrapper">
            <div className="dataWrapper">
              {props.resultColumns &&
                <Animated
                  animationIn="fadeIn"
                  animationOut="fadeOut"
                  animationInDuration={800}
                  animationOutDuration={800}
                  isVisible={!props.hideResultTable}>
                  <DataGrid
                    ref={props.resultGridRef}
                    columns={props.resultColumns}
                    rows={props.results}
                    enableCellAutoFocus={false}
                    height={props.topRightPaneHeight}
                    onGridSort={props.sortRows}
                    />
                </Animated>
              }
            </div>
          </div>
        </Animated>
      </TabPanel>
      <TabPanel value={props.tabValue} index={2}>
        <TabHeader maximizePanel={props.maximizePanel}
          minimizePanel={props.minimizePanel}
          restorePanel={props.restorePanel}
          selectDropdown={props.statsDropdown}/>
        <Animated
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInDuration={800}
          animationOutDuration={800}>
          {props.stats ?
            <div className="relativeWrapper">
              <div className="absoluteWrapper">
                <div className="dataWrapper">
                  <Animated
                    animationIn="fadeIn"
                    animationOut="fadeOut"
                    animationInDuration={800}
                    animationOutDuration={800}
                    isVisible={!props.hideStatsTable}>
                    <DataGrid
                      columns={props.statsColumns}
                      rows={props.stats}
                      enableCellAutoFocus={false}
                      height={props.topRightPaneHeight}
                      onGridSort={props.sortRows}
                      />
                  </Animated>
                </div>
              </div>
            </div>
          :
            <div className="relativeWrapper">
              <div className="emptyPanelWrapper">
                <FontAwesomeIcon className="panelIcon"icon={faTable} />
                <p className="emptyPanelText">You aren't currently displaying any stats.</p>
                <p className="emptyPanelText"> To learn more about getting started visit&nbsp;<a href="/guide/" className="guideLink">our guide</a>.
                </p>
              </div>
            </div>
          }
        </Animated>
      </TabPanel>
      <TabPanel value={props.tabValue} index={3} component="div">
        <TabHeader maximizePanel={props.maximizePanel}
          minimizePanel={props.minimizePanel}
          restorePanel={props.restorePanel}
          selectDropdown={props.plotDropdown}/>
        <Animated
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInDuration={800}
          animationOutDuration={800}>
          <div className="plotWrapper">
            { !props.plotData &&
              <div className="relativeWrapper">
                <div className="emptyPanelWrapper">
                  <FontAwesomeIcon className="panelIcon"icon={faChartBar} />
                  <p className="emptyPanelText">You aren't currently displaying any plots.</p>
                  <p className="emptyPanelText"> To learn more about getting started visit&nbsp;<a href="/guide/" className="guideLink">our guide</a>.
                  </p>
                </div>
              </div>
            }
            <div id="plotOutput" className={props.isDraggingPane ? '' : "plotOutputFade"}
              ref={props.plotOutputRef}></div>
          </div>
        </Animated>
      </TabPanel>
      <TabPanel value={props.tabValue} index={4}>
        <TabHeader maximizePanel={props.maximizePanel}
          minimizePanel={props.minimizePanel}
          restorePanel={props.restorePanel}
          />
        <Animated
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInDuration={800}
          animationOutDuration={800}>
          {props.logMessageList}
        </Animated>
      </TabPanel>
    </>
  )
}
