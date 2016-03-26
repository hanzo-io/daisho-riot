CrowdControl = require 'crowdcontrol'

module.exports = class TableWidget extends CrowdControl.Views.View
  tag: 'table-widget'
  # Config for table-row forms
  configs: []

  #
  # Column display data in the form of
  # [
  #     {
  #         id:     'Data Field Id'
  #         name:   'Name'
  #     }
  # ]
  #
  columns: []

  #
  # Data for rendering into rable-row forms
  # {
  #     meta: { ... meta data about tabular data ... }
  #     items: [
  #         { ... some data ... }
  #     ]
  # }
  #
  data: null

  html: require '../../templates/table-widget.html'
