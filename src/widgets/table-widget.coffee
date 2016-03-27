CrowdControl = require 'crowdcontrol'
refer = require 'referential'

module.exports = class TableWidget extends CrowdControl.Views.View
  tag: 'table-widget'
  # Config for table-row forms
  configs: []

  #
  # Column display data in the form of
  #
  columns: refer []

  #
  # Data for rendering into rable-row forms
  # {
  #     columns: [
  #         {
  #             id:     'Data Field Id'
  #             name:   'Name'
  #         }
  #     ]
  #     items: [
  #         { ... some data ... }
  #     ]
  #     page:   1 // current page
  #     count:  0 // Total Items
  #     sort:   'SortString'
  # }
  #
  data: refer {}

  html: require '../../templates/table-widget.html'
