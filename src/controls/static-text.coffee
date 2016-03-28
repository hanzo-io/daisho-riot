Control = require './control'
# placeholder = require '../utils/placeholder'

module.exports = class StaticText extends Control
  tag:  'daisho-static-text'
  html: '<div>{ input.ref.get(input.name) }</div>'
  init: ()->
    super
