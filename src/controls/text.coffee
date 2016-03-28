Control = require './control'
# placeholder = require '../utils/placeholder'

module.exports = class Text extends Control
  tag:  'daisho-text-control'
  type: 'text'
  html: require '../../templates/text.html'
  init: ()->
    super
