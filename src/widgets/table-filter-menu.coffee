Menu = require './menu'

module.exports = class TableFilterMenu extends Menu
  tag: 'daisho-table-filter-menu-widget'

  configs:
    filter: null

  #
  # In the form of:
  #
  # data: refer
  #     filter: 'filter field'
  #     ... other fields ...
  #
  data: null

  #
  # Data for constructing the filter menu
  # In the form of:
  #
  # filterData: refer
  #     options: [
  #         {
  #             name:   'Display/Filter Name'
  #             id:     'Data Field Id in SearchData'
  #             tag:    'Tag to Mount'
  #             options: {
  #                 # options to pass into the daisho-poly-control
  #             }
  #         }
  #     ]
  #
  filterData: null

  html: require '../../templates/table-filter-menu-widget.html'

  init: ()->
    super
