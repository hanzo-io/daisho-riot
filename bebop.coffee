fs        = require 'fs'
path      = require 'path'
exec      = require('executive').interactive
requisite = require 'requisite'

bundles =
  'index.js':
    entry:         'src/index.coffee'
    globalRequire: true
    includeAsync:  true
    regex:         /src\//

compileCoffee = (src) ->
  src = src.replace process.cwd(), ''

  for dest, opts of bundles
    if opts.regex.test src
      return requisite.bundle opts, (err, bundle) ->
        return console.error err if err?
        fs.writeFileSync dest, bundle.toString(), 'utf8'
        console.log 'compiled ' + dest

module.exports =
  port: 4242

  fallback: 'example/index.html'

  cwd: process.cwd()

  exclude: [
    /lib/
    /node_modules/
    /vendor/
  ]

  compilers:
    css: -> false

    coffee: compileCoffee

    styl: (src, dst) ->
      CleanCSS     = require 'clean-css'
      autoprefixer = require 'autoprefixer'
      comments     = require 'postcss-discard-comments'
      lost         = require 'lost-stylus'
      postcss      = require 'poststylus'
      rupture      = require 'rupture'
      stylus       = require 'stylus'

      src = 'css/main.styl'
      dst = 'main.css'

      style = stylus fs.readFileSync src, 'utf8'
        .set 'filename', src
        .set 'include css', true
        .set 'sourcemap',
          basePath: ''
          sourceRoot: '../'
        .use lost()
        .use rupture()
        .use postcss [
          autoprefixer browsers: '> 1%'
          'lost'
          'rucksack-css'
          'css-mqpacker'
          comments removeAll: true
        ]

      style.render (err, css) ->
        return console.error err if err

        sourceMapURL = (path.basename dst) + '.map'

        unless process.env.PRODUCTION
          css = css + "/*# sourceMappingURL=#{sourceMapURL} */"

          fs.writeFile dst, css, 'utf8'
          fs.writeFile dst + '.map', JSON.stringify style.sourcemap, 'utf8'
          return

        minified = new CleanCSS
          semanticMerging: false
          # sourceMap:       style.sourcemap
        .minify css

        fs.writeFile dst, minified.styles, 'utf8'

        # styles = minified.styles + "/*# sourceMappingURL=#{sourceMapURL} */"
        # fs.writeFileSync dst, styles, 'utf8'
        # fs.writeFileSync dst + '.map', minified.sourceMap, 'utf8'

      true

