Control = require './control'

module.exports = class Text extends Control
  tag:  'daisho-text-control'
  type: 'text'
  html: require '../../templates/text.html'

  # Check on every key press
  realtime: false

  init: ()->
    super

  keyup: ()->
    if @realtime
      @change.apply @, arguments

    return true


