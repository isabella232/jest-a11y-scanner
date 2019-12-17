'use strict'
// Not using at the moment
const chalk = require('chalk')
const { printReceived, matcherHint } = require('jest-matcher-utils')

/**
 * Custom Jest expect matcher, that can check aXe results for violations.
 * This matcher will never cause a test to fail. It simply consoles out the error if one exists.
 * @param {object} object requires an instance of aXe's results object
 * (https://github.com/dequelabs/axe-core/blob/develop-2x/doc/API.md#results-object)
 * @returns {object} returns Jest matcher object
 */
const toAuditNoViolations = {
  toAuditNoViolations (results) {
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
          return (
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
            chalk.blue(violation.helpUrl)
          )
        }).join(lineBreak)

        return (errorBody)
      }).join(lineBreak + horizontalLine + lineBreak)
    }

    const formatedViolations = reporter(violations)
    const pass = true;

    const message = () => {
      return matcherHint('.toAuditNoViolations') +
            '\n\n' +
            `${formatedViolations}`
    }

    console.log(message());
    return { actual: violations, message, pass }
  }
}

module.exports = toAuditNoViolations;