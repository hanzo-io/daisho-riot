{
  Page
} = require 'daisho-sdk'

riot = require 'riot'

module.exports = class RiotPage extends Page
  tagEl:  'tag'
  opts: null
  load: (@opts = {})->
  render: ()->
    el = document.createElement @tag
    @el.appendChild el

    @tagEl = (riot.mount @tag, @opts)[0]

  unload: ()->
    @tagEl.unmount()

