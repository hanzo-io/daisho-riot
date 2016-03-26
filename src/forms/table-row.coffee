CrowdControl = require 'crowdcontrol'

module.exports = class TableRow extends CrowdControl.Views.Form
  tag: 'table-row'
  # should get this from parent
  configs: null

  # should get this from parent
  data: null

  # should get this from parent
  columns: null

  html: require '../../templates/table-row.html'
