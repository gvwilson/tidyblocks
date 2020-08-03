import { Predicate, Context } from './predicate';
export declare class ObjectPredicate extends Predicate<object> {
    /**
     * @hidden
     */
    constructor(context?: Context<object>);
    /**
     * Test if an Object is a plain object.
     */
    readonly plain: this;
    /**
     * Test an object to be empty.
     */
    readonly empty: this;
    /**
     * Test an object to be not empty.
     */
    readonly nonEmpty: this;
    /**
     * Test all the values in the object to match the provided predicate.
     *
     * @param predicate The predicate that should be applied against every value in the object.
     */
    valuesOfType<T>(predicate: Predicate<T>): this;
    /**
     * Test all the values in the object deeply to match the provided predicate.
     *
     * @param predicate The predicate that should be applied against every value in the object.
     */
    deepValuesOfType<T>(predicate: Predicate<T>): this;
    /**
     * Test an object to be deeply equal to the provided object.
     *
     * @param expected Expected object to match.
     */
    deepEqual(expected: object): this;
    /**
     * Test an object to be of a specific instance type.
     *
     * @param instance The expected instance type of the object.
     */
    instanceOf(instance: any): this;
    /**
     * Test an object to include all the provided keys. You can use [dot-notation](https://github.com/sindresorhus/dot-prop) in a key to access nested properties.
     *
     * @param keys The keys that should be present in the object.
     */
    hasKeys(...keys: string[]): this;
    /**
     * Test an object to include any of the provided keys. You can use [dot-notation](https://github.com/sindresorhus/dot-prop) in a key to access nested properties.
     *
     * @param keys The keys that could be a key in the object.
     */
    hasAnyKeys(...keys: string[]): this;
}
