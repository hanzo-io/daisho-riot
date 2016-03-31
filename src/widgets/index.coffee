module.exports =
  TableWidget:  require './table'
  MenuWidget:   require './menu'

  register: ()->
    @TableWidget.register()
    @MenuWidget.register()
