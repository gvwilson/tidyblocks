'use strict'

const stats = require('@stdlib/stats')

/**
 * Statistical tests.
 */
class Statistics {
  /**
   * ANOVA test.
   * @param {DataFrame} df Dataframe being operated on.
   * @param {number} significance Significance threshold.
   * @param {string} groupName Column to use for grouping.
   * @param {string} valueName Column to use for values.
   * @returns Result and legend.
   */
  static ANOVA (df, significance, groupName, valueName) {
    const groups = df.data.map(row => row[groupName])
    const values = df.data.map(row => row[valueName])
    const result = stats.anova1(values, groups,
                                {alpha: significance})
    const legend = {
      _title: 'ANOVA',
      rejected: 'is null hypothesis rejected?',
      pValue: 'p-value',
      statistic: 'measure value',
      alpha: 'significance'
    }
    return {result, legend}
  }

  /**
   * Kolmogorov-Smirnov test for normality.
   * @param {DataFrame} df Dataframe being operated on.
   * @param {number} mean Mean value tested for.
   * @param {number} stdDev Standard deviation tested for.
   * @param {number} significance Significance threshold.
   * @param {string} colName The column being analyzed.
   * @returns Result and legend.
   */
  static KolmogorovSmirnov (df, mean, stdDev, significance, colName) {
    const samples = df.data.map(row => row[colName])
    const result = stats.kstest(samples, 'uniform',
                                mean, stdDev,
                                {alpha: significance})
    const legend = {
      _title: 'Kolmogorov-Smirnov test for normality',
      rejected: 'is null hypothesis rejected?',
      pValue: 'p-value',
      statistic: 'measure value',
      alpha: 'significance'
    }
    return {result, legend}
  }

  /**
   * Kruskal-Wallis test.
   * @param {DataFrame} df Dataframe being operated on.
   * @param {number} significance Significance threshold.
   * @param {string} groupName Column to use for grouping.
   * @param {string} valueName Column to use for values.
   * @returns Result and legend.
   */
  static KruskalWallis (df, significance, groupName, valueName) {
    const samples = _split(df, groupName, valueName)
    const result = stats.kruskalTest(...samples,
                                     {alpha: significance})
    const legend = {
      _title: 'Kruskal-Wallis test',
      rejected: 'is null hypothesis rejected?',
      pValue: 'p-value',
      statistic: 'measure value',
      alpha: 'significance',
      df: 'degrees of freedom'
    }
    return {result, legend}
  }

  /**
   * One-sample two-sided t-test.
   * @param {DataFrame} df Dataframe being operated on.
   * @param {number} mean Mean value tested for.
   * @param {number} significance Significance threshold.
   * @param {string} colName The column to get values from.
   * @returns Result and legend.
   */
  static TTestOneSample (df, mean, significance, colName) {
    const samples = df.data.map(row => row[colName])
    const result = stats.ttest(samples,
                               {mu: mean, alpha: significance})
    const legend = {
      _title: 'one-sample two-sided t-test',
      rejected: 'is null hypothesis rejected?',
      pValue: 'p-value',
      statistic: 'measure value',
      ci: 'confidence interval',
      alpha: 'significance'
    }
    return {result, legend}
  }

  /**
   * Paired two-sided t-test.
   * @param {DataFrame} df Dataframe being operated on.
   * @param {number} significance Significance tested for.
   * @param {string} leftCol The column to get one set of values from.
   * @param {string} rightCol The column to get the other set of values from.
   * @returns Result and legend.
   */
  static TTestPaired (df, significance, leftCol, rightCol) {
    const left = df.data.map(row => row[leftCol])
    const right = df.data.map(row => row[rightCol])
    const result = stats.ttest2(left, right,
                                {alpha: significance})
    const legend = {
      _title: 'paired two-sided t-test',
      rejected: 'is null hypothesis rejected?',
      pValue: 'p-value',
      statistic: 'measure value',
      ci: 'confidence interval',
      alpha: 'significance',
      xmean: 'x sample mean',
      ymean: 'y sample mean'
    }
    return {result, legend}
  }

  /**
   * One-sample Z-test.
   * @param {DataFrame} df Dataframe being operated on.
   * @param {number} mean Mean value tested for.
   * @param {number} stdDev Standard deviation tested for.
   * @param {number} significance Significance threshold.
   * @param {string} colName The column to get values from.
   * @returns Result and legend.
   */
  static ZTestOneSample (df, mean, stdDev, significance, colName) {
    const samples = df.data.map(row => row[colName])
    const result = stats.ztest(samples,
                               stdDev,
                               {mu: mean, alpha: significance})
    const legend = {
      _title: 'one-sample Z-test',
      rejected: 'is null hypothesis rejected?',
      pValue: 'p-value',
      statistic: 'measure value',
      ci: 'confidence interval',
      alpha: 'significance'
    }
    return {result, legend}
  }
}

//
// Split values into sublists.
//
const _split = (df, groupName, valueName) => {
  const grouped = {}
  df.data.map(row => {
    if (!(row[groupName] in grouped)) {
      grouped[row[groupName]] = []
    }
    grouped[row[groupName]].push(row[valueName])
  })
  return Object.keys(grouped).map(key => grouped[key])
}

module.exports = {
  Statistics
}
