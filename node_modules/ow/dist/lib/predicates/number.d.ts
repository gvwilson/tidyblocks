import { Predicate, Context } from './predicate';
export declare class NumberPredicate extends Predicate<number> {
    /**
     * @hidden
     */
    constructor(context?: Context<number>);
    /**
     * Test a number to be in a specified range.
     *
     * @param start Start of the range.
     * @param end End of the range.
     */
    inRange(start: number, end: number): this;
    /**
     * Test a number to be greater than the provided value.
     *
     * @param x Minimum value.
     */
    greaterThan(x: number): this;
    /**
     * Test a number to be greater than or equal to the provided value.
     *
     * @param x Minimum value.
     */
    greaterThanOrEqual(x: number): this;
    /**
     * Test a number to be less than the provided value.
     *
     * @param x Maximum value.
     */
    lessThan(x: number): this;
    /**
     * Test a number to be less than or equal to the provided value.
     *
     * @param x Minimum value.
     */
    lessThanOrEqual(x: number): this;
    /**
     * Test a number to be equal to a specified number.
     *
     * @param expected Expected value to match.
     */
    equal(expected: number): this;
    /**
     * Test a number to be an integer.
     */
    readonly integer: this;
    /**
     * Test a number to be finite.
     */
    readonly finite: this;
    /**
     * Test a number to be infinite.
     */
    readonly infinite: this;
    /**
     * Test a number to be positive.
     */
    readonly positive: this;
    /**
     * Test a number to be negative.
     */
    readonly negative: this;
}
