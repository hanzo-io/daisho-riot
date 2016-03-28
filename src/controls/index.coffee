#Polymorphic Control
require './poly'

module.exports =
  #Generic Control
  Control:          require './control'
  Text:             require './text'

  #Static Fields
  StaticText:       require './static-text'

  register: (m)->
    @Text.register(m)
    @StaticText.register(m)
