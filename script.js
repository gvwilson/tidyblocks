/* eslint
   semi: ["error", "always"],
   indent: [2, "tab"],
   no-tabs: 0,
   no-multiple-empty-lines: ["error", {"max": 2, "maxEOF": 1}],
   one-var: ["error", "always"] */
/* global REDIPS, briq */

/* enable strict mode */
'use strict';

let UI, // eslint-disable-line no-unused-vars
	redips = {}; // create redips container

// define setup
const setup = function () { // eslint-disable-line no-unused-vars
	briq.Setup();
	UI = briq.instance;
	Array.from(document.getElementsByClassName('buttonDefault')).forEach(b => b.click());
	// call REDIPS initialization
	redips.init();
};


// REDIPS initialization
redips.init = function () {
	let rd = REDIPS.drag;
	// REDIPS settings
	rd.init('redips-drag');
	rd.dropMode = 'single'; // one item per cell
	rd.trash.question = null; // don't confirm deletion
	redips.colorTD = '#e7ab83'; // hover color for allowed TD
	// set reference to "program table" and trash cell
	redips.briqProgram = document.getElementById('briq-program');
	redips.briqTrash = document.getElementById('briq-trash');
	// event called before DIV element is dropped (td is target TD where DIV element is dropped)
	rd.event.droppedBefore = function (td) {
		// if dropped DIV element is not inside "program" table then return false (nothing will happen)
		if (!redips.briqProgram.contains(td)) {
			return false;
		}
	};
	// handler clicked - set hover color
	rd.event.clicked = function (td) {
		redips.setHoverColor(td);
	};
	// handler changed - set hover color
	rd.event.changed = function (td) {
		redips.setHoverColor(td);
	};
};


// method sets hover color (td is target cell)
redips.setHoverColor = function (td) {
	let rd = REDIPS.drag;
	// set red color for trash TD
	if (redips.briqTrash.contains(td)) {
		rd.hover.colorTd = 'red';
	}
	// set hover color for allowed cells
	else if (redips.briqProgram.contains(td)) {
		rd.hover.colorTd = redips.colorTD;
	}
	// set hover color for forbiden cells (it'll be the same color - so user will not see difference)
	else {
		rd.hover.colorTd = 'lightgreen';
	}
};

