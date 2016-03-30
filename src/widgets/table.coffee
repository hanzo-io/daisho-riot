CrowdControl = require 'crowdcontrol'
refer = require 'referential'

module.exports = class TableWidget extends CrowdControl.Views.View
  tag: 'daisho-table-widget'
  # Config for table-row forms
  configs: []

  #
  # Data for rendering into rable-row forms
  # {
  #     columns: [
  #         {
  #             id:     'Data Field Id'
  #             name:   'Name'
  #             tag:    'Tag to Mount'
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
