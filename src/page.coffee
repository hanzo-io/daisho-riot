{
  Page
} = require 'daisho-sdk'
riot = require('crowdcontrol').riot.riot

module.exports = class RiotPage extends Page
  tagEl:  'tag'
  opts: null
  load: (@opts = {})->
  render: ()->
    el = document.createElement @tag
    @el.appendChild el

    @tagEl = (riot.mount el, @tag, @opts)[0]
    @tagEl.update()

  unload: ()->
    @tagEl.unmount()

