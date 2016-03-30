module.exports =
  TableWidget: require './table'

  register: ()->
    @TableWidget.register()
