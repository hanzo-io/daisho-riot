{
  Page
} = require 'daisho-sdk'

riot = require 'riot'

module.exports = class RiotPage extends Page
  tag:  'tag'
  opts: null
  load: (@opts = {})->
  render: ()->
    el = document.createElement @tag
    @el.appendChild el

    @tag = (riot.mount @tag, @opts)[0]

  unload: ()->
    @tag.unmount()

