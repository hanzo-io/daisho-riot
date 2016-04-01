Menu = require './menu'

module.exports = class TableFilterMenu extends Menu
  tag: 'daisho-table-filter-menu-widget'
  # should get this from parent
  configs:
    filter: null

  #
  # In the form of:
  #
  # data: refer
  #     filter: 'filter field'
  #     ... other field ...
  #
  data: null

  #
  # Data for constructing the filter menu
  # In the form of:
  #
  # filterData: refer
  #     options: [
  #         {
  #             name:   'Display Name'
  #             id:     'Data Field Id in SearchData'
  #             tag:    'Tag to Mount'
  #             action: (event)->
  #                 // Do a thing
  #         }
  #     ]
  #
  filterData: null

  html: require '../../templates/table-filter-menu-widget.html'

  init: ()->
    @configs.filter = null if !@configs.filter?

    super

