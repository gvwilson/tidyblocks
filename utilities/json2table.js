// 
// Create dynamic table from array from JSON.
// One table column per property - we know each object has the same properties.
// This can be modified to be done in React.
//

function json2table (json) {
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
