CrowdControl = require 'crowdcontrol'
refer = require 'referential'

filter = (options, filter)->
  ret = []
  for option in options
    ret.push(option) if (option.name.indexOf filter) > -1

  return ret

module.exports = class MenuWidget extends CrowdControl.Views.Form
  tag: 'daisho-menu-widget'

  configs:
    filter: null

  # Show Option Filtering Input?
  filter: true

  # Placeholder Text
  filterPlaceholder: 'Type Something'

  options: []

  #
  # In the form of:
  #
  # data: refer
  #     filter: 'filter field'
  #     options: [
  #         {
  #             name:   "display name"
  #             action: (event)->
  #             // Do a thing
  #         }
  #     ]
  #
  data: []

  html: require '../../templates/menu-widget.html'

  init: ()->
    @data = refer { filter: '' } if !@data?

    super

    @on 'update', =>
      @options = filter @data.get('options'), @data.get 'filter'

    @inputs.filter.on 'change', =>
      @update()

  noResults: ->
    return @options.length == 0
