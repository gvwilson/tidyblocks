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
  faTable, faDatabase } from '@fortawesome/free-solid-svg-icons'
import { Animated } from "react-animated-css"
import DataGrid from 'react-data-grid'
import Splitter from 'm-react-splitters'

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

function MultiDataGrid (props) {
  return (
    <>
      { props.dataColumns && props.dataColumns.length == 2 &&
        <>
          <div className="relativeWrapper">
            <div className="dataWrapper">
              <DataGrid
                columns={props.dataColumns[0]}
                rows={props.data[0]}
                enableCellAutoFocus={false}
                onGridSort={props.sortRows}
                height={props.topRightPaneHeight/2}
                />
            </div>
          </div>
          <div className="relativeWrapper">
            <div className="dataWrapper">
            <DataGrid
              columns={props.dataColumns[1]}
              rows={props.data[1]}
              enableCellAutoFocus={false}
              onGridSort={props.sortRows}
              height={props.topRightPaneHeight/2}

              />
            </div>
          </div>
        </>
      }
      { props.dataColumns && props.dataColumns.length == 1 &&
        <DataGrid
          columns={props.dataColumns[0]}
          rows={props.data[0]}
          enableCellAutoFocus={false}
          height={props.topRightPaneHeight}
          />
      }
      { !props.dataColumns || props.dataColumns.length == 0 &&
        <div className="emptyPanelWrapper">
          <FontAwesomeIcon className="panelIcon"icon={faDatabase} />
          <p className="emptyPanelText">You aren't currently displaying any data.</p>
          <p className="emptyPanelText"> To learn more about getting started visit&nbsp;<a href="/guide/" className="guideLink">our guide</a>.
          </p>
        </div>
      }
    </>
  )
}

function MultiStatsGrid (props) {
  return (
    <>
      { props.stats && props.stats.length == 2 &&
        <>
          <div className="relativeWrapper">
            <div className="dataWrapper">
              <DataGrid
                columns={props.statsColumns}
                rows={props.stats[0]}
                enableCellAutoFocus={false}
                height={props.topRightPaneHeight/2}
                />
            </div>
          </div>
          <div className="relativeWrapper">
            <div className="dataWrapper">
            <DataGrid
              columns={props.statsColumns}
              rows={props.stats[1]}
              enableCellAutoFocus={false}
              height={props.topRightPaneHeight/2}
              />
            </div>
          </div>
        </>
      }
      { props.stats && props.stats.length == 1 &&
        <DataGrid
          columns={props.statsColumns}
          rows={props.stats[0]}
          enableCellAutoFocus={false}
          height={props.topRightPaneHeight}
          />
      }
      { !props.stats || props.stats.length == 0 &&
        <div className="relativeWrapper">
          <div className="emptyPanelWrapper">
            <FontAwesomeIcon className="panelIcon"icon={faTable} />
            <p className="emptyPanelText">You aren't currently displaying any stats.</p>
            <p className="emptyPanelText"> To learn more about getting started visit&nbsp;<a href="/guide/" className="guideLink">our guide</a>.
            </p>
          </div>
        </div>
      }
    </>
  )
}


export function TabPanels (props) {
  const plotDataSize = props.plotData.length
  const topPlotClass = plotDataSize > 0 ? 'showPlot ' : 'hidePlot '
  const bottomPlotClass = plotDataSize > 1 ? 'showPlot ' : 'hidePlot '

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
          animationOutDuration={800}>
          <Animated
            animationIn="fadeIn"
            animationOut="fadeOut"
            animationInDuration={800}
            animationOutDuration={800}
            isVisible={!props.hideDataTable}>
            <MultiDataGrid
              dataColumns={props.dataColumns}
              data={props.data}
              topRightPaneHeight={props.topRightPaneHeight}
              sortRows={props.sortRows}/>
          </Animated>
        </Animated>
      </TabPanel>
      <TabPanel value={props.tabValue} index={1}>
        <TabHeader maximizePanel={props.maximizePanel}
          minimizePanel={props.minimizePanel}
          restorePanel={props.restorePanel}
          selectDropdown={props.statsDropdown}/>
        <Animated
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInDuration={800}
          animationOutDuration={800}>
            <div className="relativeWrapper">
              <div className="absoluteWrapper">
                <div className="dataWrapper">
                  <Animated
                    animationIn="fadeIn"
                    animationOut="fadeOut"
                    animationInDuration={800}
                    animationOutDuration={800}
                    isVisible={!props.hideStatsTable}>
                    <MultiStatsGrid
                      statsColumns={props.statsColumns}
                      stats={props.stats}
                      topRightPaneHeight={props.topRightPaneHeight}
                      sortRows={props.sortRows}/>
                  </Animated>
                </div>
              </div>
            </div>
        </Animated>
      </TabPanel>
      <TabPanel value={props.tabValue} index={2} component="div">
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
            { props.plotData.length == 0 &&
              <div className="relativeWrapper">
                <div className="emptyPanelWrapper">
                  <FontAwesomeIcon className="panelIcon"icon={faChartBar} />
                  <p className="emptyPanelText">You aren't currently displaying any plots.</p>
                  <p className="emptyPanelText"> To learn more about getting started visit&nbsp;<a href="/guide/" className="guideLink">our guide</a>.
                  </p>
                </div>
              </div>
            }
            <span className={topPlotClass}>
              <div id="plotOutputTop" className={ props.isDraggingPane ? '' : "plotOutputFade"}
                  ref={props.plotOutputRef}></div>
            </span>
            <span className={bottomPlotClass}>
              <div id="plotOutputBottom" className={ props.isDraggingPane ? '' : "plotOutputFade"}></div>
            </span>
          </div>
        </Animated>
      </TabPanel>
      <TabPanel value={props.tabValue} index={3}>
        <TabHeader maximizePanel={props.maximizePanel}
          minimizePanel={props.minimizePanel}
          restorePanel={props.restorePanel}/>
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
