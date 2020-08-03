import { Predicate, Context } from './predicate';
export declare class WeakSetPredicate<T extends object = any> extends Predicate<WeakSet<T>> {
    /**
     * @hidden
     */
    constructor(context?: Context<WeakSet<T>>);
    /**
     * Test a WeakSet to include all the provided items. The items are tested by identity, not structure.
     *
     * @param items The items that should be a item in the WeakSet.
     */
    has(...items: T[]): this;
    /**
     * Test a WeakSet to include any of the provided items. The items are tested by identity, not structure.
     *
     * @param items The items that could be a item in the WeakSet.
     */
    hasAny(...items: T[]): this;
}
