import { View } from 'vega';
import { EmbedOptions, VisualizationSpec } from './embed';
/**
 * Create a promise to an HTML Div element with an embedded Vega-Lite or Vega visualization.
 * The element has a value property with the view. By default all actions except for the editor action are disabled.
 *
 * The main use case is in [Observable](https://observablehq.com/).
 */
export default function (spec: VisualizationSpec | string, opt?: EmbedOptions): Promise<HTMLDivElement & {
    value: View;
}>;
//# sourceMappingURL=container.d.ts.map