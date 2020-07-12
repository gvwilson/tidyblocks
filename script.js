'use strict'

let UI = null
const setup = () => {
  jeff.Setup(window.document)
  UI = jeff.instance
  Array.from(document.getElementsByClassName('buttonDefault'))
    .forEach(b => b.click())
}
