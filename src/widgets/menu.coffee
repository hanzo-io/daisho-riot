CrowdControl = require 'crowdcontrol'
refer = require 'referential'
{ filter } = require '../utils/menu'

module.exports = class Menu extends CrowdControl.Views.Form
  tag: 'daisho-menu-widget'

  configs:
    filter: null

  # Show Option Filtering Input?
  filter: true

  # Placeholder Text
  filterPlaceholder: 'Type Something'

  options: []

  #
  # Data for constructing the filter menu
  # In the form of:
  #
  # filterData: refer
  #     options: [
  #         {
  #             name:   'Display Name'
  #             action: (event)->
  #                 // Do a thing
  #         }
  #     ]
  #
  filterData: null

  #
  # In the form of:
  #
  # data: refer
  #     filter: 'filter field'
  #
  data: null

  html: require '../../templates/menu-widget.html'

  init: ()->
    @data = refer { filter: ''} if !@data?
    @filterData = refer { options: [] } if !@filterData?

    super

    @on 'update', =>
      @options = filter @filterData.get('options'), @data.get 'filter'

    @inputs.filter.on 'change', =>
      @update()

  noResults: ->
    return @options.length == 0
