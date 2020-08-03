import { Predicate, Context } from './predicate';
export declare class DatePredicate extends Predicate<Date> {
    /**
     * @hidden
     */
    constructor(context?: Context<Date>);
    /**
     * Test a date to be before another date.
     *
     * @param date Maximum value.
     */
    before(date: Date): this;
    /**
     * Test a date to be before another date.
     *
     * @param date Minimum value.
     */
    after(date: Date): this;
}
