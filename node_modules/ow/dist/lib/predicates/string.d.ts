import { Predicate, Context } from './predicate';
export declare class StringPredicate extends Predicate<string> {
    /**
     * @hidden
     */
    constructor(context?: Context<string>);
    /**
     * Test a string to have a specific length.
     *
     * @param length The length of the string.
     */
    length(length: number): this;
    /**
     * Test a string to have a minimum length.
     *
     * @param length The minimum length of the string.
     */
    minLength(length: number): this;
    /**
     * Test a string to have a maximum length.
     *
     * @param length The maximum length of the string.
     */
    maxLength(length: number): this;
    /**
     * Test a string against a regular expression.
     *
     * @param regeExp The regular expression to match the value with.
     */
    matches(regExp: RegExp): this;
    /**
     * Test a string to start with a specific value.
     *
     * @param searchString The value that should be the start of the string.
     */
    startsWith(searchString: string): this;
    /**
     * Test a string to end with a specific value.
     *
     * @param searchString The value that should be the end of the string.
     */
    endsWith(searchString: string): this;
    /**
     * Test a string to include a specific value.
     *
     * @param searchString The value that should be included in the string.
     */
    includes(searchString: string): this;
    /**
     * Test a string to be empty.
     */
    readonly empty: this;
    /**
     * Test a string to be not empty.
     */
    readonly nonEmpty: this;
    /**
     * Test a string to be equal to a specified string.
     *
     * @param expected Expected value to match.
     */
    equals(expected: string): this;
    /**
     * Test a string to be alphanumeric.
     */
    readonly alphanumeric: this;
    /**
     * Test a string to be numeric.
     */
    readonly numeric: this;
    /**
     * Test a string to be a valid date.
     */
    readonly date: this;
}
