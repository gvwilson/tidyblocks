//
// Utilities needed at runtime for block execution.
//

/**
 * Read CSV from a URL and parse to create TidyBlocks data frame.
 * @param {string} url - URL to read from.
 */
const readCSV = (url) => {
  const request = new XMLHttpRequest()
  request.open('GET', url, false)
  request.send(null)
  if (request.status !== 200) {
    console.log(`ERROR: ${request.status}`)
    return null
  }
  else {
    const result = Papa.parse(request.responseText, {header: true})
    return new TidyBlocksDataFrame(result.data)
  }
}

/**
 * Create dynamic table from array from JSON with one table column per property.
 * Each object must have the same properties.
 * @param {JSON} json - JSON object to convert to table.
 */
const json2table = (json) => {
  // get key names and set as column headers
  const cols = Object.keys(json[0])

  // create column headers from col
  let headerRow = ''
  cols.forEach(col => {
    headerRow += `<th>${col}</th>`
  })

  // build the rows
  let bodyRows = ''
  json.forEach(row => {
    bodyRows += '<tr>'
    cols.forEach(colName => {
      bodyRows += `<td>${row[colName]}</td>`
    })
    bodyRows += '</tr>'
  })

  return `<table><thead><tr>${headerRow}</tr></thead><tbody>${bodyRows}</tbody></table>`
}

/**
 * Statistical functions to find linear model for plotting.
 * As an example, here is a linear model using least squares
 **/
const findLineByLeastSquares = (values_x, values_y) => {
  // The above is just for quick access, makes the program faster
  const len = values_x.length
  if (len != values_y.length) {
    throw new Error('The parameters values_x and values_y need to have same size!')
  }

  // Above and below cover edge cases
  if (len === 0) {
    return [ [], [] ]
  }

  // Calculate the sum for each of the parts necessary.
  let x_sum = 0
  let y_sum = 0
  let xy_sum = 0
  let xx_sum = 0
  for (let i = 0; i<len; i++) {
    const x = values_x[i]
    const y = values_y[i]
    x_sum += x
    y_sum += y
    xx_sum += x * x
    xy_sum += x * y
  }

  // Calculate m and b for the line equation:
  // y = x * m + b
  var m = (len * xy_sum - x_sum * y_sum) / (len * xx_sum - x_sum * x_sum)
  var b = (y_sum / len) - (m * x_sum) / len

  // Solve for slope and intercept.
  return [m, b]
}

//
// Make this file require'able if running from the command line.
//
if (typeof module !== 'undefined') {
  module.exports = {registerPrefix, registerSuffix, fixCode, colName, colValue}
}
