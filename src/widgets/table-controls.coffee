CrowdControl = require 'crowdcontrol'
refer = require 'referential'
$ = require 'jquery'

module.exports = class TableControls extends CrowdControl.Views.View
  tag: 'daisho-table-controls-widget'

  # Config for table-filter-menu form, can be identical to the one used by the table-widget
  configs: []

  #
  # Data for constructing query string
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

  html: require '../../templates/table-controls-widget.html'

  init: ()->
    @data = refer { filter: ''} if !@data?
    if !@data.get('filter')?
      @data.set 'filter', ''
    @filterData = refer { options: [] } if !@filterData?

    super

  countWords: ()->
    count = @data.get 'count'
    if count == 1
      return "#{ count } #{ @nameSingular }"
    else
      return "#{ count } #{ @namePlural }"

  sortWords: ()->
    sort = @data.get 'sort'
    sort = sort.substr(1) if sort[0] == '-'
    lsort = sort.toLowerCase()

    columns = @data.get 'columns'
    for column in columns
      if column.id.toLowerCase() == lsort
        return column.name

    return sort

  resetMenus: (event)->
    if event?
      $toggle = $(@root).find('#' + event.target.htmlFor)
      value = $toggle.prop 'checked'

    $(@root).find('.menu-toggle').prop 'checked', false

    if event?
      $toggle.prop 'checked', !value

  ignore: (event)->
    event.stopPropagation()
    event.preventDefault()
    return false

