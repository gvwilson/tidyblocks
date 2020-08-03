import { __awaiter } from "tslib";
import embed from './embed';
/**
 * Create a promise to an HTML Div element with an embedded Vega-Lite or Vega visualization.
 * The element has a value property with the view. By default all actions except for the editor action are disabled.
 *
 * The main use case is in [Observable](https://observablehq.com/).
 */
export default function (spec, opt = {}) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const wrapper = document.createElement('div');
        wrapper.classList.add('vega-embed-wrapper');
        const div = document.createElement('div');
        wrapper.appendChild(div);
        const actions = opt.actions === true || opt.actions === false
            ? opt.actions
            : Object.assign({ export: true, source: false, compiled: true, editor: true }, ((_a = opt.actions) !== null && _a !== void 0 ? _a : {}));
        const result = yield embed(div, spec, Object.assign({ actions }, (opt !== null && opt !== void 0 ? opt : {})));
        wrapper.value = result.view;
        return wrapper;
    });
}
//# sourceMappingURL=container.js.map