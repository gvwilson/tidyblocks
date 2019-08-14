//
// Create function to synchronously parse CSV to JSON
// Convert JSON to TidyBlocksDataFrame object
// name the data frame object `data` in the global environment
//

function readCSV (url) {
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
    return new TidyBlocksDataFrame(result.data)
  }
}
