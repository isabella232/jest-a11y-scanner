'use-strict'
const fs = require('fs')
const axeVersion = require('axe-core').version;

/**
 * Writes out violation results to a text file
 * @param {object} results requires an instance of aXe's results object
 * (https://github.com/dequelabs/axe-core/blob/develop-2x/doc/API.md#results-object)
 * @param {string} path path string to where you want your file to be written to.
 */
function reportViolations (results, path, append = false) {
  const violations = results.violations

  if (typeof violations === 'undefined') {
    throw new Error('No violations found in aXe results object')
  }
  const lineBreak = '\n\n'
  const horizontalLine = '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500'

  const reporter = violations => {
    if (violations.length === 0) {
      return []
    }


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

  let message = `${horizontalLine + horizontalLine + lineBreak}Report Date: ${new Date() + lineBreak}Axe-Core Version: ${axeVersion +
    lineBreak +
    horizontalLine +
    lineBreak +
    formatedViolations +
    lineBreak
  }`

  if (formatedViolations.length === 0) message = `No violations found!`

   if (!append) fs.writeFile(path, message, () => {})
   else {
    fs.appendFile(path, message, () => {});
   }
}

module.exports = reportViolations;