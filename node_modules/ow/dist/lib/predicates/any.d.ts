import { Predicate } from './predicate';
import { BasePredicate, testSymbol } from './base-predicate';
import { Ow } from '../..';
/**
 * @hidden
 */
export declare class AnyPredicate<T> implements BasePredicate<T> {
    private readonly predicates;
    constructor(predicates: Predicate[]);
    [testSymbol](value: T, main: Ow): void;
}
