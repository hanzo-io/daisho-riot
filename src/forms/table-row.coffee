CrowdControl = require 'crowdcontrol'

module.exports = class TableRow extends CrowdControl.Views.Form
  tag: 'table-row'
  # should get this from parent
  configs: null

  # should get this from parent
  tableData: null

  # ref of an element in the tableData.get('item') array
  data: null

  html: require '../../templates/table-row.html'

  init: ()->
    @configs    ?= @parent.configs
    @tableData  ?= @parent.tableData

    super

