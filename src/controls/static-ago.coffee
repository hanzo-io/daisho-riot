Control = require './control'
moment = require 'moment'

module.exports = class StaticAgo extends Control
  tag:  'daisho-static-ago'
  html: '<div>{ ago(input.ref.get(input.name)) }</div>'
  init: ()->
    super
  ago: (date)->
    moment(date).fromNow()
