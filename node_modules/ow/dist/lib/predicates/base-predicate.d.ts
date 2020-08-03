import { Ow } from '../..';
/**
 * @hidden
 */
export declare const testSymbol: unique symbol;
/**
 * @hidden
 */
export interface BasePredicate<T = any> {
    [testSymbol](value: T, main: Ow): void;
}
