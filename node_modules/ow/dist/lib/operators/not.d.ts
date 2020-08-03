import { Predicate } from '../predicates/predicate';
/**
 * Operator which inverts all the validations.
 *
 * @hidden
 * @param predictate Predicate to wrap inside the operator.
 */
export declare const not: <T, P extends Predicate<T>>(predicate: P) => P;
