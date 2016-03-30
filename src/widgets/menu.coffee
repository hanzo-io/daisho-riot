CrowdControl = require 'crowdcontrol'
refer = require 'referential'

module.exports = class MenuWidget extends CrowdControl.Views.Form
  tag: 'daisho-menu-widget'

  configs:
    filter: null

  # Show Option Filtering Input?
  filter: true

  # Placeholder Text
  filterPlaceholder: 'Type Something'

  #
  # In the form of:
  #
  # options:
  #   Option: (event)->
  #     // Do a thing
  #
  options: {}

  html: require '../../templates/menu-widget.html'

  init: ()->
    @data = refer { filter: '' } if !@data?

    super

    @inputs.filter.on 'change', ()=>
      @update()
