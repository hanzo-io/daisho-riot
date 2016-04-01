module.exports =
  filter: (options, filter)->
    ret = []
    for option in options
      ret.push(option) if (option.name.indexOf filter) > -1

    return ret
