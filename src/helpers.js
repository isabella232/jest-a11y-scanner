'use-strict'

/**
 * Checks if the HTML parameter provided is a HTML element.
 * @param {Element} a HTML element or a HTML string
 * @returns {boolean} true or false
 */
function isHTMLElement (html) {
  return !!html && typeof html === 'object' && typeof html.tagName === 'string'
}

/**
 * Checks that the HTML parameter provided is a string that contains HTML.
 * @param {string} a HTML element or a HTML string
 * @returns {boolean} true or false
 */
function isHTMLString (html) {
  return typeof html === 'string' && /(<([^>]+)>)/i.test(html)
}

module.exports = { isHTMLElement, isHTMLString };