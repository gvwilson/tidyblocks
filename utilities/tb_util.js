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
    const result = Papa.parse(request.responseText, {
      header: true
    })
    return data = new TidyBlocksDataFrame(result.data)
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
 * LM
 * Statistical functions to apply to plots
 * As an example, here is a linear model using least squares
 **/
const findLineByLeastSquares = (values_x, values_y) => {
  var x_sum = 0
  var y_sum = 0
  var xy_sum = 0
  var xx_sum = 0
  var count = 0

  // The above is just for quick access, makes the program faster
  var x = 0
  var y = 0
  var values_length = values_x.length

  if (values_length != values_y.length) {
    throw new Error('The parameters values_x and values_y need to have same size!')
  }

  // Above and below cover edge cases
  if (values_length === 0) {
    return [ [], [] ]
  }

  // Calculate the sum for each of the parts necessary.
  for (let i = 0; i<values_length; i++) {
    x = values_x[i]
    y = values_y[i]
    x_sum+= x
    y_sum+= y
    xx_sum += x*x
    xy_sum += x*y
    count++
  }

  // Calculate m and b for the line equation:
  // y = x * m + b
  var m = (count*xy_sum - x_sum*y_sum) / (count*xx_sum - x_sum*x_sum)
  var b = (y_sum/count) - (m*x_sum)/count

  // solve for x and y intercept
  return [m, b]
}
