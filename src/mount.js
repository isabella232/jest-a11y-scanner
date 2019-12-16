'use strict'
const { isHTMLElement, isHTMLString } = require("./helpers");

/**
 * Converts a HTML string or HTML element to a mounted HTML element.
 * @param {Element | string} a HTML element or a HTML string
 * @returns {[Element, function]} a HTML element and a function to restore the document
 */
function mount (html) {
  if (isHTMLElement(html)) {
    if (document.body.contains(html)) {
      return [html, () => undefined]
    }

    html = html.outerHTML
  }

  if (isHTMLString(html)) {
    const originalHTML = document.body.innerHTML
    const restore = () => {
      document.body.innerHTML = originalHTML
    }

    document.body.innerHTML = html
    return [document.body, restore]
  }

  if (typeof html === 'string') {
    throw new Error(`html parameter ("${html}") has no elements`)
  }

  throw new Error(`html parameter should be an HTML string or an HTML element`)
}

module.exports = mount;