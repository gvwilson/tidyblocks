import { Config as VgConfig, Renderers } from 'vega';
import { Config as VlConfig } from 'vega-lite/build/src/config';
export declare type Mode = 'vega' | 'vega-lite';
export declare type Config = VlConfig | VgConfig;
export interface MessageData {
    spec: string;
    file?: unknown;
    config?: Config;
    mode: Mode;
    renderer?: Renderers;
}
//# sourceMappingURL=types.d.ts.map