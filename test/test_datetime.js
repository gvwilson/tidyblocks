const {
  TbDataFrame,
  TbManager,
  TbTestUtils,
  assert
} = require('./utils')

//
// Load blocks and define testing blocks before running tests.
//
before(() => {
  TbTestUtils.loadBlockFiles()
  TbTestUtils.createTestingBlocks()
})

describe('check datetime handling', () => {

  beforeEach(() => {
    TbManager.reset()
  })

  it('does date conversion correctly', (done) => {
    const pipeline = [
      {_b: 'data_earthquakes'},
      {_b: 'transform_mutate',
       COLUMN: 'Time',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToDatetime',
               VALUE: {_b: 'value_column',
                       COLUMN: 'Time'}}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert(env.frame.data.every(row => (row.Time instanceof Date)),
           `Some time values not converted to Date objects`)
    done()
  })

  it('handles invalid dates correctly when converting', (done) => {
    const pipeline = [
      {_b: 'data_single'},
      {_b: 'transform_mutate',
       COLUMN: 'time',
       VALUE: {_b: 'value_text',
               VALUE: 'abc'}},
      {_b: 'transform_mutate',
       COLUMN: 'result',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToDatetime',
               VALUE: {_b: 'value_column',
                       COLUMN: 'time'}}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.error, '',
                 `Expected no error`)
    assert.equal(env.frame.data.length, 1,
                 `Expected one row in result`)
    assert.equal(env.frame.data[0].result, null,
                 `Expected result to be null`)
    done()
  })

  it('extracts values from dates correctly', (done) => {
    const pipeline = [
      {_b: 'data_earthquakes'},
      {_b: 'transform_mutate',
       COLUMN: 'Time',
       VALUE: {_b: 'operation_convert',
               TYPE: 'tbToDatetime',
               VALUE: {_b: 'value_column',
                       COLUMN: 'Time'}}},
      {_b: 'transform_mutate',
       COLUMN: 'year',
       VALUE: {_b: 'operation_convert_datetime',
               TYPE: 'tbToYear',
               VALUE: {_b: 'value_column',
                       COLUMN: 'Time'}}},
      {_b: 'transform_mutate',
       COLUMN: 'month',
       VALUE: {_b: 'operation_convert_datetime',
               TYPE: 'tbToMonth',
               VALUE: {_b: 'value_column',
                       COLUMN: 'Time'}}},
      {_b: 'transform_mutate',
       COLUMN: 'day',
       VALUE: {_b: 'operation_convert_datetime',
               TYPE: 'tbToDay',
               VALUE: {_b: 'value_column',
                       COLUMN: 'Time'}}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.frame.data[0].year, 2016,
                 `Expected 2016 as year`)
    assert.equal(env.frame.data[0].month, 8,
                 `Expected 8 as month`)
    assert.equal(env.frame.data[0].day, 24,
                 `Expected 24 as day of month`)
    done()
  })

  it('handles conversion to weekday correctly', (done) => {
    const date = '1984-01-01'
    const pipeline = [
      {_b: 'data_single'},
      {_b: 'transform_mutate',
       COLUMN: 'when',
       VALUE: {_b: 'value_datetime',
               VALUE: new Date(date)}},
      {_b: 'transform_mutate',
       COLUMN: 'weekday',
       VALUE: {_b: 'operation_convert_datetime',
               TYPE: 'tbToWeekDay',
               VALUE: {_b: 'value_column',
                       COLUMN: 'when'}}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.frame.data[0].weekday, new Date('1984-01-01').getDay(),
                 `January 1, 1984 was a Sunday, not ${env.frame.data[0].weekday}`)
    done()
  })

  it('extracts hours, minutes, and seconds correctly', (done) => {
    const pipeline = [
      {_b: 'data_single'},
      {_b: 'transform_mutate',
       COLUMN: 'when',
       VALUE: {_b: 'value_datetime',
               VALUE: new Date(1984, 1, 1, 5, 10, 15)}},
      {_b: 'transform_mutate',
       COLUMN: 'hours',
       VALUE: {_b: 'operation_convert_datetime',
               TYPE: 'tbToHours',
               VALUE: {_b: 'value_column',
                       COLUMN: 'when'}}},
      {_b: 'transform_mutate',
       COLUMN: 'minutes',
       VALUE: {_b: 'operation_convert_datetime',
               TYPE: 'tbToMinutes',
               VALUE: {_b: 'value_column',
                       COLUMN: 'when'}}},
      {_b: 'transform_mutate',
       COLUMN: 'seconds',
       VALUE: {_b: 'operation_convert_datetime',
               TYPE: 'tbToSeconds',
               VALUE: {_b: 'value_column',
                       COLUMN: 'when'}}}
    ]
    const env = TbTestUtils.evalCode(pipeline)
    assert.equal(env.frame.data[0].hours, 5,
                 `Expected the hours to be 5 not ${env.frame.data[0].hours}`)
    assert.equal(env.frame.data[0].minutes, 10,
                 `Expected the minutes to be 10 not ${env.frame.data[0].minutes}`)
    assert.equal(env.frame.data[0].seconds, 15,
                 `Expected the seconds to be 15 not ${env.frame.data[0].seconds}`)
    done()
  })
})
