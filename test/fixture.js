const util = require('../libs/util')
const MISSING = util.MISSING

/**
 * Some fixtures for testing.
 */
module.exports = {
  bool: [
    {left: true, right: true},
    {left: true, right: false},
    {left: false, right: true},
    {left: false, right: false},
    {left: MISSING, right: false},
    {left: false, right: MISSING},
    {left: MISSING, right: MISSING}
  ],
  number: [
    {left: 2, right: 2},
    {left: 5, right: 2},
    {left: 2, right: 0},
    {left: MISSING, right: 3},
    {left: 4, right: MISSING},
    {left: MISSING, right: MISSING}
  ],
  string: [
    {left: 'pqr', right: 'pqr'},
    {left: 'abc', right: 'def'},
    {left: 'def', right: 'abc'},
    {left: 'abc', right: ''},
    {left: MISSING, right: 'def'},
    {left: 'abc', right: MISSING},
    {left: MISSING, right: MISSING}
  ],
  names: [
    {personal: 'William', family: 'Dyer'},
    {personal: 'Francesca', family: 'Pabodie'},
    {personal: 'Meyer', family: 'Meyer'}
  ],
  mixed: [
    {num: -1, date: new Date(), str: "abc", bool: true},
    {num: MISSING, date: MISSING, str: MISSING, bool: MISSING}
  ],
  Colors: [
    {name: 'black', red: 0, green: 0, blue: 0},
    {name: 'red', red: 255, green: 0, blue: 0},
    {name: 'maroon', red: 128, green: 0, blue: 0},
    {name: 'lime', red: 0, green: 255, blue: 0},
    {name: 'green', red: 0, green: 128, blue: 0},
    {name: 'blue', red: 0, green: 0, blue: 255},
    {name: 'navy', red: 0, green: 0, blue: 128},
    {name: 'yellow', red: 255, green: 255, blue: 0},
    {name: 'fuchsia', red: 255, green: 0, blue: 255},
    {name: 'aqua', red: 0, green: 255, blue: 255},
    {name: 'white', red: 255, green: 255, blue: 255}
  ],
  GroupRedCountRed: new Map([[0, 6], [128, 1], [255, 4]]),
  GroupRedMaxGreen: new Map([[0, 255], [128, 0], [255, 255]]),
  GroupRedMaxRed: new Map([[0, 0], [128, 128], [255, 255]])
}
