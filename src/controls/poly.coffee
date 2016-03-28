riot = require('crowdcontrol').riot.riot

module.exports = riot.tag "daisho-poly-control", "", (opts)->
  if opts.tag?
    tag = opts.tag
    delete opts.tag

    el = document.createElement tag
    @root.appendChild el

    opts.parent = @.parent
    tagEl = riot.mount(el, tag, opts)[0]
    tagEl.update()
