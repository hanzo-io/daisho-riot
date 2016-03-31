Text = require './text'
placeholder = require '../utils/placeholder'

module.exports = class InlineText extends Text
  tag:      'daisho-inline-text-control'
  html:     require '../../templates/inline-text.html'
  type:     'text'
  label:    ''
  init: ()->
    super

    @on 'updated', =>
      el = @root.getElementsByTagName(@formElement)[0]

      if @type != 'password'
        placeholder el

