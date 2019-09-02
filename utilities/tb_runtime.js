//
// Utilities needed at runtime for block execution.
//

/**
 * Read CSV from a URL and parse to create TidyBlocks data frame.
 * @param {string} url URL to read from.
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
    return csv2TidyBlocksDataFrame(request.responseText, Papa.parse)
  }
}

/**
 * Produce a human-friendly name for the type of a column.
 * @param value The value whose type is checked.
 * @returns The name of the type
 */
const colTypeName = (value) => {
  return typeof value
}

/**
 * Create dynamic table from array from JSON with one table column per property.
 * Each object must have the same properties.
 * @param {JSON} json JSON object to convert to table.
 */
const json2table = (json) => {
  const cols = Object.keys(json[0])
  const headerRow = '<tr>' + cols.map(c => `<th>${c}</th>`).join('') + '</tr>'
  const typeRow = '<tr>' + cols.map(c => `<th>${colTypeName(json[0][c])}</th>`).join('') + '</tr>'
  const bodyRows = json.map(row => {
    return '<tr>' + cols.map(c => `<td>${row[c]}</td>`).join('') + '</tr>'
  }).join('')
  return `<table><thead>${headerRow}${typeRow}</thead><tbody>${bodyRows}</tbody></table>`
}

/**
 * Find linear model for plotting.
 * @param {number[]} values_x X-axis values.
 * @param {number[]} values_y Y-axis values.
 * @returns {number[]} Slope and intercept.
 */
const findLineByLeastSquares = (values_x, values_y) => {
  const len = values_x.length
  if (len != values_y.length) {
    throw new Error('values_x and values_y have different lengths')
  }

  // Empty case.
  if (len === 0) {
    return [NaN, NaN]
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
