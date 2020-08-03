import { Ow } from '../..';
import { BasePredicate, testSymbol } from './base-predicate';
/**
 * @hidden
 */
export interface Validator<T> {
    message(value: T, label?: string, result?: any): string;
    validator(value: T): any;
}
/**
 * @hidden
 */
export interface Context<T> {
    validators: Validator<T>[];
    label?: string;
}
/**
 * @hidden
 */
export declare const validatorSymbol: unique symbol;
/**
 * @hidden
 */
export declare class Predicate<T = any> implements BasePredicate<T> {
    private readonly type;
    private readonly context;
    constructor(type: string, context?: Context<T>);
    /**
     * @hidden
     */
    [testSymbol](value: T, main: Ow): void;
    /**
     * @hidden
     */
    readonly [validatorSymbol]: Validator<T>[];
    /**
     * Invert the following validators.
     */
    readonly not: this;
    /**
     * Assign a label to this predicate for use in error messages.
     *
     * @param value Label to assign.
     */
    label(value: string): this;
    /**
     * Test if the value matches a custom validation function. The validation function should return `true` if the value
     * passes the function. If the function either returns `false` or a string, the function fails and the string will be
     * used as error message.
     *
     * @param fn Validation function.
     */
    is(fn: (value: T) => boolean | string): this;
}
