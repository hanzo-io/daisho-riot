module.exports =
  filter: (options, filter)->
    ret = []
    for option in options
      ret.push(option) if (option.name.toLowerCase().indexOf filter.toLowerCase()) > -1

    return ret
