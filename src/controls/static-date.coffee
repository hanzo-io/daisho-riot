Control = require './control'
moment = require 'moment'

module.exports = class StaticDate extends Control
  tag:  'daisho-static-date'
  html: '<div>{ format(input.ref.get(input.name)) }</div>'
  init: ()->
    super
  format: (date)->
    moment(date).format('LLL')
