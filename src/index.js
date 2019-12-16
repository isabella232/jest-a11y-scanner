'use strict'
const toHaveNoViolations = require("./toHaveNoViolations");
const toAuditNoViolations = require("./toAuditNoViolations");
const reportViolations = require("./reportViolations");
const configureAxe = require("./configureAxe");


module.exports = {
  configureAxe,
  axe: configureAxe(),
  toHaveNoViolations,
  toAuditNoViolations,
  reportViolations
}
