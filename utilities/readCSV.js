//
// Create function to synchronously parse CSV to JSON
// Convert JSON to TidyBlocksDataFrame object
// name the data frame object `data` in the global environment
//

function readCSV(my_url) {

    var request = new XMLHttpRequest()
        request.open('GET', my_url, false)  // `false` makes the request synchronous
        request.send(null)
    if (request.status !== 200) {
        console.log('ERROR')
   } else {
     result = Papa.parse(request.responseText, {
        header: true
     })
   }
   dataframe = result.data
   data = new TidyBlocksDataFrame(dataframe)
   return data
}