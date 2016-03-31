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

    @inputs.filter.on 'change', ()=>
      @update()


