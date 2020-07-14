'use strict'

let UI = null
const setup = () => {
  tidyblocks.Setup(window.document)
  UI = tidyblocks.instance
  Array.from(document.getElementsByClassName('buttonDefault'))
    .forEach(b => b.click())
}
