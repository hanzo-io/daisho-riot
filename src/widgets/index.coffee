module.exports =
  Table:            require './table'
  TableControls:     require './table-controls'
  Menu:             require './menu'
  TableFilterMenu:  require './table-filter-menu'

  register: ()->
    @Table.register()
    @TableControls.register()
    @Menu.register()
    @TableFilterMenu.register()
