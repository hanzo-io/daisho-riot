CrowdControl = require 'crowdcontrol'
refer = require 'referential'

module.exports = class Table extends CrowdControl.Views.View
  tag: 'daisho-table-widget'

  # Display name for table summary string
  nameSinglular: 'Thing'
  namePlural: 'Things'

  # Config for table-row forms
  configs: []

  #
  # Data for rendering into table-row forms, same format as the one used for table-widgets
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
