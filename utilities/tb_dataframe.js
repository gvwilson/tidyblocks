/**
 * DataFrame wrapper class.
 */
class TidyBlocksDataFrame {

  constructor (initial) => {
    this.df = new dataForge.DataFrame(initial)
  }

  generateSeries (props) {
    this.df.generateSeries(props)
    return this
  }

  orderBy (func) {
    this.df.orderBy(func)
    return this
  }

  subset (columns) {
    this.df.subset(columns)
    return this
  }

  where (func) {
    this.df.where(func)
    return this
  }

  plot (spec) {
    vegaEmbed('#plotOutput', spec, {})
  }
}
