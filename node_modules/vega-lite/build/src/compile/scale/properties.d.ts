import { SignalRef, TimeInterval } from 'vega';
import { Channel } from '../../channel';
import { ScaleDatumDef, ScaleFieldDef, TypedFieldDef } from '../../channeldef';
import { Config } from '../../config';
import { Mark, MarkDef, RectConfig } from '../../mark';
import { Domain, Scale, ScaleConfig, ScaleType } from '../../scale';
import { Sort } from '../../sort';
import { Type } from '../../type';
import { Model } from '../model';
import { SignalRefWrapper } from '../signal';
import { ScaleComponentProps } from './component';
export declare function parseScaleProperty(model: Model, property: keyof (Scale | ScaleComponentProps)): void;
export interface ScaleRuleParams {
    model: Model;
    channel: Channel;
    fieldOrDatumDef: ScaleFieldDef<string, Type> | ScaleDatumDef;
    scaleType: ScaleType;
    scalePadding: number | SignalRef;
    scalePaddingInner: number | SignalRef;
    domain: Scale['domain'];
    markDef: MarkDef;
    config: Config;
}
export declare const scaleRules: {
    [k in keyof Scale]?: (params: ScaleRuleParams) => Scale[k];
};
export declare function parseScaleRange(model: Model): void;
export declare function parseNonUnitScaleProperty(model: Model, property: keyof (Scale | ScaleComponentProps)): void;
export declare function bins(model: Model, fieldDef: TypedFieldDef<string>): SignalRefWrapper | {
    step: number;
};
export declare function interpolate(channel: Channel, type: Type): Scale['interpolate'];
export declare function nice(scaleType: ScaleType, channel: Channel, fieldOrDatumDef: TypedFieldDef<string> | ScaleDatumDef): boolean | TimeInterval;
export declare function padding(channel: Channel, scaleType: ScaleType, scaleConfig: ScaleConfig, fieldOrDatumDef: TypedFieldDef<string> | ScaleDatumDef, markDef: MarkDef, barConfig: RectConfig): number | SignalRef;
export declare function paddingInner(paddingValue: number | SignalRef, channel: Channel, mark: Mark, scaleConfig: ScaleConfig): number | SignalRef;
export declare function paddingOuter(paddingValue: number | SignalRef, channel: Channel, scaleType: ScaleType, mark: Mark, paddingInnerValue: number | SignalRef, scaleConfig: ScaleConfig): number | {
    signal: string;
};
export declare function reverse(scaleType: ScaleType, sort: Sort<string>, channel: Channel, scaleConfig: ScaleConfig): boolean | SignalRef;
export declare function zero(channel: Channel, fieldDef: TypedFieldDef<string> | ScaleDatumDef, specifiedDomain: Domain, markDef: MarkDef, scaleType: ScaleType): boolean;
//# sourceMappingURL=properties.d.ts.map