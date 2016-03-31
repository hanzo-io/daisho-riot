#Polymorphic Control
require './poly'

module.exports =
  #Generic Control
  Control:          require './control'
  Text:             require './text'
  InlineText:       require './inline-text'

  #Static Fields
  StaticText:       require './static-text'
  StaticDate:       require './static-date'
  StaticAgo:        require './static-ago'

  register: (m)->
    @Text.register(m)
    @InlineText.register(m)

    @StaticText.register(m)
    @StaticDate.register(m)
    @StaticAgo.register(m)
