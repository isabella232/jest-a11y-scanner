'use strict'
const chalk = require('chalk')
const { printReceived, matcherHint } = require('jest-matcher-utils')
const reportViolations = require("./reportViolations");
const { format } = require("date-fns");

/**
 * Custom Jest expect matcher, that can check aXe results for violations.
 * @param {object} object requires an instance of aXe's results object
 * (https://github.com/dequelabs/axe-core/blob/develop-2x/doc/API.md#results-object)
 * @param {boolean} options.error default = true, whether this expect matcher should emit errors or not
 * @param {boolean} options.verbose default = true, whether or not the output should contain all the data or some of the data
 * @param {boolean} options.report default = true, whether or not output will be written to a file in the "jest-a11y-reports" folder
 * @returns {object} returns Jest matcher object
 */
const toHaveNoViolations = {
  toHaveNoViolations (results, options) {
    const opts = options || {
      error: true,
      verbose: true,
      report: true,
    }
    const error = opts.error !== false ? true : false;
    const verbose = opts.verbose !== false ? true : false
    const report = opts.report !== false ? true : false;
    
    if (report) reportViolations(results, "./jest-a11y-reports/report-" + format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"), false);    

    const violations = results.violations

    if (typeof violations === 'undefined') {
      throw new Error('No violations found in aXe results object')
    }

    const reporter = violations => {
      if (violations.length === 0) {
        return []
      }

      const lineBreak = '\n\n'
      const horizontalLine = '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500'

      return violations.map(violation => {
        const errorBody = violation.nodes.map(node => {
          const selector = node.target.join(', ')
          const expectedText = `Expected the HTML found at $('${selector}') to have no violations:` + lineBreak
          return verbose ? (
            expectedText +
            chalk.grey(node.html) +
            lineBreak +
            `Received:` +
            lineBreak +
            printReceived(`${violation.help} (${violation.id})`) +
            lineBreak +
            chalk.yellow(node.failureSummary) +
            lineBreak +
            `You can find more information on this issue here: \n` +
            chalk.blue(violation.helpUrl)) : (
            expectedText +
            chalk.grey(node.html) +
            lineBreak +
            `Received:` +
            lineBreak +
            printReceived(`${violation.help} (${violation.id})`)
          )
        }).join(lineBreak)

        return (errorBody)
      }).join(lineBreak + horizontalLine + lineBreak)
    }

    const formatedViolations = reporter(violations)
    const pass = error ? formatedViolations.length === 0 : true

    const message = () => {
      if (pass && error) {
        return
      }
      return matcherHint('.toHaveNoViolations') +
            '\n\n' +
            `${formatedViolations}`
    }

    if (!error) console.log(message());

    return { actual: violations, message, pass }
  }
}

module.exports = toHaveNoViolations;