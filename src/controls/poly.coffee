riot = require('crowdcontrol').riot.riot

#
# This is a special tag that renders other control tags into it
# specify the tag by using the tag attribute.  Optionally supply
# a opt-override attribute to supply a replacement set of options
# to the rendered control tag.  Otherwise it just transparently
# passes attributes set on the daisho-poly-control tag into the
# rendered control tag.
#
module.exports = riot.tag "daisho-poly-control", "", (opts)->
  if opts.tag?
    tag = opts.tag
    delete opts.tag

    # opts-override="{ ... }" is used for replacing poly opts with a custom opts object
    if opts.optsOverride?
      opts = opts.optsOverride

    el = document.createElement tag
    @root.appendChild el

    opts.parent = @.parent
    tagEl = riot.mount(el, tag, opts)[0]
    tagEl.update()
