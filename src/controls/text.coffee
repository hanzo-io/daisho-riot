Control = require './control'
# placeholder = require '../utils/placeholder'

module.exports = class Text extends Control
  tag:  'text-control'
  type: 'text'
  html: require '../../templates/text.html'
  formElement: 'input'
  init: ()->
    super

    console.log 'text intiialized'

    @on 'updated', =>
      el = @root.getElementsByTagName(@formElement)[0]

      # if @type != 'password'
      #   placeholder el
