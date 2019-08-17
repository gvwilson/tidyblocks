/**
 * DataFrame wrapper class.
 * @param {initial} JSON array - initial values.
 * @param {withFrame} boolean - construct an embedded DataForge dataframe (default true, use false for testing).
 */
class TidyBlocksDataFrame {

  /**
   * Build a dataframe using provided values (if any).
   */
  constructor (initial, withFrame = true) {
    this.df = null
    if (withFrame) {
      this.df = new dataForge.DataFrame(initial)
    }
  }

  /**
   * Report action for debugging purposes.
   */
  report (message) {
    console.log(message)
  }

  /**
   * Convert to array for display purposes.
   */
  toArray () {
    if (this.df) {
      return this.df.toArray()
    }
    else {
      return ['placeholder']
    }
  }

  /**
   * Filter rows.
   */
  dplyr_filter (expression) {
    this.report(
      `.where(row => (${expression}))`
    )
  }

  /**
   * Group rows.
   */
  dplyr_groupby (column) {
    this.report(
      `.generateSeries({
        Index: row => {return ${column}}
      }).orderBy(column => column.Index)`
      .replace(/&&/gi, '+')
    )
  }

  /**
   * Mutate rows.
   */
  dplyr_mutate (column, expression) {
    this.report(
      `.generateSeries({ ${column}: row => ${expression}})`
      .replace(/["']/g, '')
    )
  }

  /**
   * Select columns.
   */
  dplyr_select (columns) {
    this.report(
      `.subset([" ${columns} "])`
      .replace(/row./gi, ' ')
      .replace(/&&/g, ',')
      .replace(/ /gi, '')
      .replace(/,/gi, '","')
    )
  }

  /**
   * Summarize values. FIXME: clean up
   */
  dplyr_summarize (expressions) {
    const argarray = expressions.split("&&")
    const evalArray = (eval(argarray))
  
    function deserialize (serializedJavascript){
      return eval('(' + serializedJavascript + ')')
    }
    
    let blocklyX = evalArray.map(n=> deserialize(n))
    
    blocklyX, result2 = blocklyX.reduce((r, o) => {
      Object.entries(o).forEach(([k, v]) => Object.assign(r[k] = r[k] || {}, v))
      return r
    }, {})
  
    function reviveJS (obj) {
      return JSON.parse(JSON.stringify(obj, function (k, v) {
        if (typeof v === 'function') {
          return '' + v
        }
        return v
      }), function (k, v) {
        if (typeof v === 'string' && v.indexOf('') !== -1) {
          return v
        }
        return v
      })
    }
    
    let functionToString = reviveJS(result2)
    functionToString = JSON.stringify(functionToString)
    functionToString = functionToString.replace(/"/g, "").replace(/[[\]]/g,'')
  
    // get the previous block
    const previous = this.getPreviousBlock()

    // get the field from the previous block containing the columns
    let inputBlock = previous.getInputTargetBlock('Columns')

    // turn to string
    inputBlock = `${inputBlock}`
    // this returns Column AND Column
    // we need to change that to "Column", "Column"
    inputBlock = "\"" + inputBlock.split(' ').join().replace(/,/g, "\"").replace(/AND/g, ",") + "\""
  
    const summarizeString = 
       `.pivot([${inputBlock}],
          ${functionToString},
       )`
       .replace(/AND/g, ",").replace(/&&/g, ",")
       .replace("} , {", ",")
    this.report(summarizeString)
  }

  /**
   * Create a bar plot.
   */
  ggplot_bar (x, y) {
    this.report(`SPLIT 
      let spec = {
        "width": 500,
        "height": 300,
        "data": { "values": dfArray },
        "mark": "bar",
        "encoding": {
          "x": {
            "field": "${x}",
            "type": "ordinal"
          },
          "y": {
            "field": "${y}",
            "type": "quantitative"
          },
          "tooltip": {
            "field": "${y}",
            "type": "quantitative"
          }
        }
      }  
      vegaEmbed("#plotOutput", spec, {})`
    )
  }

  /**
   * Create a box plot.
   */
  ggplot_boxplot (x, y) {
    this.report(`SPLIT 
      let spec = {
        "width": 500,
        "data": { "values": dfArray },
          "mark": {
            "type": "boxplot",
            "extent": 1.5
          },
          "encoding": {
            "x": {
              "field": "${x}",
              "type": "ordinal"
            },
            "y": {
              "field": "${y}",
              "type": "quantitative",
            }
          }
        }
      vegaEmbed("#plotOutput", spec, {})`
    )
  }

  /**
   * Create a histogram.
   */
  ggplot_hist (column, bins) {
    this.report(`SPLIT 
      let spec = {
        "width": 500,
        "height": 300,
        "data": { "values": dfArray },
        "mark": "bar",
        "encoding": {
          "x": {
            "bin": {
              "maxbins": ${bins}
            },
            "field": "${column}",
            "type": "quantitative"
          },
          "y": {
            "aggregate": "count",
            "type": 'quantitative'
          },
          "tooltip": null
        }
      }
      vegaEmbed("#plotOutput", spec, {})`
    )
  }

  /**
   * Create a point plot.
   */
  ggplot_point (x, y, color, useLM) {
    if (useLM == 'FALSE') {
      this.report(`SPLIT 
        let spec = {
          "width": 500,
          "data": { "values": dfArray },
          "mark": "point",
          "encoding": {
            "x": {"field": "${x}","type": "quantitative"},
            "y": {"field": "${y}","type": "quantitative"},
            "color": {"field": "${color}", "type": "nominal"}
          }
        }
        vegaEmbed("#plotOutput", spec, {})`
      )
    }
    else {
      this.report(`SPLIT
        var result = dfArray.reduce(function(obj, current) {
          Object.keys(current).forEach(key => {
              obj[key] = obj[key] || []; //Has to be an array if not exists
              obj[key] = Array.isArray(obj[key]) ? obj[key] : [obj[key]]; //Has to be an array if not an array
              obj[key].push(current[key]); //Add current item to array of matching key
          })
          return obj; //Continue to the next object in the array
        })
    
        var lineDat = findLineByLeastSquares(result.${x}.map(parseFloat),
                                             result.${y}.map(parseFloat))
    
        let spec = {
          "width": 500,
          "layer": [
            { 
             "data": { "values": dfArray },
              "mark": "point",
              "encoding": {
                "x": {"field": "${x}","type": "quantitative"},
                "y": {"field": "${y}","type": "quantitative"},
                "color": {"field": "${color}", "type": "nominal"}
              }
            },
            {
              "data": {
                "values": [
                  {"x": 0, "y": lineDat[1]},
                  {"x": Math.max.apply(Math, result.${x}), 
                  "y": (Math.max.apply(Math, result.${x})) * lineDat[0] + lineDat[1]}
                ]
              },
              "mark": {"type": "line"},
              "encoding": {
                "x": {"type": "quantitative", "field": "x"},
                "y": {"type": "quantitative", "field": "y"},
                "color": {"value": "red"}
              }
            }
          ]
        }
        vegaEmbed("#plotOutput", spec, {})`
      )
    }
  }
}

//
// Make this file require'able if running from the command line.
//
if (typeof module !== 'undefined') {
  module.exports = TidyBlocksDataFrame
}
