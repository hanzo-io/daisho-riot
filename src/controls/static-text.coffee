Control = require './control'

module.exports = class StaticText extends Control
  tag:  'daisho-static-text'
  html: '<div>{ input.ref.get(input.name) }</div>'
  init: ()->
    super
