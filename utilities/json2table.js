// 
// Create dynamic table from array from JSON
// This can be modified to be done in React
//


function json2table(json, classes) {
    // one table column per property 
    // we know each object has the same properties
    
    // get key names and set as column headers
     var cols = Object.keys(json[0]);
    
     var headerRow = '';
     var bodyRows = '';
     
     // create column headers from col
     // a string of th elements
     cols.map(function(col) {
         headerRow += '<th>' + col + '</th>';
     });
     
     // build the rows
     json.map(function(row) {
     
         bodyRows += '<tr>';
         
          // loop over object properties and create cells 
         cols.map(function(colName) {
             bodyRows +=  `<td> ${row[colName]} </td>`
         });
     
         bodyRows += '</tr>';
       });
     
     
     
   return `<table class=\"myTable\"></thead><tr> ${headerRow} </tr></thead><tbody> ${bodyRows} </tbody></table>`
     
   }