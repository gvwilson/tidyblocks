'use strict'

// User interface initialization.
let UI = null
const setup = () => {
  briq.Setup(window.document)
  UI = briq.instance
  Array.from(document.getElementsByClassName('buttonDefault'))
    .forEach(b => b.click())
  redips.init()
}

// REDIPS initialization.
let redips = {
  init: () => {
    const rd = REDIPS.drag

    // REDIPS settings
    rd.init('redips-drag')
    rd.dropMode = 'single'       // one item per cell
    rd.trash.question = null     // don't confirm deletion
    redips.colorTD = 'lightblue' // hover color for allowed TD

    // set reference to "program table" and trash cell
    redips.briqProgram = document.getElementById('briq-program')
    redips.briqTrash = document.getElementById('briq-trash')

    // event called before DIV element is dropped (td is target TD where DIV element is dropped)
    rd.event.droppedBefore = (td) => {
      // if dropped DIV element is not inside "program" table then return false (nothing will happen)
      return redips.briqProgram.contains(td)
    }

    // handler clicked - set hover color
    rd.event.clicked = (td) => {
      redips.setHoverColor(td)
    }

    // handler changed - set hover color
    rd.event.changed = (td) => {
      redips.setHoverColor(td)
    }
  },
  
  // method sets hover color (td is target cell)
  setHoverColor: (td) => {
    const rd = REDIPS.drag

    // set red color for trash TD
    if (redips.briqTrash.contains(td)) {
      rd.hover.colorTd = 'red'
    }

    // set hover color for allowed cells
    else if (redips.briqProgram.contains(td)) {
      rd.hover.colorTd = redips.colorTD
    }

    // set hover color for forbiden cells (it'll be the same color - so user will not see difference)
    else {
      rd.hover.colorTd = 'lightgreen'
    }
  }
}
