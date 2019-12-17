'use strict'
const toHaveNoViolations = require("./toHaveNoViolations");
const reportViolations = require("./reportViolations");
const configureAxe = require("./configureAxe");


module.exports = {
  configureAxe,
  axe: configureAxe(),
  toHaveNoViolations,
  reportViolations
}
