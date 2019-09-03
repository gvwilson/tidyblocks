//
// Utilities for code generation.
//

/**
 * Get the prefix for registering blocks.
 */
const registerPrefix = (fill) => {
  return `TidyBlocksManager.register([${fill}], () => {`
}

/**
 * Get the suffix for registering blocks.
 */
const registerSuffix = (fill) => {
  return `}, [${fill}]) // terminated`
}

/**
 * Fix up runnable code if it doesn't end with a display block.
 * @param {string} code - code to patch up.
 */
const fixCode = (code) => {
  if (! code.endsWith('// terminated')) {
    const suffix = registerSuffix('')
    code += `.plot(tableEmbed, null, '#plotOutput', {}) ${suffix}`
  }
  return code
}

/**
 * Get a column name from an @-prefixed column identifier.
 * @param input {string} - column identifier prefixed with '@'.
 * @return column name without '@'.
 */
const colName = (input) => {
  if (! input.startsWith('@')) {
    console.log('ERROR ERROR ERROR in colname', input)
  }
  return input.substring(1)
}

/**
 * Within the select block we need to place perentheses 
 * around the comma seperate values
 */
const commaSeparate = (input)  => {
  input = `${input.replace(/ /g,'')
                  .replace(/,/g, "\",\"")}`
  return input
}

/**
 * Get the value of a column by cases.
 * 1. If the input isn't a string, leave it alone.
 * 2. If the input doesn't start with '@', leave it alone.
 * 3. If the input is '@name', convert it to 'row["name"]'.
 */
const colValue = (input) => {
  if (typeof input !== 'string') {
    return input
  }
  if (! input.startsWith('@')) {
    return input
  }
  return `row["${colName(input)}"]`
}

//
// Make this file require'able if running from the command line.
//
if (typeof module !== 'undefined') {
  module.exports = {registerPrefix, registerSuffix, fixCode, colName, colValue}
}
