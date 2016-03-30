#Polymorphic Control
require './poly'

module.exports =
  #Generic Control
  Control:          require './control'
  Text:             require './text'
  Filter:           require './filter'

  #Static Fields
  StaticText:       require './static-text'
  StaticDate:       require './static-date'
  StaticAgo:        require './static-ago'

  register: (m)->
    @Text.register(m)
    @Filter.register(m)

    @StaticText.register(m)
    @StaticDate.register(m)
    @StaticAgo.register(m)
