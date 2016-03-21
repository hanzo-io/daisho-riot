Controls = require './controls'

module.exports =
  RiotPage: require './page'
  Events:   require './events'
  register: (m)->
    Controls.register(m)

