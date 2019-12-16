'use-strict'
const fs = require('fs')

/**
 * Writes out violation results to a text file
 * @param {object} results requires an instance of aXe's results object
 * (https://github.com/dequelabs/axe-core/blob/develop-2x/doc/API.md#results-object)
 * @param {string} path path string to where you want your file to be written to.
 */
function reportViolations (results, path) {
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
          node.html +
          lineBreak +
          `Received:` +
          lineBreak +
          `${violation.help} (${violation.id})` +
          lineBreak +
          node.failureSummary +
          lineBreak +
          `You can find more information on this issue here: \n` +
          violation.helpUrl
        )
      }).join(lineBreak)

      return (errorBody)
    }).join(lineBreak + horizontalLine + lineBreak)
  }

  const formatedViolations = reporter(violations)

  let message = `${formatedViolations}`
  if (message.length === 0) message = `No violations found!`

  fs.writeFile(path, message, () => {})
}

module.exports = reportViolations;