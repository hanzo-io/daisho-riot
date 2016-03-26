Controls = require './controls'

module.exports =
  RiotPage: require './page'
  Events:   require './events'
  Controls: require './controls'
  Forms:    require './forms'
  Widgets:  require './widgets'

  register: ()->
    @Controls.register()
    @Forms.register()
    @Widgets.register()
