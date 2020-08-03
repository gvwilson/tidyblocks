/**
 * @hidden
 */
export interface CollectionLike<T> {
    has(item: T): boolean;
}
declare const _default: <T>(source: CollectionLike<T>, items: T[], maxValues?: number) => true | T[];
export default _default;
