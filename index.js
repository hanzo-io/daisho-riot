(function (global) {
  var process = {
    title: 'browser',
    browser: true,
    env: {},
    argv: [],
    nextTick: function (fn) {
      setTimeout(fn, 0)
    },
    cwd: function () {
      return '/'
    },
    chdir: function () {
    }
  };
  // Require module
  function require(file, cb) {
    // Handle async require
    if (typeof cb == 'function') {
      return require.load(file, cb)
    }
    // Return module from cache
    if ({}.hasOwnProperty.call(require.cache, file))
      return require.cache[file];
    var resolved = require.resolve(file);
    if (!resolved)
      throw new Error('Failed to resolve module ' + file);
    var mod = {
      id: file,
      require: require,
      filename: file,
      exports: {},
      loaded: false,
      parent: null,
      children: []
    };
    var dirname = file.slice(0, file.lastIndexOf('/') + 1);
    require.cache[file] = mod.exports;
    resolved.call(mod.exports, mod, mod.exports, dirname, file, process);
    mod.loaded = true;
    return require.cache[file] = mod.exports
  }
  require.modules = {};
  require.cache = {};
  require.resolve = function (file) {
    return {}.hasOwnProperty.call(require.modules, file) ? require.modules[file] : void 0
  };
  // define normal static module
  require.define = function (file, fn) {
    require.modules[file] = fn
  };
  require.waiting = {};
  // Determine base path for all modules
  var scripts = document.getElementsByTagName('script');
  var file = scripts[scripts.length - 1].src;
  require.basePath = file.slice(0, file.lastIndexOf('/') + 1);
  // Generate URL for module
  require.urlFor = function (file) {
    var url = file.replace(/^\.?\//, '');
    if (!/\.js$/.test(url))
      url = url + '.js';
    return require.basePath + url
  };
  // Load module async module
  require.load = function (file, cb) {
    // Immediately return previously loaded modules
    if (require.modules[file] != null)
      return cb(require(file));
    // Build URL to request module at
    var url = require.urlFor(file);
    var script = document.createElement('script'), scripts = document.getElementsByTagName('script')[0], callbacks = require.waiting[file] = require.waiting[file] || [];
    // We'll be called when async module is defined.
    callbacks.push(cb);
    // Load module
    script.type = 'text/javascript';
    script.async = true;
    script.src = url;
    script.file = file;
    scripts.parentNode.insertBefore(script, scripts)
  };
  // Define async module
  require.async = function (file, fn) {
    require.modules[file] = fn;
    var cb;
    while (cb = require.waiting[file].shift())
      cb(require(file))
  };
  global.require = require;
  // source: src/controls/index.coffee
  require.define('./controls', function (module, exports, __dirname, __filename, process) {
    module.exports = {
      Control: require('./controls/control'),
      Text: require('./controls/text'),
      register: function (m) {
        return this.Text.register(m)
      }
    }
  });
  // source: src/controls/control.coffee
  require.define('./controls/control', function (module, exports, __dirname, __filename, process) {
    var Control, CrowdControl, Events, riot, scrolling, extend = function (child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key]
        }
        function ctor() {
          this.constructor = child
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor;
        child.__super__ = parent.prototype;
        return child
      }, hasProp = {}.hasOwnProperty;
    CrowdControl = require('crowdcontrol/lib');
    Events = require('./events');
    riot = require('riot/riot');
    scrolling = false;
    module.exports = Control = function (superClass) {
      extend(Control, superClass);
      function Control() {
        return Control.__super__.constructor.apply(this, arguments)
      }
      Control.prototype.init = function () {
        if (this.input == null && this.inputs != null) {
          this.input = this.inputs[this.lookup]
        }
        if (this.input != null) {
          return Control.__super__.init.apply(this, arguments)
        }
      };
      Control.prototype.getValue = function (event) {
        var ref;
        return (ref = $(event.target).val()) != null ? ref.trim() : void 0
      };
      Control.prototype.error = function (err) {
        var ref;
        if (err instanceof DOMException) {
          console.log('WARNING: Error in riot dom manipulation ignored.', err);
          return
        }
        Control.__super__.error.apply(this, arguments);
        if (!scrolling) {
          scrolling = true;
          $('html, body').animate({ scrollTop: $(this.root).offset().top - $(window).height() / 2 }, {
            complete: function () {
              return scrolling = false
            },
            duration: 500
          })
        }
        return (ref = this.m) != null ? ref.trigger(Events.ChangeFailed, this.input.name, this.input.ref.get(this.input.name)) : void 0
      };
      Control.prototype.change = function () {
        var ref;
        Control.__super__.change.apply(this, arguments);
        return (ref = this.m) != null ? ref.trigger(Events.Change, this.input.name, this.input.ref.get(this.input.name)) : void 0
      };
      Control.prototype.changed = function (value) {
        var ref;
        if ((ref = this.m) != null) {
          ref.trigger(Events.ChangeSuccess, this.input.name, value)
        }
        return riot.update()
      };
      Control.register = function (m) {
        var v;
        v = Control.__super__.constructor.register.call(this);
        return v.m = m
      };
      return Control
    }(CrowdControl.Views.Input)
  });
  // source: node_modules/crowdcontrol/lib/index.js
  require.define('crowdcontrol/lib', function (module, exports, __dirname, __filename, process) {
    // Generated by CoffeeScript 1.10.0
    var CrowdControl, r, riot;
    r = require('crowdcontrol/lib/riot');
    riot = r();
    CrowdControl = {
      Views: require('crowdcontrol/lib/views'),
      tags: [],
      start: function (opts) {
        return this.tags = riot.mount('*', opts)
      },
      update: function () {
        var i, len, ref, results, tag;
        ref = this.tags;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          tag = ref[i];
          results.push(tag.update())
        }
        return results
      },
      riot: r
    };
    if (module.exports != null) {
      module.exports = CrowdControl
    }
    if (typeof window !== 'undefined' && window !== null) {
      if (window.Crowdstart != null) {
        window.Crowdstart.Crowdcontrol = CrowdControl
      } else {
        window.Crowdstart = { CrowdControl: CrowdControl }
      }
    }  //# sourceMappingURL=index.js.map
  });
  // source: node_modules/crowdcontrol/lib/riot.js
  require.define('crowdcontrol/lib/riot', function (module, exports, __dirname, __filename, process) {
    // Generated by CoffeeScript 1.10.0
    var r;
    r = function () {
      return this.riot
    };
    r.set = function (riot) {
      this.riot = riot
    };
    r.riot = typeof window !== 'undefined' && window !== null ? window.riot : void 0;
    module.exports = r  //# sourceMappingURL=riot.js.map
  });
  // source: node_modules/crowdcontrol/lib/views/index.js
  require.define('crowdcontrol/lib/views', function (module, exports, __dirname, __filename, process) {
    // Generated by CoffeeScript 1.10.0
    module.exports = {
      Form: require('crowdcontrol/lib/views/form'),
      Input: require('crowdcontrol/lib/views/input'),
      View: require('crowdcontrol/lib/views/view')
    }  //# sourceMappingURL=index.js.map
  });
  // source: node_modules/crowdcontrol/lib/views/form.js
  require.define('crowdcontrol/lib/views/form', function (module, exports, __dirname, __filename, process) {
    // Generated by CoffeeScript 1.10.0
    var Form, Promise, View, inputify, observable, settle, extend = function (child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key]
        }
        function ctor() {
          this.constructor = child
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor;
        child.__super__ = parent.prototype;
        return child
      }, hasProp = {}.hasOwnProperty;
    View = require('crowdcontrol/lib/views/view');
    inputify = require('crowdcontrol/lib/views/inputify');
    observable = require('crowdcontrol/lib/riot')().observable;
    Promise = require('broken/lib');
    settle = require('promise-settle');
    Form = function (superClass) {
      extend(Form, superClass);
      function Form() {
        return Form.__super__.constructor.apply(this, arguments)
      }
      Form.prototype.configs = null;
      Form.prototype.inputs = null;
      Form.prototype.data = null;
      Form.prototype.initInputs = function () {
        var input, name, ref, results1;
        this.inputs = {};
        if (this.configs != null) {
          this.inputs = inputify(this.data, this.configs);
          ref = this.inputs;
          results1 = [];
          for (name in ref) {
            input = ref[name];
            results1.push(observable(input))
          }
          return results1
        }
      };
      Form.prototype.init = function () {
        return this.initInputs()
      };
      Form.prototype.submit = function () {
        var input, name, pRef, ps, ref;
        ps = [];
        ref = this.inputs;
        for (name in ref) {
          input = ref[name];
          pRef = {};
          input.trigger('validate', pRef);
          ps.push(pRef.p)
        }
        return settle(ps).then(function (_this) {
          return function (results) {
            var i, len, result;
            for (i = 0, len = results.length; i < len; i++) {
              result = results[i];
              if (!result.isFulfilled()) {
                return
              }
            }
            return _this._submit.apply(_this, arguments)
          }
        }(this))
      };
      Form.prototype._submit = function () {
      };
      return Form
    }(View);
    module.exports = Form  //# sourceMappingURL=form.js.map
  });
  // source: node_modules/crowdcontrol/lib/views/view.js
  require.define('crowdcontrol/lib/views/view', function (module, exports, __dirname, __filename, process) {
    // Generated by CoffeeScript 1.10.0
    var View, collapsePrototype, isFunction, objectAssign, riot, setPrototypeOf;
    riot = require('crowdcontrol/lib/riot')();
    objectAssign = require('object-assign');
    setPrototypeOf = function () {
      var mixinProperties, setProtoOf;
      setProtoOf = function (obj, proto) {
        return obj.__proto__ = proto
      };
      mixinProperties = function (obj, proto) {
        var prop, results;
        results = [];
        for (prop in proto) {
          if (obj[prop] == null) {
            results.push(obj[prop] = proto[prop])
          } else {
            results.push(void 0)
          }
        }
        return results
      };
      if (Object.setPrototypeOf || { __proto__: [] } instanceof Array) {
        return setProtoOf
      } else {
        return mixinProperties
      }
    }();
    isFunction = require('is-function');
    collapsePrototype = function (collapse, proto) {
      var parentProto;
      if (proto === View.prototype) {
        return
      }
      parentProto = Object.getPrototypeOf(proto);
      collapsePrototype(collapse, parentProto);
      return objectAssign(collapse, parentProto)
    };
    View = function () {
      View.register = function () {
        return new this
      };
      View.prototype.tag = '';
      View.prototype.html = '';
      View.prototype.css = '';
      View.prototype.attrs = '';
      View.prototype.events = null;
      function View() {
        var newProto;
        newProto = collapsePrototype({}, this);
        this.beforeInit();
        riot.tag(this.tag, this.html, this.css, this.attrs, function (opts) {
          var fn, handler, k, name, parent, proto, ref, self, v;
          if (newProto != null) {
            for (k in newProto) {
              v = newProto[k];
              if (isFunction(v)) {
                (function (_this) {
                  return function (v) {
                    var oldFn;
                    if (_this[k] != null) {
                      oldFn = _this[k];
                      return _this[k] = function () {
                        oldFn.apply(_this, arguments);
                        return v.apply(_this, arguments)
                      }
                    } else {
                      return _this[k] = function () {
                        return v.apply(_this, arguments)
                      }
                    }
                  }
                }(this)(v))
              } else {
                this[k] = v
              }
            }
          }
          self = this;
          parent = self.parent;
          proto = Object.getPrototypeOf(self);
          while (parent != null && parent !== proto) {
            setPrototypeOf(self, parent);
            self = parent;
            parent = self.parent;
            proto = Object.getPrototypeOf(self)
          }
          if (opts != null) {
            for (k in opts) {
              v = opts[k];
              this[k] = v
            }
          }
          if (this.events != null) {
            ref = this.events;
            fn = function (_this) {
              return function (name, handler) {
                if (typeof handler === 'string') {
                  return _this.on(name, function () {
                    return _this[handler].apply(_this, arguments)
                  })
                } else {
                  return _this.on(name, function () {
                    return handler.apply(_this, arguments)
                  })
                }
              }
            }(this);
            for (name in ref) {
              handler = ref[name];
              fn(name, handler)
            }
          }
          return this.init(opts)
        })
      }
      View.prototype.beforeInit = function () {
      };
      View.prototype.init = function () {
      };
      return View
    }();
    module.exports = View  //# sourceMappingURL=view.js.map
  });
  // source: node_modules/object-assign/index.js
  require.define('object-assign', function (module, exports, __dirname, __filename, process) {
    /* eslint-disable no-unused-vars */
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;
    function toObject(val) {
      if (val === null || val === undefined) {
        throw new TypeError('Object.assign cannot be called with null or undefined')
      }
      return Object(val)
    }
    module.exports = Object.assign || function (target, source) {
      var from;
      var to = toObject(target);
      var symbols;
      for (var s = 1; s < arguments.length; s++) {
        from = Object(arguments[s]);
        for (var key in from) {
          if (hasOwnProperty.call(from, key)) {
            to[key] = from[key]
          }
        }
        if (Object.getOwnPropertySymbols) {
          symbols = Object.getOwnPropertySymbols(from);
          for (var i = 0; i < symbols.length; i++) {
            if (propIsEnumerable.call(from, symbols[i])) {
              to[symbols[i]] = from[symbols[i]]
            }
          }
        }
      }
      return to
    }
  });
  // source: node_modules/is-function/index.js
  require.define('is-function', function (module, exports, __dirname, __filename, process) {
    module.exports = isFunction;
    var toString = Object.prototype.toString;
    function isFunction(fn) {
      var string = toString.call(fn);
      return string === '[object Function]' || typeof fn === 'function' && string !== '[object RegExp]' || typeof window !== 'undefined' && (fn === window.setTimeout || fn === window.alert || fn === window.confirm || fn === window.prompt)
    }
    ;
  });
  // source: node_modules/crowdcontrol/lib/views/inputify.js
  require.define('crowdcontrol/lib/views/inputify', function (module, exports, __dirname, __filename, process) {
    // Generated by CoffeeScript 1.10.0
    var Promise, inputify, isFunction, isRef, refer;
    Promise = require('broken/lib');
    isFunction = require('is-function');
    refer = require('referential/lib');
    isRef = function (o) {
      return o != null && isFunction(o.ref)
    };
    inputify = function (data, configs) {
      var config, fn, inputs, name, ref;
      ref = data;
      if (!isRef(ref)) {
        ref = refer(data)
      }
      inputs = {};
      fn = function (name, config) {
        var fn1, i, input, len, middleware, middlewareFn, validate;
        middleware = [];
        if (config && config.length > 0) {
          fn1 = function (name, middlewareFn) {
            return middleware.push(function (pair) {
              ref = pair[0], name = pair[1];
              return Promise.resolve(pair).then(function (pair) {
                return middlewareFn.call(pair[0], pair[0].get(pair[1]), pair[1], pair[0])
              }).then(function (v) {
                ref.set(name, v);
                return pair
              })
            })
          };
          for (i = 0, len = config.length; i < len; i++) {
            middlewareFn = config[i];
            fn1(name, middlewareFn)
          }
        }
        middleware.push(function (pair) {
          ref = pair[0], name = pair[1];
          return Promise.resolve(ref.get(name))
        });
        validate = function (ref, name) {
          var j, len1, p;
          p = Promise.resolve([
            ref,
            name
          ]);
          for (j = 0, len1 = middleware.length; j < len1; j++) {
            middlewareFn = middleware[j];
            p = p.then(middlewareFn)
          }
          return p
        };
        input = {
          name: name,
          ref: ref,
          config: config,
          validate: validate
        };
        return inputs[name] = input
      };
      for (name in configs) {
        config = configs[name];
        fn(name, config)
      }
      return inputs
    };
    module.exports = inputify  //# sourceMappingURL=inputify.js.map
  });
  // source: node_modules/broken/lib/index.js
  require.define('broken/lib', function (module, exports, __dirname, __filename, process) {
    // Generated by CoffeeScript 1.10.0
    var Promise, PromiseInspection;
    Promise = require('zousan/zousan-min');
    Promise.suppressUncaughtRejectionError = false;
    PromiseInspection = function () {
      function PromiseInspection(arg) {
        this.state = arg.state, this.value = arg.value, this.reason = arg.reason
      }
      PromiseInspection.prototype.isFulfilled = function () {
        return this.state === 'fulfilled'
      };
      PromiseInspection.prototype.isRejected = function () {
        return this.state === 'rejected'
      };
      return PromiseInspection
    }();
    Promise.reflect = function (promise) {
      return new Promise(function (resolve, reject) {
        return promise.then(function (value) {
          return resolve(new PromiseInspection({
            state: 'fulfilled',
            value: value
          }))
        })['catch'](function (err) {
          return resolve(new PromiseInspection({
            state: 'rejected',
            reason: err
          }))
        })
      })
    };
    Promise.settle = function (promises) {
      return Promise.all(promises.map(Promise.reflect))
    };
    Promise.prototype.callback = function (cb) {
      if (typeof cb === 'function') {
        this.then(function (value) {
          return cb(null, value)
        });
        this['catch'](function (error) {
          return cb(error, null)
        })
      }
      return this
    };
    module.exports = Promise  //# sourceMappingURL=index.js.map
  });
  // source: node_modules/zousan/zousan-min.js
  require.define('zousan/zousan-min', function (module, exports, __dirname, __filename, process) {
    !function (t) {
      'use strict';
      function e(t) {
        if (t) {
          var e = this;
          t(function (t) {
            e.resolve(t)
          }, function (t) {
            e.reject(t)
          })
        }
      }
      function n(t, e) {
        if ('function' == typeof t.y)
          try {
            var n = t.y.call(i, e);
            t.p.resolve(n)
          } catch (o) {
            t.p.reject(o)
          }
        else
          t.p.resolve(e)
      }
      function o(t, e) {
        if ('function' == typeof t.n)
          try {
            var n = t.n.call(i, e);
            t.p.resolve(n)
          } catch (o) {
            t.p.reject(o)
          }
        else
          t.p.reject(e)
      }
      var r, i, c = 'fulfilled', u = 'rejected', s = 'undefined', f = function () {
          function t() {
            for (; e.length - n;)
              e[n](), e[n++] = i, n == o && (e.splice(0, o), n = 0)
          }
          var e = [], n = 0, o = 1024, r = function () {
              if (typeof MutationObserver !== s) {
                var e = document.createElement('div'), n = new MutationObserver(t);
                return n.observe(e, { attributes: !0 }), function () {
                  e.setAttribute('a', 0)
                }
              }
              return typeof setImmediate !== s ? function () {
                setImmediate(t)
              } : function () {
                setTimeout(t, 0)
              }
            }();
          return function (t) {
            e.push(t), e.length - n == 1 && r()
          }
        }();
      e.prototype = {
        resolve: function (t) {
          if (this.state === r) {
            if (t === this)
              return this.reject(new TypeError('Attempt to resolve promise with self'));
            var e = this;
            if (t && ('function' == typeof t || 'object' == typeof t))
              try {
                var o = !0, i = t.then;
                if ('function' == typeof i)
                  return void i.call(t, function (t) {
                    o && (o = !1, e.resolve(t))
                  }, function (t) {
                    o && (o = !1, e.reject(t))
                  })
              } catch (u) {
                return void (o && this.reject(u))
              }
            this.state = c, this.v = t, e.c && f(function () {
              for (var o = 0, r = e.c.length; r > o; o++)
                n(e.c[o], t)
            })
          }
        },
        reject: function (t) {
          if (this.state === r) {
            this.state = u, this.v = t;
            var n = this.c;
            n ? f(function () {
              for (var e = 0, r = n.length; r > e; e++)
                o(n[e], t)
            }) : e.suppressUncaughtRejectionError || console.log('You upset Zousan. Please catch rejections: ', t, t.stack)
          }
        },
        then: function (t, i) {
          var u = new e, s = {
              y: t,
              n: i,
              p: u
            };
          if (this.state === r)
            this.c ? this.c.push(s) : this.c = [s];
          else {
            var l = this.state, a = this.v;
            f(function () {
              l === c ? n(s, a) : o(s, a)
            })
          }
          return u
        },
        'catch': function (t) {
          return this.then(null, t)
        },
        'finally': function (t) {
          return this.then(t, t)
        },
        timeout: function (t, n) {
          n = n || 'Timeout';
          var o = this;
          return new e(function (e, r) {
            setTimeout(function () {
              r(Error(n))
            }, t), o.then(function (t) {
              e(t)
            }, function (t) {
              r(t)
            })
          })
        }
      }, e.resolve = function (t) {
        var n = new e;
        return n.resolve(t), n
      }, e.reject = function (t) {
        var n = new e;
        return n.reject(t), n
      }, e.all = function (t) {
        function n(n, c) {
          'function' != typeof n.then && (n = e.resolve(n)), n.then(function (e) {
            o[c] = e, r++, r == t.length && i.resolve(o)
          }, function (t) {
            i.reject(t)
          })
        }
        for (var o = [], r = 0, i = new e, c = 0; c < t.length; c++)
          n(t[c], c);
        return t.length || i.resolve(o), i
      }, typeof module != s && module.exports && (module.exports = e), t.Zousan = e, e.soon = f
    }('undefined' != typeof global ? global : this)
  });
  // source: node_modules/referential/lib/index.js
  require.define('referential/lib', function (module, exports, __dirname, __filename, process) {
    // Generated by CoffeeScript 1.10.0
    var refer;
    refer = require('referential/lib/refer');
    refer.Ref = require('referential/lib/ref');
    module.exports = refer  //# sourceMappingURL=index.js.map
  });
  // source: node_modules/referential/lib/refer.js
  require.define('referential/lib/refer', function (module, exports, __dirname, __filename, process) {
    // Generated by CoffeeScript 1.10.0
    var Ref, refer;
    Ref = require('referential/lib/ref');
    module.exports = refer = function (state, ref) {
      var fn, i, len, method, ref1, wrapper;
      if (ref == null) {
        ref = null
      }
      if (ref == null) {
        ref = new Ref(state)
      }
      wrapper = function (key) {
        return ref.get(key)
      };
      ref1 = [
        'value',
        'get',
        'set',
        'extend',
        'index',
        'ref'
      ];
      fn = function (method) {
        return wrapper[method] = function () {
          return ref[method].apply(ref, arguments)
        }
      };
      for (i = 0, len = ref1.length; i < len; i++) {
        method = ref1[i];
        fn(method)
      }
      wrapper.refer = function (key) {
        return refer(null, ref.ref(key))
      };
      wrapper.clone = function (key) {
        return refer(null, ref.clone(key))
      };
      return wrapper
    }  //# sourceMappingURL=refer.js.map
  });
  // source: node_modules/referential/lib/ref.js
  require.define('referential/lib/ref', function (module, exports, __dirname, __filename, process) {
    // Generated by CoffeeScript 1.10.0
    var Ref, extend, isArray, isNumber, isObject, isString;
    extend = require('node.extend');
    isArray = require('is-array');
    isNumber = require('is-number');
    isObject = require('is-object');
    isString = require('is-string');
    module.exports = Ref = function () {
      function Ref(_value, parent, key1) {
        this._value = _value;
        this.parent = parent;
        this.key = key1;
        this._cache = {}
      }
      Ref.prototype._mutate = function () {
        return this._cache = {}
      };
      Ref.prototype.value = function (state) {
        if (!this.parent) {
          if (state != null) {
            this._value = state
          }
          return this._value
        }
        if (state != null) {
          return this.parent.set(this.key, state)
        } else {
          return this.parent.get(this.key)
        }
      };
      Ref.prototype.ref = function (key) {
        if (!key) {
          return this
        }
        return new Ref(null, this, key)
      };
      Ref.prototype.get = function (key) {
        if (!key) {
          return this.value()
        } else {
          if (this._cache[key]) {
            return this._cache[key]
          }
          return this._cache[key] = this.index(key)
        }
      };
      Ref.prototype.set = function (key, value) {
        this._mutate();
        if (value == null) {
          this.value(extend(this.value(), key))
        } else {
          this.index(key, value)
        }
        return this
      };
      Ref.prototype.extend = function (key, value) {
        var clone;
        this._mutate();
        if (value == null) {
          this.value(extend(true, this.value(), key))
        } else {
          if (isObject(value)) {
            this.value(extend(true, this.ref(key).get(), value))
          } else {
            clone = this.clone();
            this.set(key, value);
            this.value(extend(true, clone.get(), this.value()))
          }
        }
        return this
      };
      Ref.prototype.clone = function (key) {
        return new Ref(extend(true, {}, this.get(key)))
      };
      Ref.prototype.index = function (key, value, obj, prev) {
        var next, prop, props;
        if (obj == null) {
          obj = this.value()
        }
        if (this.parent) {
          return this.parent.index(this.key + '.' + key, value)
        }
        if (isNumber(key)) {
          key = String(key)
        }
        props = key.split('.');
        if (value == null) {
          while (prop = props.shift()) {
            if (!props.length) {
              return obj != null ? obj[prop] : void 0
            }
            obj = obj != null ? obj[prop] : void 0
          }
          return
        }
        while (prop = props.shift()) {
          if (!props.length) {
            return obj[prop] = value
          } else {
            next = props[0];
            if (obj[next] == null) {
              if (isNumber(next)) {
                if (obj[prop] == null) {
                  obj[prop] = []
                }
              } else {
                if (obj[prop] == null) {
                  obj[prop] = {}
                }
              }
            }
          }
          obj = obj[prop]
        }
      };
      return Ref
    }()  //# sourceMappingURL=ref.js.map
  });
  // source: node_modules/node.extend/index.js
  require.define('node.extend', function (module, exports, __dirname, __filename, process) {
    module.exports = require('node.extend/lib/extend')
  });
  // source: node_modules/node.extend/lib/extend.js
  require.define('node.extend/lib/extend', function (module, exports, __dirname, __filename, process) {
    /*!
 * node.extend
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * @fileoverview
 * Port of jQuery.extend that actually works on node.js
 */
    var is = require('is');
    function extend() {
      var target = arguments[0] || {};
      var i = 1;
      var length = arguments.length;
      var deep = false;
      var options, name, src, copy, copy_is_array, clone;
      // Handle a deep copy situation
      if (typeof target === 'boolean') {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2
      }
      // Handle case when target is a string or something (possible in deep copy)
      if (typeof target !== 'object' && !is.fn(target)) {
        target = {}
      }
      for (; i < length; i++) {
        // Only deal with non-null/undefined values
        options = arguments[i];
        if (options != null) {
          if (typeof options === 'string') {
            options = options.split('')
          }
          // Extend the base object
          for (name in options) {
            src = target[name];
            copy = options[name];
            // Prevent never-ending loop
            if (target === copy) {
              continue
            }
            // Recurse if we're merging plain objects or arrays
            if (deep && copy && (is.hash(copy) || (copy_is_array = is.array(copy)))) {
              if (copy_is_array) {
                copy_is_array = false;
                clone = src && is.array(src) ? src : []
              } else {
                clone = src && is.hash(src) ? src : {}
              }
              // Never move original objects, clone them
              target[name] = extend(deep, clone, copy)  // Don't bring in undefined values
            } else if (typeof copy !== 'undefined') {
              target[name] = copy
            }
          }
        }
      }
      // Return the modified object
      return target
    }
    ;
    /**
 * @public
 */
    extend.version = '1.1.3';
    /**
 * Exports module.
 */
    module.exports = extend
  });
  // source: node_modules/is/index.js
  require.define('is', function (module, exports, __dirname, __filename, process) {
    /* globals window, HTMLElement */
    /**!
 * is
 * the definitive JavaScript type testing library
 *
 * @copyright 2013-2014 Enrico Marino / Jordan Harband
 * @license MIT
 */
    var objProto = Object.prototype;
    var owns = objProto.hasOwnProperty;
    var toStr = objProto.toString;
    var symbolValueOf;
    if (typeof Symbol === 'function') {
      symbolValueOf = Symbol.prototype.valueOf
    }
    var isActualNaN = function (value) {
      return value !== value
    };
    var NON_HOST_TYPES = {
      'boolean': 1,
      number: 1,
      string: 1,
      undefined: 1
    };
    var base64Regex = /^([A-Za-z0-9+\/]{4})*([A-Za-z0-9+\/]{4}|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{2}==)$/;
    var hexRegex = /^[A-Fa-f0-9]+$/;
    /**
 * Expose `is`
 */
    var is = module.exports = {};
    /**
 * Test general.
 */
    /**
 * is.type
 * Test if `value` is a type of `type`.
 *
 * @param {Mixed} value value to test
 * @param {String} type type
 * @return {Boolean} true if `value` is a type of `type`, false otherwise
 * @api public
 */
    is.a = is.type = function (value, type) {
      return typeof value === type
    };
    /**
 * is.defined
 * Test if `value` is defined.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is defined, false otherwise
 * @api public
 */
    is.defined = function (value) {
      return typeof value !== 'undefined'
    };
    /**
 * is.empty
 * Test if `value` is empty.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is empty, false otherwise
 * @api public
 */
    is.empty = function (value) {
      var type = toStr.call(value);
      var key;
      if (type === '[object Array]' || type === '[object Arguments]' || type === '[object String]') {
        return value.length === 0
      }
      if (type === '[object Object]') {
        for (key in value) {
          if (owns.call(value, key)) {
            return false
          }
        }
        return true
      }
      return !value
    };
    /**
 * is.equal
 * Test if `value` is equal to `other`.
 *
 * @param {Mixed} value value to test
 * @param {Mixed} other value to compare with
 * @return {Boolean} true if `value` is equal to `other`, false otherwise
 */
    is.equal = function equal(value, other) {
      if (value === other) {
        return true
      }
      var type = toStr.call(value);
      var key;
      if (type !== toStr.call(other)) {
        return false
      }
      if (type === '[object Object]') {
        for (key in value) {
          if (!is.equal(value[key], other[key]) || !(key in other)) {
            return false
          }
        }
        for (key in other) {
          if (!is.equal(value[key], other[key]) || !(key in value)) {
            return false
          }
        }
        return true
      }
      if (type === '[object Array]') {
        key = value.length;
        if (key !== other.length) {
          return false
        }
        while (--key) {
          if (!is.equal(value[key], other[key])) {
            return false
          }
        }
        return true
      }
      if (type === '[object Function]') {
        return value.prototype === other.prototype
      }
      if (type === '[object Date]') {
        return value.getTime() === other.getTime()
      }
      return false
    };
    /**
 * is.hosted
 * Test if `value` is hosted by `host`.
 *
 * @param {Mixed} value to test
 * @param {Mixed} host host to test with
 * @return {Boolean} true if `value` is hosted by `host`, false otherwise
 * @api public
 */
    is.hosted = function (value, host) {
      var type = typeof host[value];
      return type === 'object' ? !!host[value] : !NON_HOST_TYPES[type]
    };
    /**
 * is.instance
 * Test if `value` is an instance of `constructor`.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an instance of `constructor`
 * @api public
 */
    is.instance = is['instanceof'] = function (value, constructor) {
      return value instanceof constructor
    };
    /**
 * is.nil / is.null
 * Test if `value` is null.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is null, false otherwise
 * @api public
 */
    is.nil = is['null'] = function (value) {
      return value === null
    };
    /**
 * is.undef / is.undefined
 * Test if `value` is undefined.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is undefined, false otherwise
 * @api public
 */
    is.undef = is.undefined = function (value) {
      return typeof value === 'undefined'
    };
    /**
 * Test arguments.
 */
    /**
 * is.args
 * Test if `value` is an arguments object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an arguments object, false otherwise
 * @api public
 */
    is.args = is.arguments = function (value) {
      var isStandardArguments = toStr.call(value) === '[object Arguments]';
      var isOldArguments = !is.array(value) && is.arraylike(value) && is.object(value) && is.fn(value.callee);
      return isStandardArguments || isOldArguments
    };
    /**
 * Test array.
 */
    /**
 * is.array
 * Test if 'value' is an array.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an array, false otherwise
 * @api public
 */
    is.array = Array.isArray || function (value) {
      return toStr.call(value) === '[object Array]'
    };
    /**
 * is.arguments.empty
 * Test if `value` is an empty arguments object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an empty arguments object, false otherwise
 * @api public
 */
    is.args.empty = function (value) {
      return is.args(value) && value.length === 0
    };
    /**
 * is.array.empty
 * Test if `value` is an empty array.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an empty array, false otherwise
 * @api public
 */
    is.array.empty = function (value) {
      return is.array(value) && value.length === 0
    };
    /**
 * is.arraylike
 * Test if `value` is an arraylike object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an arguments object, false otherwise
 * @api public
 */
    is.arraylike = function (value) {
      return !!value && !is.bool(value) && owns.call(value, 'length') && isFinite(value.length) && is.number(value.length) && value.length >= 0
    };
    /**
 * Test boolean.
 */
    /**
 * is.bool
 * Test if `value` is a boolean.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a boolean, false otherwise
 * @api public
 */
    is.bool = is['boolean'] = function (value) {
      return toStr.call(value) === '[object Boolean]'
    };
    /**
 * is.false
 * Test if `value` is false.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is false, false otherwise
 * @api public
 */
    is['false'] = function (value) {
      return is.bool(value) && Boolean(Number(value)) === false
    };
    /**
 * is.true
 * Test if `value` is true.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is true, false otherwise
 * @api public
 */
    is['true'] = function (value) {
      return is.bool(value) && Boolean(Number(value)) === true
    };
    /**
 * Test date.
 */
    /**
 * is.date
 * Test if `value` is a date.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a date, false otherwise
 * @api public
 */
    is.date = function (value) {
      return toStr.call(value) === '[object Date]'
    };
    /**
 * Test element.
 */
    /**
 * is.element
 * Test if `value` is an html element.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an HTML Element, false otherwise
 * @api public
 */
    is.element = function (value) {
      return value !== undefined && typeof HTMLElement !== 'undefined' && value instanceof HTMLElement && value.nodeType === 1
    };
    /**
 * Test error.
 */
    /**
 * is.error
 * Test if `value` is an error object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an error object, false otherwise
 * @api public
 */
    is.error = function (value) {
      return toStr.call(value) === '[object Error]'
    };
    /**
 * Test function.
 */
    /**
 * is.fn / is.function (deprecated)
 * Test if `value` is a function.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a function, false otherwise
 * @api public
 */
    is.fn = is['function'] = function (value) {
      var isAlert = typeof window !== 'undefined' && value === window.alert;
      return isAlert || toStr.call(value) === '[object Function]'
    };
    /**
 * Test number.
 */
    /**
 * is.number
 * Test if `value` is a number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a number, false otherwise
 * @api public
 */
    is.number = function (value) {
      return toStr.call(value) === '[object Number]'
    };
    /**
 * is.infinite
 * Test if `value` is positive or negative infinity.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is positive or negative Infinity, false otherwise
 * @api public
 */
    is.infinite = function (value) {
      return value === Infinity || value === -Infinity
    };
    /**
 * is.decimal
 * Test if `value` is a decimal number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a decimal number, false otherwise
 * @api public
 */
    is.decimal = function (value) {
      return is.number(value) && !isActualNaN(value) && !is.infinite(value) && value % 1 !== 0
    };
    /**
 * is.divisibleBy
 * Test if `value` is divisible by `n`.
 *
 * @param {Number} value value to test
 * @param {Number} n dividend
 * @return {Boolean} true if `value` is divisible by `n`, false otherwise
 * @api public
 */
    is.divisibleBy = function (value, n) {
      var isDividendInfinite = is.infinite(value);
      var isDivisorInfinite = is.infinite(n);
      var isNonZeroNumber = is.number(value) && !isActualNaN(value) && is.number(n) && !isActualNaN(n) && n !== 0;
      return isDividendInfinite || isDivisorInfinite || isNonZeroNumber && value % n === 0
    };
    /**
 * is.integer
 * Test if `value` is an integer.
 *
 * @param value to test
 * @return {Boolean} true if `value` is an integer, false otherwise
 * @api public
 */
    is.integer = is['int'] = function (value) {
      return is.number(value) && !isActualNaN(value) && value % 1 === 0
    };
    /**
 * is.maximum
 * Test if `value` is greater than 'others' values.
 *
 * @param {Number} value value to test
 * @param {Array} others values to compare with
 * @return {Boolean} true if `value` is greater than `others` values
 * @api public
 */
    is.maximum = function (value, others) {
      if (isActualNaN(value)) {
        throw new TypeError('NaN is not a valid value')
      } else if (!is.arraylike(others)) {
        throw new TypeError('second argument must be array-like')
      }
      var len = others.length;
      while (--len >= 0) {
        if (value < others[len]) {
          return false
        }
      }
      return true
    };
    /**
 * is.minimum
 * Test if `value` is less than `others` values.
 *
 * @param {Number} value value to test
 * @param {Array} others values to compare with
 * @return {Boolean} true if `value` is less than `others` values
 * @api public
 */
    is.minimum = function (value, others) {
      if (isActualNaN(value)) {
        throw new TypeError('NaN is not a valid value')
      } else if (!is.arraylike(others)) {
        throw new TypeError('second argument must be array-like')
      }
      var len = others.length;
      while (--len >= 0) {
        if (value > others[len]) {
          return false
        }
      }
      return true
    };
    /**
 * is.nan
 * Test if `value` is not a number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is not a number, false otherwise
 * @api public
 */
    is.nan = function (value) {
      return !is.number(value) || value !== value
    };
    /**
 * is.even
 * Test if `value` is an even number.
 *
 * @param {Number} value value to test
 * @return {Boolean} true if `value` is an even number, false otherwise
 * @api public
 */
    is.even = function (value) {
      return is.infinite(value) || is.number(value) && value === value && value % 2 === 0
    };
    /**
 * is.odd
 * Test if `value` is an odd number.
 *
 * @param {Number} value value to test
 * @return {Boolean} true if `value` is an odd number, false otherwise
 * @api public
 */
    is.odd = function (value) {
      return is.infinite(value) || is.number(value) && value === value && value % 2 !== 0
    };
    /**
 * is.ge
 * Test if `value` is greater than or equal to `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean}
 * @api public
 */
    is.ge = function (value, other) {
      if (isActualNaN(value) || isActualNaN(other)) {
        throw new TypeError('NaN is not a valid value')
      }
      return !is.infinite(value) && !is.infinite(other) && value >= other
    };
    /**
 * is.gt
 * Test if `value` is greater than `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean}
 * @api public
 */
    is.gt = function (value, other) {
      if (isActualNaN(value) || isActualNaN(other)) {
        throw new TypeError('NaN is not a valid value')
      }
      return !is.infinite(value) && !is.infinite(other) && value > other
    };
    /**
 * is.le
 * Test if `value` is less than or equal to `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} if 'value' is less than or equal to 'other'
 * @api public
 */
    is.le = function (value, other) {
      if (isActualNaN(value) || isActualNaN(other)) {
        throw new TypeError('NaN is not a valid value')
      }
      return !is.infinite(value) && !is.infinite(other) && value <= other
    };
    /**
 * is.lt
 * Test if `value` is less than `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} if `value` is less than `other`
 * @api public
 */
    is.lt = function (value, other) {
      if (isActualNaN(value) || isActualNaN(other)) {
        throw new TypeError('NaN is not a valid value')
      }
      return !is.infinite(value) && !is.infinite(other) && value < other
    };
    /**
 * is.within
 * Test if `value` is within `start` and `finish`.
 *
 * @param {Number} value value to test
 * @param {Number} start lower bound
 * @param {Number} finish upper bound
 * @return {Boolean} true if 'value' is is within 'start' and 'finish'
 * @api public
 */
    is.within = function (value, start, finish) {
      if (isActualNaN(value) || isActualNaN(start) || isActualNaN(finish)) {
        throw new TypeError('NaN is not a valid value')
      } else if (!is.number(value) || !is.number(start) || !is.number(finish)) {
        throw new TypeError('all arguments must be numbers')
      }
      var isAnyInfinite = is.infinite(value) || is.infinite(start) || is.infinite(finish);
      return isAnyInfinite || value >= start && value <= finish
    };
    /**
 * Test object.
 */
    /**
 * is.object
 * Test if `value` is an object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an object, false otherwise
 * @api public
 */
    is.object = function (value) {
      return toStr.call(value) === '[object Object]'
    };
    /**
 * is.hash
 * Test if `value` is a hash - a plain object literal.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a hash, false otherwise
 * @api public
 */
    is.hash = function (value) {
      return is.object(value) && value.constructor === Object && !value.nodeType && !value.setInterval
    };
    /**
 * Test regexp.
 */
    /**
 * is.regexp
 * Test if `value` is a regular expression.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a regexp, false otherwise
 * @api public
 */
    is.regexp = function (value) {
      return toStr.call(value) === '[object RegExp]'
    };
    /**
 * Test string.
 */
    /**
 * is.string
 * Test if `value` is a string.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is a string, false otherwise
 * @api public
 */
    is.string = function (value) {
      return toStr.call(value) === '[object String]'
    };
    /**
 * Test base64 string.
 */
    /**
 * is.base64
 * Test if `value` is a valid base64 encoded string.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is a base64 encoded string, false otherwise
 * @api public
 */
    is.base64 = function (value) {
      return is.string(value) && (!value.length || base64Regex.test(value))
    };
    /**
 * Test base64 string.
 */
    /**
 * is.hex
 * Test if `value` is a valid hex encoded string.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is a hex encoded string, false otherwise
 * @api public
 */
    is.hex = function (value) {
      return is.string(value) && (!value.length || hexRegex.test(value))
    };
    /**
 * is.symbol
 * Test if `value` is an ES6 Symbol
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a Symbol, false otherise
 * @api public
 */
    is.symbol = function (value) {
      return typeof Symbol === 'function' && toStr.call(value) === '[object Symbol]' && typeof symbolValueOf.call(value) === 'symbol'
    }
  });
  // source: node_modules/is-array/index.js
  require.define('is-array', function (module, exports, __dirname, __filename, process) {
    /**
 * isArray
 */
    var isArray = Array.isArray;
    /**
 * toString
 */
    var str = Object.prototype.toString;
    /**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */
    module.exports = isArray || function (val) {
      return !!val && '[object Array]' == str.call(val)
    }
  });
  // source: node_modules/is-number/index.js
  require.define('is-number', function (module, exports, __dirname, __filename, process) {
    /*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */
    'use strict';
    var typeOf = require('kind-of');
    module.exports = function isNumber(num) {
      var type = typeOf(num);
      if (type !== 'number' && type !== 'string') {
        return false
      }
      var n = +num;
      return n - n + 1 >= 0 && num !== ''
    }
  });
  // source: node_modules/kind-of/index.js
  require.define('kind-of', function (module, exports, __dirname, __filename, process) {
    var isBuffer = require('is-buffer');
    var toString = Object.prototype.toString;
    /**
 * Get the native `typeof` a value.
 *
 * @param  {*} `val`
 * @return {*} Native javascript type
 */
    module.exports = function kindOf(val) {
      // primitivies
      if (typeof val === 'undefined') {
        return 'undefined'
      }
      if (val === null) {
        return 'null'
      }
      if (val === true || val === false || val instanceof Boolean) {
        return 'boolean'
      }
      if (typeof val === 'string' || val instanceof String) {
        return 'string'
      }
      if (typeof val === 'number' || val instanceof Number) {
        return 'number'
      }
      // functions
      if (typeof val === 'function' || val instanceof Function) {
        return 'function'
      }
      // array
      if (typeof Array.isArray !== 'undefined' && Array.isArray(val)) {
        return 'array'
      }
      // check for instances of RegExp and Date before calling `toString`
      if (val instanceof RegExp) {
        return 'regexp'
      }
      if (val instanceof Date) {
        return 'date'
      }
      // other objects
      var type = toString.call(val);
      if (type === '[object RegExp]') {
        return 'regexp'
      }
      if (type === '[object Date]') {
        return 'date'
      }
      if (type === '[object Arguments]') {
        return 'arguments'
      }
      // buffer
      if (typeof Buffer !== 'undefined' && isBuffer(val)) {
        return 'buffer'
      }
      // es6: Map, WeakMap, Set, WeakSet
      if (type === '[object Set]') {
        return 'set'
      }
      if (type === '[object WeakSet]') {
        return 'weakset'
      }
      if (type === '[object Map]') {
        return 'map'
      }
      if (type === '[object WeakMap]') {
        return 'weakmap'
      }
      if (type === '[object Symbol]') {
        return 'symbol'
      }
      // typed arrays
      if (type === '[object Int8Array]') {
        return 'int8array'
      }
      if (type === '[object Uint8Array]') {
        return 'uint8array'
      }
      if (type === '[object Uint8ClampedArray]') {
        return 'uint8clampedarray'
      }
      if (type === '[object Int16Array]') {
        return 'int16array'
      }
      if (type === '[object Uint16Array]') {
        return 'uint16array'
      }
      if (type === '[object Int32Array]') {
        return 'int32array'
      }
      if (type === '[object Uint32Array]') {
        return 'uint32array'
      }
      if (type === '[object Float32Array]') {
        return 'float32array'
      }
      if (type === '[object Float64Array]') {
        return 'float64array'
      }
      // must be a plain object
      return 'object'
    }
  });
  // source: node_modules/is-buffer/index.js
  require.define('is-buffer', function (module, exports, __dirname, __filename, process) {
    /**
 * Determine if an object is Buffer
 *
 * Author:   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * License:  MIT
 *
 * `npm install is-buffer`
 */
    module.exports = function (obj) {
      return !!(obj != null && (obj._isBuffer || obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)))
    }
  });
  // source: node_modules/is-object/index.js
  require.define('is-object', function (module, exports, __dirname, __filename, process) {
    'use strict';
    module.exports = function isObject(x) {
      return typeof x === 'object' && x !== null
    }
  });
  // source: node_modules/is-string/index.js
  require.define('is-string', function (module, exports, __dirname, __filename, process) {
    'use strict';
    var strValue = String.prototype.valueOf;
    var tryStringObject = function tryStringObject(value) {
      try {
        strValue.call(value);
        return true
      } catch (e) {
        return false
      }
    };
    var toStr = Object.prototype.toString;
    var strClass = '[object String]';
    var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
    module.exports = function isString(value) {
      if (typeof value === 'string') {
        return true
      }
      if (typeof value !== 'object') {
        return false
      }
      return hasToStringTag ? tryStringObject(value) : toStr.call(value) === strClass
    }
  });
  // source: node_modules/promise-settle/index.js
  require.define('promise-settle', function (module, exports, __dirname, __filename, process) {
    'use strict';
    module.exports = require('promise-settle/lib/promise-settle')
  });
  // source: node_modules/promise-settle/lib/promise-settle.js
  require.define('promise-settle/lib/promise-settle', function (module, exports, __dirname, __filename, process) {
    'use strict';
    module.exports = settle;
    function settle(promises) {
      return Promise.resolve().then(function () {
        return promises
      }).then(function (promises) {
        if (!Array.isArray(promises))
          throw new TypeError('Expected an array of Promises');
        var promiseResults = promises.map(function (promise) {
          return Promise.resolve().then(function () {
            return promise
          }).then(function (result) {
            return promiseResult(result)
          }).catch(function (err) {
            return promiseResult(null, err)
          })
        });
        return Promise.all(promiseResults)
      })
    }
    function promiseResult(result, err) {
      var isFulfilled = typeof err === 'undefined';
      var value = isFulfilled ? returns.bind(result) : throws.bind(new Error('Promise is rejected'));
      var isRejected = !isFulfilled;
      var reason = isRejected ? returns.bind(err) : throws.bind(new Error('Promise is fulfilled'));
      return {
        isFulfilled: returns.bind(isFulfilled),
        isRejected: returns.bind(isRejected),
        value: value,
        reason: reason
      }
    }
    function returns() {
      return this
    }
    function throws() {
      throw this
    }
  });
  // source: node_modules/crowdcontrol/lib/views/input.js
  require.define('crowdcontrol/lib/views/input', function (module, exports, __dirname, __filename, process) {
    // Generated by CoffeeScript 1.10.0
    var Input, View, extend = function (child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key]
        }
        function ctor() {
          this.constructor = child
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor;
        child.__super__ = parent.prototype;
        return child
      }, hasProp = {}.hasOwnProperty;
    View = require('crowdcontrol/lib/views/view');
    Input = function (superClass) {
      extend(Input, superClass);
      function Input() {
        return Input.__super__.constructor.apply(this, arguments)
      }
      Input.prototype.input = null;
      Input.prototype.errorMessage = '';
      Input.prototype.errorHtml = '<div class="error-container" if="{ errorMessage }">\n  <div class="error-message">{ errorMessage }</div>\n</div>';
      Input.prototype.beforeInit = function () {
        return this.html += this.errorHtml
      };
      Input.prototype.init = function () {
        return this.input.on('validate', function (_this) {
          return function (pRef) {
            return _this.validate(pRef)
          }
        }(this))
      };
      Input.prototype.getValue = function (event) {
        return event.target.value
      };
      Input.prototype.change = function (event) {
        var name, ref, ref1, value;
        ref1 = this.input, ref = ref1.ref, name = ref1.name;
        value = this.getValue(event);
        if (value === ref.get(name)) {
          return
        }
        this.input.ref.set(name, value);
        this.clearError();
        return this.validate()
      };
      Input.prototype.error = function (err) {
        var ref1;
        return this.errorMessage = (ref1 = err != null ? err.message : void 0) != null ? ref1 : err
      };
      Input.prototype.changed = function () {
      };
      Input.prototype.clearError = function () {
        return this.errorMessage = ''
      };
      Input.prototype.validate = function (pRef) {
        var p;
        p = this.input.validate(this.input.ref, this.input.name).then(function (_this) {
          return function (value) {
            _this.changed(value);
            return _this.update()
          }
        }(this))['catch'](function (_this) {
          return function (err) {
            _this.error(err);
            _this.update();
            throw err
          }
        }(this));
        if (pRef != null) {
          pRef.p = p
        }
        return p
      };
      return Input
    }(View);
    module.exports = Input  //# sourceMappingURL=input.js.map
  });
  // source: src/events.coffee
  require.define('./events', function (module, exports, __dirname, __filename, process) {
    module.exports = {
      Change: 'change',
      ChangeSuccess: 'change-success',
      ChangeFailed: 'change-failed'
    }
  });
  // source: node_modules/riot/riot.js
  require.define('riot/riot', function (module, exports, __dirname, __filename, process) {
    /* Riot v2.3.17, @license MIT */
    ;
    (function (window, undefined) {
      'use strict';
      var riot = {
          version: 'v2.3.17',
          settings: {}
        },
        // be aware, internal usage
        // ATTENTION: prefix the global dynamic variables with `__`
        // counter to give a unique id to all the Tag instances
        __uid = 0,
        // tags instances cache
        __virtualDom = [],
        // tags implementation cache
        __tagImpl = {},
        /**
   * Const
   */
        GLOBAL_MIXIN = '__global_mixin',
        // riot specific prefixes
        RIOT_PREFIX = 'riot-', RIOT_TAG = RIOT_PREFIX + 'tag', RIOT_TAG_IS = 'data-is',
        // for typeof == '' comparisons
        T_STRING = 'string', T_OBJECT = 'object', T_UNDEF = 'undefined', T_BOOL = 'boolean', T_FUNCTION = 'function',
        // special native tags that cannot be treated like the others
        SPECIAL_TAGS_REGEX = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?|opt(?:ion|group))$/, RESERVED_WORDS_BLACKLIST = [
          '_item',
          '_id',
          '_parent',
          'update',
          'root',
          'mount',
          'unmount',
          'mixin',
          'isMounted',
          'isLoop',
          'tags',
          'parent',
          'opts',
          'trigger',
          'on',
          'off',
          'one'
        ],
        // version# for IE 8-11, 0 for others
        IE_VERSION = (window && window.document || {}).documentMode | 0;
      /* istanbul ignore next */
      riot.observable = function (el) {
        /**
   * Extend the original object or create a new empty one
   * @type { Object }
   */
        el = el || {};
        /**
   * Private variables and methods
   */
        var callbacks = {}, slice = Array.prototype.slice, onEachEvent = function (e, fn) {
            e.replace(/\S+/g, fn)
          };
        // extend the object adding the observable methods
        Object.defineProperties(el, {
          /**
     * Listen to the given space separated list of `events` and execute the `callback` each time an event is triggered.
     * @param  { String } events - events ids
     * @param  { Function } fn - callback function
     * @returns { Object } el
     */
          on: {
            value: function (events, fn) {
              if (typeof fn != 'function')
                return el;
              onEachEvent(events, function (name, pos) {
                (callbacks[name] = callbacks[name] || []).push(fn);
                fn.typed = pos > 0
              });
              return el
            },
            enumerable: false,
            writable: false,
            configurable: false
          },
          /**
     * Removes the given space separated list of `events` listeners
     * @param   { String } events - events ids
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
          off: {
            value: function (events, fn) {
              if (events == '*' && !fn)
                callbacks = {};
              else {
                onEachEvent(events, function (name) {
                  if (fn) {
                    var arr = callbacks[name];
                    for (var i = 0, cb; cb = arr && arr[i]; ++i) {
                      if (cb == fn)
                        arr.splice(i--, 1)
                    }
                  } else
                    delete callbacks[name]
                })
              }
              return el
            },
            enumerable: false,
            writable: false,
            configurable: false
          },
          /**
     * Listen to the given space separated list of `events` and execute the `callback` at most once
     * @param   { String } events - events ids
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
          one: {
            value: function (events, fn) {
              function on() {
                el.off(events, on);
                fn.apply(el, arguments)
              }
              return el.on(events, on)
            },
            enumerable: false,
            writable: false,
            configurable: false
          },
          /**
     * Execute all callback functions that listen to the given space separated list of `events`
     * @param   { String } events - events ids
     * @returns { Object } el
     */
          trigger: {
            value: function (events) {
              // getting the arguments
              var arglen = arguments.length - 1, args = new Array(arglen), fns;
              for (var i = 0; i < arglen; i++) {
                args[i] = arguments[i + 1]  // skip first argument
              }
              onEachEvent(events, function (name) {
                fns = slice.call(callbacks[name] || [], 0);
                for (var i = 0, fn; fn = fns[i]; ++i) {
                  if (fn.busy)
                    return;
                  fn.busy = 1;
                  fn.apply(el, fn.typed ? [name].concat(args) : args);
                  if (fns[i] !== fn) {
                    i--
                  }
                  fn.busy = 0
                }
                if (callbacks['*'] && name != '*')
                  el.trigger.apply(el, [
                    '*',
                    name
                  ].concat(args))
              });
              return el
            },
            enumerable: false,
            writable: false,
            configurable: false
          }
        });
        return el
      }  /* istanbul ignore next */;
      (function (riot) {
        /**
 * Simple client-side router
 * @module riot-route
 */
        var RE_ORIGIN = /^.+?\/+[^\/]+/, EVENT_LISTENER = 'EventListener', REMOVE_EVENT_LISTENER = 'remove' + EVENT_LISTENER, ADD_EVENT_LISTENER = 'add' + EVENT_LISTENER, HAS_ATTRIBUTE = 'hasAttribute', REPLACE = 'replace', POPSTATE = 'popstate', HASHCHANGE = 'hashchange', TRIGGER = 'trigger', MAX_EMIT_STACK_LEVEL = 3, win = typeof window != 'undefined' && window, doc = typeof document != 'undefined' && document, hist = win && history, loc = win && (hist.location || win.location),
          // see html5-history-api
          prot = Router.prototype,
          // to minify more
          clickEvent = doc && doc.ontouchstart ? 'touchstart' : 'click', started = false, central = riot.observable(), routeFound = false, debouncedEmit, base, current, parser, secondParser, emitStack = [], emitStackLevel = 0;
        /**
 * Default parser. You can replace it via router.parser method.
 * @param {string} path - current path (normalized)
 * @returns {array} array
 */
        function DEFAULT_PARSER(path) {
          return path.split(/[\/?#]/)
        }
        /**
 * Default parser (second). You can replace it via router.parser method.
 * @param {string} path - current path (normalized)
 * @param {string} filter - filter string (normalized)
 * @returns {array} array
 */
        function DEFAULT_SECOND_PARSER(path, filter) {
          var re = new RegExp('^' + filter[REPLACE](/\*/g, '([^/?#]+?)')[REPLACE](/\.\./, '.*') + '$'), args = path.match(re);
          if (args)
            return args.slice(1)
        }
        /**
 * Simple/cheap debounce implementation
 * @param   {function} fn - callback
 * @param   {number} delay - delay in seconds
 * @returns {function} debounced function
 */
        function debounce(fn, delay) {
          var t;
          return function () {
            clearTimeout(t);
            t = setTimeout(fn, delay)
          }
        }
        /**
 * Set the window listeners to trigger the routes
 * @param {boolean} autoExec - see route.start
 */
        function start(autoExec) {
          debouncedEmit = debounce(emit, 1);
          win[ADD_EVENT_LISTENER](POPSTATE, debouncedEmit);
          win[ADD_EVENT_LISTENER](HASHCHANGE, debouncedEmit);
          doc[ADD_EVENT_LISTENER](clickEvent, click);
          if (autoExec)
            emit(true)
        }
        /**
 * Router class
 */
        function Router() {
          this.$ = [];
          riot.observable(this);
          // make it observable
          central.on('stop', this.s.bind(this));
          central.on('emit', this.e.bind(this))
        }
        function normalize(path) {
          return path[REPLACE](/^\/|\/$/, '')
        }
        function isString(str) {
          return typeof str == 'string'
        }
        /**
 * Get the part after domain name
 * @param {string} href - fullpath
 * @returns {string} path from root
 */
        function getPathFromRoot(href) {
          return (href || loc.href || '')[REPLACE](RE_ORIGIN, '')
        }
        /**
 * Get the part after base
 * @param {string} href - fullpath
 * @returns {string} path from base
 */
        function getPathFromBase(href) {
          return base[0] == '#' ? (href || loc.href || '').split(base)[1] || '' : getPathFromRoot(href)[REPLACE](base, '')
        }
        function emit(force) {
          // the stack is needed for redirections
          var isRoot = emitStackLevel == 0;
          if (MAX_EMIT_STACK_LEVEL <= emitStackLevel)
            return;
          emitStackLevel++;
          emitStack.push(function () {
            var path = getPathFromBase();
            if (force || path != current) {
              central[TRIGGER]('emit', path);
              current = path
            }
          });
          if (isRoot) {
            while (emitStack.length) {
              emitStack[0]();
              emitStack.shift()
            }
            emitStackLevel = 0
          }
        }
        function click(e) {
          if (e.which != 1  // not left click
|| e.metaKey || e.ctrlKey || e.shiftKey || e.defaultPrevented)
            return;
          var el = e.target;
          while (el && el.nodeName != 'A')
            el = el.parentNode;
          if (!el || el.nodeName != 'A'  // not A tag
|| el[HAS_ATTRIBUTE]('download')  // has download attr
|| !el[HAS_ATTRIBUTE]('href')  // has no href attr
|| el.target && el.target != '_self'  // another window or frame
|| el.href.indexOf(loc.href.match(RE_ORIGIN)[0]) == -1  // cross origin
)
            return;
          if (el.href != loc.href) {
            if (el.href.split('#')[0] == loc.href.split('#')[0]  // internal jump
|| base != '#' && getPathFromRoot(el.href).indexOf(base) !== 0  // outside of base
|| !go(getPathFromBase(el.href), el.title || doc.title)  // route not found
)
              return
          }
          e.preventDefault()
        }
        /**
 * Go to the path
 * @param {string} path - destination path
 * @param {string} title - page title
 * @param {boolean} shouldReplace - use replaceState or pushState
 * @returns {boolean} - route not found flag
 */
        function go(path, title, shouldReplace) {
          if (hist) {
            // if a browser
            path = base + normalize(path);
            title = title || doc.title;
            // browsers ignores the second parameter `title`
            shouldReplace ? hist.replaceState(null, title, path) : hist.pushState(null, title, path);
            // so we need to set it manually
            doc.title = title;
            routeFound = false;
            emit();
            return routeFound
          }
          // Server-side usage: directly execute handlers for the path
          return central[TRIGGER]('emit', getPathFromBase(path))
        }
        /**
 * Go to path or set action
 * a single string:                go there
 * two strings:                    go there with setting a title
 * two strings and boolean:        replace history with setting a title
 * a single function:              set an action on the default route
 * a string/RegExp and a function: set an action on the route
 * @param {(string|function)} first - path / action / filter
 * @param {(string|RegExp|function)} second - title / action
 * @param {boolean} third - replace flag
 */
        prot.m = function (first, second, third) {
          if (isString(first) && (!second || isString(second)))
            go(first, second, third || false);
          else if (second)
            this.r(first, second);
          else
            this.r('@', first)
        };
        /**
 * Stop routing
 */
        prot.s = function () {
          this.off('*');
          this.$ = []
        };
        /**
 * Emit
 * @param {string} path - path
 */
        prot.e = function (path) {
          this.$.concat('@').some(function (filter) {
            var args = (filter == '@' ? parser : secondParser)(normalize(path), normalize(filter));
            if (typeof args != 'undefined') {
              this[TRIGGER].apply(null, [filter].concat(args));
              return routeFound = true  // exit from loop
            }
          }, this)
        };
        /**
 * Register route
 * @param {string} filter - filter for matching to url
 * @param {function} action - action to register
 */
        prot.r = function (filter, action) {
          if (filter != '@') {
            filter = '/' + normalize(filter);
            this.$.push(filter)
          }
          this.on(filter, action)
        };
        var mainRouter = new Router;
        var route = mainRouter.m.bind(mainRouter);
        /**
 * Create a sub router
 * @returns {function} the method of a new Router object
 */
        route.create = function () {
          var newSubRouter = new Router;
          // stop only this sub-router
          newSubRouter.m.stop = newSubRouter.s.bind(newSubRouter);
          // return sub-router's main method
          return newSubRouter.m.bind(newSubRouter)
        };
        /**
 * Set the base of url
 * @param {(str|RegExp)} arg - a new base or '#' or '#!'
 */
        route.base = function (arg) {
          base = arg || '#';
          current = getPathFromBase()  // recalculate current path
        };
        /** Exec routing right now **/
        route.exec = function () {
          emit(true)
        };
        /**
 * Replace the default router to yours
 * @param {function} fn - your parser function
 * @param {function} fn2 - your secondParser function
 */
        route.parser = function (fn, fn2) {
          if (!fn && !fn2) {
            // reset parser for testing...
            parser = DEFAULT_PARSER;
            secondParser = DEFAULT_SECOND_PARSER
          }
          if (fn)
            parser = fn;
          if (fn2)
            secondParser = fn2
        };
        /**
 * Helper function to get url query as an object
 * @returns {object} parsed query
 */
        route.query = function () {
          var q = {};
          var href = loc.href || current;
          href[REPLACE](/[?&](.+?)=([^&]*)/g, function (_, k, v) {
            q[k] = v
          });
          return q
        };
        /** Stop routing **/
        route.stop = function () {
          if (started) {
            if (win) {
              win[REMOVE_EVENT_LISTENER](POPSTATE, debouncedEmit);
              win[REMOVE_EVENT_LISTENER](HASHCHANGE, debouncedEmit);
              doc[REMOVE_EVENT_LISTENER](clickEvent, click)
            }
            central[TRIGGER]('stop');
            started = false
          }
        };
        /**
 * Start routing
 * @param {boolean} autoExec - automatically exec after starting if true
 */
        route.start = function (autoExec) {
          if (!started) {
            if (win) {
              if (document.readyState == 'complete')
                start(autoExec)  // the timeout is needed to solve
                                 // a weird safari bug https://github.com/riot/route/issues/33
;
              else
                win[ADD_EVENT_LISTENER]('load', function () {
                  setTimeout(function () {
                    start(autoExec)
                  }, 1)
                })
            }
            started = true
          }
        };
        /** Prepare the router **/
        route.base();
        route.parser();
        riot.route = route
      }(riot));
      /* istanbul ignore next */
      /**
 * The riot template engine
 * @version v2.3.21
 */
      /**
 * riot.util.brackets
 *
 * - `brackets    ` - Returns a string or regex based on its parameter
 * - `brackets.set` - Change the current riot brackets
 *
 * @module
 */
      var brackets = function (UNDEF) {
        var REGLOB = 'g', R_MLCOMMS = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g, R_STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'/g, S_QBLOCKS = R_STRINGS.source + '|' + /(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source + '|' + /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?(\/)[gim]*/.source, FINDBRACES = {
            '(': RegExp('([()])|' + S_QBLOCKS, REGLOB),
            '[': RegExp('([[\\]])|' + S_QBLOCKS, REGLOB),
            '{': RegExp('([{}])|' + S_QBLOCKS, REGLOB)
          }, DEFAULT = '{ }';
        var _pairs = [
          '{',
          '}',
          '{',
          '}',
          /{[^}]*}/,
          /\\([{}])/g,
          /\\({)|{/g,
          RegExp('\\\\(})|([[({])|(})|' + S_QBLOCKS, REGLOB),
          DEFAULT,
          /^\s*{\^?\s*([$\w]+)(?:\s*,\s*(\S+))?\s+in\s+(\S.*)\s*}/,
          /(^|[^\\]){=[\S\s]*?}/
        ];
        var cachedBrackets = UNDEF, _regex, _cache = [], _settings;
        function _loopback(re) {
          return re
        }
        function _rewrite(re, bp) {
          if (!bp)
            bp = _cache;
          return new RegExp(re.source.replace(/{/g, bp[2]).replace(/}/g, bp[3]), re.global ? REGLOB : '')
        }
        function _create(pair) {
          if (pair === DEFAULT)
            return _pairs;
          var arr = pair.split(' ');
          if (arr.length !== 2 || /[\x00-\x1F<>a-zA-Z0-9'",;\\]/.test(pair)) {
            throw new Error('Unsupported brackets "' + pair + '"')
          }
          arr = arr.concat(pair.replace(/(?=[[\]()*+?.^$|])/g, '\\').split(' '));
          arr[4] = _rewrite(arr[1].length > 1 ? /{[\S\s]*?}/ : _pairs[4], arr);
          arr[5] = _rewrite(pair.length > 3 ? /\\({|})/g : _pairs[5], arr);
          arr[6] = _rewrite(_pairs[6], arr);
          arr[7] = RegExp('\\\\(' + arr[3] + ')|([[({])|(' + arr[3] + ')|' + S_QBLOCKS, REGLOB);
          arr[8] = pair;
          return arr
        }
        function _brackets(reOrIdx) {
          return reOrIdx instanceof RegExp ? _regex(reOrIdx) : _cache[reOrIdx]
        }
        _brackets.split = function split(str, tmpl, _bp) {
          // istanbul ignore next: _bp is for the compiler
          if (!_bp)
            _bp = _cache;
          var parts = [], match, isexpr, start, pos, re = _bp[6];
          isexpr = start = re.lastIndex = 0;
          while (match = re.exec(str)) {
            pos = match.index;
            if (isexpr) {
              if (match[2]) {
                re.lastIndex = skipBraces(str, match[2], re.lastIndex);
                continue
              }
              if (!match[3])
                continue
            }
            if (!match[1]) {
              unescapeStr(str.slice(start, pos));
              start = re.lastIndex;
              re = _bp[6 + (isexpr ^= 1)];
              re.lastIndex = start
            }
          }
          if (str && start < str.length) {
            unescapeStr(str.slice(start))
          }
          return parts;
          function unescapeStr(s) {
            if (tmpl || isexpr)
              parts.push(s && s.replace(_bp[5], '$1'));
            else
              parts.push(s)
          }
          function skipBraces(s, ch, ix) {
            var match, recch = FINDBRACES[ch];
            recch.lastIndex = ix;
            ix = 1;
            while (match = recch.exec(s)) {
              if (match[1] && !(match[1] === ch ? ++ix : --ix))
                break
            }
            return ix ? s.length : recch.lastIndex
          }
        };
        _brackets.hasExpr = function hasExpr(str) {
          return _cache[4].test(str)
        };
        _brackets.loopKeys = function loopKeys(expr) {
          var m = expr.match(_cache[9]);
          return m ? {
            key: m[1],
            pos: m[2],
            val: _cache[0] + m[3].trim() + _cache[1]
          } : { val: expr.trim() }
        };
        _brackets.hasRaw = function (src) {
          return _cache[10].test(src)
        };
        _brackets.array = function array(pair) {
          return pair ? _create(pair) : _cache
        };
        function _reset(pair) {
          if ((pair || (pair = DEFAULT)) !== _cache[8]) {
            _cache = _create(pair);
            _regex = pair === DEFAULT ? _loopback : _rewrite;
            _cache[9] = _regex(_pairs[9]);
            _cache[10] = _regex(_pairs[10])
          }
          cachedBrackets = pair
        }
        function _setSettings(o) {
          var b;
          o = o || {};
          b = o.brackets;
          Object.defineProperty(o, 'brackets', {
            set: _reset,
            get: function () {
              return cachedBrackets
            },
            enumerable: true
          });
          _settings = o;
          _reset(b)
        }
        Object.defineProperty(_brackets, 'settings', {
          set: _setSettings,
          get: function () {
            return _settings
          }
        });
        /* istanbul ignore next: in the browser riot is always in the scope */
        _brackets.settings = typeof riot !== 'undefined' && riot.settings || {};
        _brackets.set = _reset;
        _brackets.R_STRINGS = R_STRINGS;
        _brackets.R_MLCOMMS = R_MLCOMMS;
        _brackets.S_QBLOCKS = S_QBLOCKS;
        return _brackets
      }();
      /**
 * @module tmpl
 *
 * tmpl          - Root function, returns the template value, render with data
 * tmpl.hasExpr  - Test the existence of a expression inside a string
 * tmpl.loopKeys - Get the keys for an 'each' loop (used by `_each`)
 */
      var tmpl = function () {
        var _cache = {};
        function _tmpl(str, data) {
          if (!str)
            return str;
          return (_cache[str] || (_cache[str] = _create(str))).call(data, _logErr)
        }
        _tmpl.haveRaw = brackets.hasRaw;
        _tmpl.hasExpr = brackets.hasExpr;
        _tmpl.loopKeys = brackets.loopKeys;
        _tmpl.errorHandler = null;
        function _logErr(err, ctx) {
          if (_tmpl.errorHandler) {
            err.riotData = {
              tagName: ctx && ctx.root && ctx.root.tagName,
              _riot_id: ctx && ctx._riot_id
            };
            _tmpl.errorHandler(err)
          }
        }
        function _create(str) {
          var expr = _getTmpl(str);
          if (expr.slice(0, 11) !== 'try{return ')
            expr = 'return ' + expr;
          return new Function('E', expr + ';')
        }
        var RE_QBLOCK = RegExp(brackets.S_QBLOCKS, 'g'), RE_QBMARK = /\x01(\d+)~/g;
        function _getTmpl(str) {
          var qstr = [], expr, parts = brackets.split(str.replace(/\u2057/g, '"'), 1);
          if (parts.length > 2 || parts[0]) {
            var i, j, list = [];
            for (i = j = 0; i < parts.length; ++i) {
              expr = parts[i];
              if (expr && (expr = i & 1 ? _parseExpr(expr, 1, qstr) : '"' + expr.replace(/\\/g, '\\\\').replace(/\r\n?|\n/g, '\\n').replace(/"/g, '\\"') + '"'))
                list[j++] = expr
            }
            expr = j < 2 ? list[0] : '[' + list.join(',') + '].join("")'
          } else {
            expr = _parseExpr(parts[1], 0, qstr)
          }
          if (qstr[0])
            expr = expr.replace(RE_QBMARK, function (_, pos) {
              return qstr[pos].replace(/\r/g, '\\r').replace(/\n/g, '\\n')
            });
          return expr
        }
        var RE_BREND = {
            '(': /[()]/g,
            '[': /[[\]]/g,
            '{': /[{}]/g
          }, CS_IDENT = /^(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\x01(\d+)~):/;
        function _parseExpr(expr, asText, qstr) {
          if (expr[0] === '=')
            expr = expr.slice(1);
          expr = expr.replace(RE_QBLOCK, function (s, div) {
            return s.length > 2 && !div ? '' + (qstr.push(s) - 1) + '~' : s
          }).replace(/\s+/g, ' ').trim().replace(/\ ?([[\({},?\.:])\ ?/g, '$1');
          if (expr) {
            var list = [], cnt = 0, match;
            while (expr && (match = expr.match(CS_IDENT)) && !match.index) {
              var key, jsb, re = /,|([[{(])|$/g;
              expr = RegExp.rightContext;
              key = match[2] ? qstr[match[2]].slice(1, -1).trim().replace(/\s+/g, ' ') : match[1];
              while (jsb = (match = re.exec(expr))[1])
                skipBraces(jsb, re);
              jsb = expr.slice(0, match.index);
              expr = RegExp.rightContext;
              list[cnt++] = _wrapExpr(jsb, 1, key)
            }
            expr = !cnt ? _wrapExpr(expr, asText) : cnt > 1 ? '[' + list.join(',') + '].join(" ").trim()' : list[0]
          }
          return expr;
          function skipBraces(ch, re) {
            var mm, lv = 1, ir = RE_BREND[ch];
            ir.lastIndex = re.lastIndex;
            while (mm = ir.exec(expr)) {
              if (mm[0] === ch)
                ++lv;
              else if (!--lv)
                break
            }
            re.lastIndex = lv ? expr.length : ir.lastIndex
          }
        }
        // istanbul ignore next: not both
        var JS_CONTEXT = '"in this?this:' + (typeof window !== 'object' ? 'global' : 'window') + ').', JS_VARNAME = /[,{][$\w]+:|(^ *|[^$\w\.])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g, JS_NOPROPS = /^(?=(\.[$\w]+))\1(?:[^.[(]|$)/;
        function _wrapExpr(expr, asText, key) {
          var tb;
          expr = expr.replace(JS_VARNAME, function (match, p, mvar, pos, s) {
            if (mvar) {
              pos = tb ? 0 : pos + match.length;
              if (mvar !== 'this' && mvar !== 'global' && mvar !== 'window') {
                match = p + '("' + mvar + JS_CONTEXT + mvar;
                if (pos)
                  tb = (s = s[pos]) === '.' || s === '(' || s === '['
              } else if (pos) {
                tb = !JS_NOPROPS.test(s.slice(pos))
              }
            }
            return match
          });
          if (tb) {
            expr = 'try{return ' + expr + '}catch(e){E(e,this)}'
          }
          if (key) {
            expr = (tb ? 'function(){' + expr + '}.call(this)' : '(' + expr + ')') + '?"' + key + '":""'
          } else if (asText) {
            expr = 'function(v){' + (tb ? expr.replace('return ', 'v=') : 'v=(' + expr + ')') + ';return v||v===0?v:""}.call(this)'
          }
          return expr
        }
        // istanbul ignore next: compatibility fix for beta versions
        _tmpl.parse = function (s) {
          return s
        };
        _tmpl.version = brackets.version = 'v2.3.21';
        return _tmpl
      }();
      /*
  lib/browser/tag/mkdom.js

  Includes hacks needed for the Internet Explorer version 9 and below
  See: http://kangax.github.io/compat-table/es5/#ie8
       http://codeplanet.io/dropping-ie8/
*/
      var mkdom = function _mkdom() {
        var reHasYield = /<yield\b/i, reYieldAll = /<yield\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/gi, reYieldSrc = /<yield\s+to=['"]([^'">]*)['"]\s*>([\S\s]*?)<\/yield\s*>/gi, reYieldDest = /<yield\s+from=['"]?([-\w]+)['"]?\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/gi;
        var rootEls = {
            tr: 'tbody',
            th: 'tr',
            td: 'tr',
            col: 'colgroup'
          }, tblTags = IE_VERSION && IE_VERSION < 10 ? SPECIAL_TAGS_REGEX : /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?)$/;
        /**
   * Creates a DOM element to wrap the given content. Normally an `DIV`, but can be
   * also a `TABLE`, `SELECT`, `TBODY`, `TR`, or `COLGROUP` element.
   *
   * @param   {string} templ  - The template coming from the custom tag definition
   * @param   {string} [html] - HTML content that comes from the DOM element where you
   *           will mount the tag, mostly the original tag in the page
   * @returns {HTMLElement} DOM element with _templ_ merged through `YIELD` with the _html_.
   */
        function _mkdom(templ, html) {
          var match = templ && templ.match(/^\s*<([-\w]+)/), tagName = match && match[1].toLowerCase(), el = mkEl('div');
          // replace all the yield tags with the tag inner html
          templ = replaceYield(templ, html);
          /* istanbul ignore next */
          if (tblTags.test(tagName))
            el = specialTags(el, templ, tagName);
          else
            el.innerHTML = templ;
          el.stub = true;
          return el
        }
        /*
    Creates the root element for table or select child elements:
    tr/th/td/thead/tfoot/tbody/caption/col/colgroup/option/optgroup
  */
        function specialTags(el, templ, tagName) {
          var select = tagName[0] === 'o', parent = select ? 'select>' : 'table>';
          // trim() is important here, this ensures we don't have artifacts,
          // so we can check if we have only one element inside the parent
          el.innerHTML = '<' + parent + templ.trim() + '</' + parent;
          parent = el.firstChild;
          // returns the immediate parent if tr/th/td/col is the only element, if not
          // returns the whole tree, as this can include additional elements
          if (select) {
            parent.selectedIndex = -1  // for IE9, compatible w/current riot behavior
          } else {
            // avoids insertion of cointainer inside container (ex: tbody inside tbody)
            var tname = rootEls[tagName];
            if (tname && parent.childElementCount === 1)
              parent = $(tname, parent)
          }
          return parent
        }
        /*
    Replace the yield tag from any tag template with the innerHTML of the
    original tag in the page
  */
        function replaceYield(templ, html) {
          // do nothing if no yield
          if (!reHasYield.test(templ))
            return templ;
          // be careful with #1343 - string on the source having `$1`
          var src = {};
          html = html && html.replace(reYieldSrc, function (_, ref, text) {
            src[ref] = src[ref] || text;
            // preserve first definition
            return ''
          }).trim();
          return templ.replace(reYieldDest, function (_, ref, def) {
            // yield with from - to attrs
            return src[ref] || def || ''
          }).replace(reYieldAll, function (_, def) {
            // yield without any "from"
            return html || def || ''
          })
        }
        return _mkdom
      }();
      /**
 * Convert the item looped into an object used to extend the child tag properties
 * @param   { Object } expr - object containing the keys used to extend the children tags
 * @param   { * } key - value to assign to the new object returned
 * @param   { * } val - value containing the position of the item in the array
 * @returns { Object } - new object containing the values of the original item
 *
 * The variables 'key' and 'val' are arbitrary.
 * They depend on the collection type looped (Array, Object)
 * and on the expression used on the each tag
 *
 */
      function mkitem(expr, key, val) {
        var item = {};
        item[expr.key] = key;
        if (expr.pos)
          item[expr.pos] = val;
        return item
      }
      /**
 * Unmount the redundant tags
 * @param   { Array } items - array containing the current items to loop
 * @param   { Array } tags - array containing all the children tags
 */
      function unmountRedundant(items, tags) {
        var i = tags.length, j = items.length, t;
        while (i > j) {
          t = tags[--i];
          tags.splice(i, 1);
          t.unmount()
        }
      }
      /**
 * Move the nested custom tags in non custom loop tags
 * @param   { Object } child - non custom loop tag
 * @param   { Number } i - current position of the loop tag
 */
      function moveNestedTags(child, i) {
        Object.keys(child.tags).forEach(function (tagName) {
          var tag = child.tags[tagName];
          if (isArray(tag))
            each(tag, function (t) {
              moveChildTag(t, tagName, i)
            });
          else
            moveChildTag(tag, tagName, i)
        })
      }
      /**
 * Adds the elements for a virtual tag
 * @param { Tag } tag - the tag whose root's children will be inserted or appended
 * @param { Node } src - the node that will do the inserting or appending
 * @param { Tag } target - only if inserting, insert before this tag's first child
 */
      function addVirtual(tag, src, target) {
        var el = tag._root, sib;
        tag._virts = [];
        while (el) {
          sib = el.nextSibling;
          if (target)
            src.insertBefore(el, target._root);
          else
            src.appendChild(el);
          tag._virts.push(el);
          // hold for unmounting
          el = sib
        }
      }
      /**
 * Move virtual tag and all child nodes
 * @param { Tag } tag - first child reference used to start move
 * @param { Node } src  - the node that will do the inserting
 * @param { Tag } target - insert before this tag's first child
 * @param { Number } len - how many child nodes to move
 */
      function moveVirtual(tag, src, target, len) {
        var el = tag._root, sib, i = 0;
        for (; i < len; i++) {
          sib = el.nextSibling;
          src.insertBefore(el, target._root);
          el = sib
        }
      }
      /**
 * Manage tags having the 'each'
 * @param   { Object } dom - DOM node we need to loop
 * @param   { Tag } parent - parent tag instance where the dom node is contained
 * @param   { String } expr - string contained in the 'each' attribute
 */
      function _each(dom, parent, expr) {
        // remove the each property from the original tag
        remAttr(dom, 'each');
        var mustReorder = typeof getAttr(dom, 'no-reorder') !== T_STRING || remAttr(dom, 'no-reorder'), tagName = getTagName(dom), impl = __tagImpl[tagName] || { tmpl: dom.outerHTML }, useRoot = SPECIAL_TAGS_REGEX.test(tagName), root = dom.parentNode, ref = document.createTextNode(''), child = getTag(dom), isOption = tagName.toLowerCase() === 'option',
          // the option tags must be treated differently
          tags = [], oldItems = [], hasKeys, isVirtual = dom.tagName == 'VIRTUAL';
        // parse the each expression
        expr = tmpl.loopKeys(expr);
        // insert a marked where the loop tags will be injected
        root.insertBefore(ref, dom);
        // clean template code
        parent.one('before-mount', function () {
          // remove the original DOM node
          dom.parentNode.removeChild(dom);
          if (root.stub)
            root = parent.root
        }).on('update', function () {
          // get the new items collection
          var items = tmpl(expr.val, parent),
            // create a fragment to hold the new DOM nodes to inject in the parent tag
            frag = document.createDocumentFragment();
          // object loop. any changes cause full redraw
          if (!isArray(items)) {
            hasKeys = items || false;
            items = hasKeys ? Object.keys(items).map(function (key) {
              return mkitem(expr, key, items[key])
            }) : []
          }
          // loop all the new items
          var i = 0, itemsLength = items.length;
          for (; i < itemsLength; i++) {
            // reorder only if the items are objects
            var item = items[i], _mustReorder = mustReorder && item instanceof Object && !hasKeys, oldPos = oldItems.indexOf(item), pos = ~oldPos && _mustReorder ? oldPos : i,
              // does a tag exist in this position?
              tag = tags[pos];
            item = !hasKeys && expr.key ? mkitem(expr, item, i) : item;
            // new tag
            if (!_mustReorder && !tag  // with no-reorder we just update the old tags
|| _mustReorder && !~oldPos || !tag  // by default we always try to reorder the DOM elements
) {
              tag = new Tag(impl, {
                parent: parent,
                isLoop: true,
                hasImpl: !!__tagImpl[tagName],
                root: useRoot ? root : dom.cloneNode(),
                item: item
              }, dom.innerHTML);
              tag.mount();
              if (isVirtual)
                tag._root = tag.root.firstChild;
              // save reference for further moves or inserts
              // this tag must be appended
              if (i == tags.length || !tags[i]) {
                // fix 1581
                if (isVirtual)
                  addVirtual(tag, frag);
                else
                  frag.appendChild(tag.root)
              }  // this tag must be insert
              else {
                if (isVirtual)
                  addVirtual(tag, root, tags[i]);
                else
                  root.insertBefore(tag.root, tags[i].root);
                // #1374 some browsers reset selected here
                oldItems.splice(i, 0, item)
              }
              tags.splice(i, 0, tag);
              pos = i  // handled here so no move
            } else
              tag.update(item, true);
            // reorder the tag if it's not located in its previous position
            if (pos !== i && _mustReorder && tags[i]  // fix 1581 unable to reproduce it in a test!
) {
              // update the DOM
              if (isVirtual)
                moveVirtual(tag, root, tags[i], dom.childNodes.length);
              else
                root.insertBefore(tag.root, tags[i].root);
              // update the position attribute if it exists
              if (expr.pos)
                tag[expr.pos] = i;
              // move the old tag instance
              tags.splice(i, 0, tags.splice(pos, 1)[0]);
              // move the old item
              oldItems.splice(i, 0, oldItems.splice(pos, 1)[0]);
              // if the loop tags are not custom
              // we need to move all their custom tags into the right position
              if (!child && tag.tags)
                moveNestedTags(tag, i)
            }
            // cache the original item to use it in the events bound to this node
            // and its children
            tag._item = item;
            // cache the real parent tag internally
            defineProperty(tag, '_parent', parent)
          }
          // remove the redundant tags
          unmountRedundant(items, tags);
          // insert the new nodes
          if (isOption) {
            root.appendChild(frag);
            // #1374 <select> <option selected={true}> </select>
            if (root.length) {
              var si, op = root.options;
              root.selectedIndex = si = -1;
              for (i = 0; i < op.length; i++) {
                if (op[i].selected = op[i].__selected) {
                  if (si < 0)
                    root.selectedIndex = si = i
                }
              }
            }
          } else
            root.insertBefore(frag, ref);
          // set the 'tags' property of the parent tag
          // if child is 'undefined' it means that we don't need to set this property
          // for example:
          // we don't need store the `myTag.tags['div']` property if we are looping a div tag
          // but we need to track the `myTag.tags['child']` property looping a custom child node named `child`
          if (child)
            parent.tags[tagName] = tags;
          // clone the items array
          oldItems = items.slice()
        })
      }
      /**
 * Object that will be used to inject and manage the css of every tag instance
 */
      var styleManager = function (_riot) {
        if (!window)
          return {
            // skip injection on the server
            add: function () {
            },
            inject: function () {
            }
          };
        var styleNode = function () {
          // create a new style element with the correct type
          var newNode = mkEl('style');
          setAttr(newNode, 'type', 'text/css');
          // replace any user node or insert the new one into the head
          var userNode = $('style[type=riot]');
          if (userNode) {
            if (userNode.id)
              newNode.id = userNode.id;
            userNode.parentNode.replaceChild(newNode, userNode)
          } else
            document.getElementsByTagName('head')[0].appendChild(newNode);
          return newNode
        }();
        // Create cache and shortcut to the correct property
        var cssTextProp = styleNode.styleSheet, stylesToInject = '';
        // Expose the style node in a non-modificable property
        Object.defineProperty(_riot, 'styleNode', {
          value: styleNode,
          writable: true
        });
        /**
   * Public api
   */
        return {
          /**
     * Save a tag style to be later injected into DOM
     * @param   { String } css [description]
     */
          add: function (css) {
            stylesToInject += css
          },
          /**
     * Inject all previously saved tag styles into DOM
     * innerHTML seems slow: http://jsperf.com/riot-insert-style
     */
          inject: function () {
            if (stylesToInject) {
              if (cssTextProp)
                cssTextProp.cssText += stylesToInject;
              else
                styleNode.innerHTML += stylesToInject;
              stylesToInject = ''
            }
          }
        }
      }(riot);
      function parseNamedElements(root, tag, childTags, forceParsingNamed) {
        walk(root, function (dom) {
          if (dom.nodeType == 1) {
            dom.isLoop = dom.isLoop || (dom.parentNode && dom.parentNode.isLoop || getAttr(dom, 'each')) ? 1 : 0;
            // custom child tag
            if (childTags) {
              var child = getTag(dom);
              if (child && !dom.isLoop)
                childTags.push(initChildTag(child, {
                  root: dom,
                  parent: tag
                }, dom.innerHTML, tag))
            }
            if (!dom.isLoop || forceParsingNamed)
              setNamed(dom, tag, [])
          }
        })
      }
      function parseExpressions(root, tag, expressions) {
        function addExpr(dom, val, extra) {
          if (tmpl.hasExpr(val)) {
            expressions.push(extend({
              dom: dom,
              expr: val
            }, extra))
          }
        }
        walk(root, function (dom) {
          var type = dom.nodeType, attr;
          // text node
          if (type == 3 && dom.parentNode.tagName != 'STYLE')
            addExpr(dom, dom.nodeValue);
          if (type != 1)
            return;
          /* element */
          // loop
          attr = getAttr(dom, 'each');
          if (attr) {
            _each(dom, tag, attr);
            return false
          }
          // attribute expressions
          each(dom.attributes, function (attr) {
            var name = attr.name, bool = name.split('__')[1];
            addExpr(dom, attr.value, {
              attr: bool || name,
              bool: bool
            });
            if (bool) {
              remAttr(dom, name);
              return false
            }
          });
          // skip custom tags
          if (getTag(dom))
            return false
        })
      }
      function Tag(impl, conf, innerHTML) {
        var self = riot.observable(this), opts = inherit(conf.opts) || {}, parent = conf.parent, isLoop = conf.isLoop, hasImpl = conf.hasImpl, item = cleanUpData(conf.item), expressions = [], childTags = [], root = conf.root, tagName = root.tagName.toLowerCase(), attr = {}, implAttr = {}, propsInSyncWithParent = [], dom;
        // only call unmount if we have a valid __tagImpl (has name property)
        if (impl.name && root._tag)
          root._tag.unmount(true);
        // not yet mounted
        this.isMounted = false;
        root.isLoop = isLoop;
        // keep a reference to the tag just created
        // so we will be able to mount this tag multiple times
        root._tag = this;
        // create a unique id to this tag
        // it could be handy to use it also to improve the virtual dom rendering speed
        defineProperty(this, '_riot_id', ++__uid);
        // base 1 allows test !t._riot_id
        extend(this, {
          parent: parent,
          root: root,
          opts: opts,
          tags: {}
        }, item);
        // grab attributes
        each(root.attributes, function (el) {
          var val = el.value;
          // remember attributes with expressions only
          if (tmpl.hasExpr(val))
            attr[el.name] = val
        });
        dom = mkdom(impl.tmpl, innerHTML);
        // options
        function updateOpts() {
          var ctx = hasImpl && isLoop ? self : parent || self;
          // update opts from current DOM attributes
          each(root.attributes, function (el) {
            var val = el.value;
            opts[toCamel(el.name)] = tmpl.hasExpr(val) ? tmpl(val, ctx) : val
          });
          // recover those with expressions
          each(Object.keys(attr), function (name) {
            opts[toCamel(name)] = tmpl(attr[name], ctx)
          })
        }
        function normalizeData(data) {
          for (var key in item) {
            if (typeof self[key] !== T_UNDEF && isWritable(self, key))
              self[key] = data[key]
          }
        }
        function inheritFromParent() {
          if (!self.parent || !isLoop)
            return;
          each(Object.keys(self.parent), function (k) {
            // some properties must be always in sync with the parent tag
            var mustSync = !contains(RESERVED_WORDS_BLACKLIST, k) && contains(propsInSyncWithParent, k);
            if (typeof self[k] === T_UNDEF || mustSync) {
              // track the property to keep in sync
              // so we can keep it updated
              if (!mustSync)
                propsInSyncWithParent.push(k);
              self[k] = self.parent[k]
            }
          })
        }
        /**
   * Update the tag expressions and options
   * @param   { * }  data - data we want to use to extend the tag properties
   * @param   { Boolean } isInherited - is this update coming from a parent tag?
   * @returns { self }
   */
        defineProperty(this, 'update', function (data, isInherited) {
          // make sure the data passed will not override
          // the component core methods
          data = cleanUpData(data);
          // inherit properties from the parent
          inheritFromParent();
          // normalize the tag properties in case an item object was initially passed
          if (data && isObject(item)) {
            normalizeData(data);
            item = data
          }
          extend(self, data);
          updateOpts();
          self.trigger('update', data);
          update(expressions, self);
          // the updated event will be triggered
          // once the DOM will be ready and all the re-flows are completed
          // this is useful if you want to get the "real" root properties
          // 4 ex: root.offsetWidth ...
          if (isInherited && self.parent)
            // closes #1599
            self.parent.one('updated', function () {
              self.trigger('updated')
            });
          else
            rAF(function () {
              self.trigger('updated')
            });
          return this
        });
        defineProperty(this, 'mixin', function () {
          each(arguments, function (mix) {
            var instance;
            mix = typeof mix === T_STRING ? riot.mixin(mix) : mix;
            // check if the mixin is a function
            if (isFunction(mix)) {
              // create the new mixin instance
              instance = new mix;
              // save the prototype to loop it afterwards
              mix = mix.prototype
            } else
              instance = mix;
            // loop the keys in the function prototype or the all object keys
            each(Object.getOwnPropertyNames(mix), function (key) {
              // bind methods to self
              if (key != 'init')
                self[key] = isFunction(instance[key]) ? instance[key].bind(self) : instance[key]
            });
            // init method will be called automatically
            if (instance.init)
              instance.init.bind(self)()
          });
          return this
        });
        defineProperty(this, 'mount', function () {
          updateOpts();
          // add global mixin
          var globalMixin = riot.mixin(GLOBAL_MIXIN);
          if (globalMixin)
            self.mixin(globalMixin);
          // initialiation
          if (impl.fn)
            impl.fn.call(self, opts);
          // parse layout after init. fn may calculate args for nested custom tags
          parseExpressions(dom, self, expressions);
          // mount the child tags
          toggle(true);
          // update the root adding custom attributes coming from the compiler
          // it fixes also #1087
          if (impl.attrs)
            walkAttributes(impl.attrs, function (k, v) {
              setAttr(root, k, v)
            });
          if (impl.attrs || hasImpl)
            parseExpressions(self.root, self, expressions);
          if (!self.parent || isLoop)
            self.update(item);
          // internal use only, fixes #403
          self.trigger('before-mount');
          if (isLoop && !hasImpl) {
            // update the root attribute for the looped elements
            root = dom.firstChild
          } else {
            while (dom.firstChild)
              root.appendChild(dom.firstChild);
            if (root.stub)
              root = parent.root
          }
          defineProperty(self, 'root', root);
          // parse the named dom nodes in the looped child
          // adding them to the parent as well
          if (isLoop)
            parseNamedElements(self.root, self.parent, null, true);
          // if it's not a child tag we can trigger its mount event
          if (!self.parent || self.parent.isMounted) {
            self.isMounted = true;
            self.trigger('mount')
          }  // otherwise we need to wait that the parent event gets triggered
          else
            self.parent.one('mount', function () {
              // avoid to trigger the `mount` event for the tags
              // not visible included in an if statement
              if (!isInStub(self.root)) {
                self.parent.isMounted = self.isMounted = true;
                self.trigger('mount')
              }
            })
        });
        defineProperty(this, 'unmount', function (keepRootTag) {
          var el = root, p = el.parentNode, ptag, tagIndex = __virtualDom.indexOf(self);
          self.trigger('before-unmount');
          // remove this tag instance from the global virtualDom variable
          if (~tagIndex)
            __virtualDom.splice(tagIndex, 1);
          if (this._virts) {
            each(this._virts, function (v) {
              if (v.parentNode)
                v.parentNode.removeChild(v)
            })
          }
          if (p) {
            if (parent) {
              ptag = getImmediateCustomParentTag(parent);
              // remove this tag from the parent tags object
              // if there are multiple nested tags with same name..
              // remove this element form the array
              if (isArray(ptag.tags[tagName]))
                each(ptag.tags[tagName], function (tag, i) {
                  if (tag._riot_id == self._riot_id)
                    ptag.tags[tagName].splice(i, 1)
                });
              else
                // otherwise just delete the tag instance
                ptag.tags[tagName] = undefined
            } else
              while (el.firstChild)
                el.removeChild(el.firstChild);
            if (!keepRootTag)
              p.removeChild(el);
            else
              // the riot-tag attribute isn't needed anymore, remove it
              remAttr(p, 'riot-tag')
          }
          self.trigger('unmount');
          toggle();
          self.off('*');
          self.isMounted = false;
          delete root._tag
        });
        // proxy function to bind updates
        // dispatched from a parent tag
        function onChildUpdate(data) {
          self.update(data, true)
        }
        function toggle(isMount) {
          // mount/unmount children
          each(childTags, function (child) {
            child[isMount ? 'mount' : 'unmount']()
          });
          // listen/unlisten parent (events flow one way from parent to children)
          if (!parent)
            return;
          var evt = isMount ? 'on' : 'off';
          // the loop tags will be always in sync with the parent automatically
          if (isLoop)
            parent[evt]('unmount', self.unmount);
          else {
            parent[evt]('update', onChildUpdate)[evt]('unmount', self.unmount)
          }
        }
        // named elements available for fn
        parseNamedElements(dom, this, childTags)
      }
      /**
 * Attach an event to a DOM node
 * @param { String } name - event name
 * @param { Function } handler - event callback
 * @param { Object } dom - dom node
 * @param { Tag } tag - tag instance
 */
      function setEventHandler(name, handler, dom, tag) {
        dom[name] = function (e) {
          var ptag = tag._parent, item = tag._item, el;
          if (!item)
            while (ptag && !item) {
              item = ptag._item;
              ptag = ptag._parent
            }
          // cross browser event fix
          e = e || window.event;
          // override the event properties
          if (isWritable(e, 'currentTarget'))
            e.currentTarget = dom;
          if (isWritable(e, 'target'))
            e.target = e.srcElement;
          if (isWritable(e, 'which'))
            e.which = e.charCode || e.keyCode;
          e.item = item;
          // prevent default behaviour (by default)
          if (handler.call(tag, e) !== true && !/radio|check/.test(dom.type)) {
            if (e.preventDefault)
              e.preventDefault();
            e.returnValue = false
          }
          if (!e.preventUpdate) {
            el = item ? getImmediateCustomParentTag(ptag) : tag;
            el.update()
          }
        }
      }
      /**
 * Insert a DOM node replacing another one (used by if- attribute)
 * @param   { Object } root - parent node
 * @param   { Object } node - node replaced
 * @param   { Object } before - node added
 */
      function insertTo(root, node, before) {
        if (!root)
          return;
        root.insertBefore(before, node);
        root.removeChild(node)
      }
      /**
 * Update the expressions in a Tag instance
 * @param   { Array } expressions - expression that must be re evaluated
 * @param   { Tag } tag - tag instance
 */
      function update(expressions, tag) {
        each(expressions, function (expr, i) {
          var dom = expr.dom, attrName = expr.attr, value = tmpl(expr.expr, tag), parent = expr.dom.parentNode;
          if (expr.bool) {
            value = !!value;
            if (attrName === 'selected')
              dom.__selected = value  // #1374
          } else if (value == null)
            value = '';
          // #1638: regression of #1612, update the dom only if the value of the
          // expression was changed
          if (expr.value === value) {
            return
          }
          expr.value = value;
          // textarea and text nodes has no attribute name
          if (!attrName) {
            // about #815 w/o replace: the browser converts the value to a string,
            // the comparison by "==" does too, but not in the server
            value += '';
            // test for parent avoids error with invalid assignment to nodeValue
            if (parent) {
              if (parent.tagName === 'TEXTAREA') {
                parent.value = value;
                // #1113
                if (!IE_VERSION)
                  dom.nodeValue = value  // #1625 IE throws here, nodeValue
              }  // will be available on 'updated'
              else
                dom.nodeValue = value
            }
            return
          }
          // ~~#1612: look for changes in dom.value when updating the value~~
          if (attrName === 'value') {
            dom.value = value;
            return
          }
          // remove original attribute
          remAttr(dom, attrName);
          // event handler
          if (isFunction(value)) {
            setEventHandler(attrName, value, dom, tag)  // if- conditional
          } else if (attrName == 'if') {
            var stub = expr.stub, add = function () {
                insertTo(stub.parentNode, stub, dom)
              }, remove = function () {
                insertTo(dom.parentNode, dom, stub)
              };
            // add to DOM
            if (value) {
              if (stub) {
                add();
                dom.inStub = false;
                // avoid to trigger the mount event if the tags is not visible yet
                // maybe we can optimize this avoiding to mount the tag at all
                if (!isInStub(dom)) {
                  walk(dom, function (el) {
                    if (el._tag && !el._tag.isMounted)
                      el._tag.isMounted = !!el._tag.trigger('mount')
                  })
                }
              }  // remove from DOM
            } else {
              stub = expr.stub = stub || document.createTextNode('');
              // if the parentNode is defined we can easily replace the tag
              if (dom.parentNode)
                remove()  // otherwise we need to wait the updated event
;
              else
                (tag.parent || tag).one('updated', remove);
              dom.inStub = true
            }  // show / hide
          } else if (attrName === 'show') {
            dom.style.display = value ? '' : 'none'
          } else if (attrName === 'hide') {
            dom.style.display = value ? 'none' : ''
          } else if (expr.bool) {
            dom[attrName] = value;
            if (value)
              setAttr(dom, attrName, attrName)
          } else if (value === 0 || value && typeof value !== T_OBJECT) {
            // <img src="{ expr }">
            if (startsWith(attrName, RIOT_PREFIX) && attrName != RIOT_TAG) {
              attrName = attrName.slice(RIOT_PREFIX.length)
            }
            setAttr(dom, attrName, value)
          }
        })
      }
      /**
 * Specialized function for looping an array-like collection with `each={}`
 * @param   { Array } els - collection of items
 * @param   {Function} fn - callback function
 * @returns { Array } the array looped
 */
      function each(els, fn) {
        var len = els ? els.length : 0;
        for (var i = 0, el; i < len; i++) {
          el = els[i];
          // return false -> current item was removed by fn during the loop
          if (el != null && fn(el, i) === false)
            i--
        }
        return els
      }
      /**
 * Detect if the argument passed is a function
 * @param   { * } v - whatever you want to pass to this function
 * @returns { Boolean } -
 */
      function isFunction(v) {
        return typeof v === T_FUNCTION || false  // avoid IE problems
      }
      /**
 * Detect if the argument passed is an object, exclude null.
 * NOTE: Use isObject(x) && !isArray(x) to excludes arrays.
 * @param   { * } v - whatever you want to pass to this function
 * @returns { Boolean } -
 */
      function isObject(v) {
        return v && typeof v === T_OBJECT  // typeof null is 'object'
      }
      /**
 * Remove any DOM attribute from a node
 * @param   { Object } dom - DOM node we want to update
 * @param   { String } name - name of the property we want to remove
 */
      function remAttr(dom, name) {
        dom.removeAttribute(name)
      }
      /**
 * Convert a string containing dashes to camel case
 * @param   { String } string - input string
 * @returns { String } my-string -> myString
 */
      function toCamel(string) {
        return string.replace(/-(\w)/g, function (_, c) {
          return c.toUpperCase()
        })
      }
      /**
 * Get the value of any DOM attribute on a node
 * @param   { Object } dom - DOM node we want to parse
 * @param   { String } name - name of the attribute we want to get
 * @returns { String | undefined } name of the node attribute whether it exists
 */
      function getAttr(dom, name) {
        return dom.getAttribute(name)
      }
      /**
 * Set any DOM attribute
 * @param { Object } dom - DOM node we want to update
 * @param { String } name - name of the property we want to set
 * @param { String } val - value of the property we want to set
 */
      function setAttr(dom, name, val) {
        dom.setAttribute(name, val)
      }
      /**
 * Detect the tag implementation by a DOM node
 * @param   { Object } dom - DOM node we need to parse to get its tag implementation
 * @returns { Object } it returns an object containing the implementation of a custom tag (template and boot function)
 */
      function getTag(dom) {
        return dom.tagName && __tagImpl[getAttr(dom, RIOT_TAG_IS) || getAttr(dom, RIOT_TAG) || dom.tagName.toLowerCase()]
      }
      /**
 * Add a child tag to its parent into the `tags` object
 * @param   { Object } tag - child tag instance
 * @param   { String } tagName - key where the new tag will be stored
 * @param   { Object } parent - tag instance where the new child tag will be included
 */
      function addChildTag(tag, tagName, parent) {
        var cachedTag = parent.tags[tagName];
        // if there are multiple children tags having the same name
        if (cachedTag) {
          // if the parent tags property is not yet an array
          // create it adding the first cached tag
          if (!isArray(cachedTag))
            // don't add the same tag twice
            if (cachedTag !== tag)
              parent.tags[tagName] = [cachedTag];
          // add the new nested tag to the array
          if (!contains(parent.tags[tagName], tag))
            parent.tags[tagName].push(tag)
        } else {
          parent.tags[tagName] = tag
        }
      }
      /**
 * Move the position of a custom tag in its parent tag
 * @param   { Object } tag - child tag instance
 * @param   { String } tagName - key where the tag was stored
 * @param   { Number } newPos - index where the new tag will be stored
 */
      function moveChildTag(tag, tagName, newPos) {
        var parent = tag.parent, tags;
        // no parent no move
        if (!parent)
          return;
        tags = parent.tags[tagName];
        if (isArray(tags))
          tags.splice(newPos, 0, tags.splice(tags.indexOf(tag), 1)[0]);
        else
          addChildTag(tag, tagName, parent)
      }
      /**
 * Create a new child tag including it correctly into its parent
 * @param   { Object } child - child tag implementation
 * @param   { Object } opts - tag options containing the DOM node where the tag will be mounted
 * @param   { String } innerHTML - inner html of the child node
 * @param   { Object } parent - instance of the parent tag including the child custom tag
 * @returns { Object } instance of the new child tag just created
 */
      function initChildTag(child, opts, innerHTML, parent) {
        var tag = new Tag(child, opts, innerHTML), tagName = getTagName(opts.root), ptag = getImmediateCustomParentTag(parent);
        // fix for the parent attribute in the looped elements
        tag.parent = ptag;
        // store the real parent tag
        // in some cases this could be different from the custom parent tag
        // for example in nested loops
        tag._parent = parent;
        // add this tag to the custom parent tag
        addChildTag(tag, tagName, ptag);
        // and also to the real parent tag
        if (ptag !== parent)
          addChildTag(tag, tagName, parent);
        // empty the child node once we got its template
        // to avoid that its children get compiled multiple times
        opts.root.innerHTML = '';
        return tag
      }
      /**
 * Loop backward all the parents tree to detect the first custom parent tag
 * @param   { Object } tag - a Tag instance
 * @returns { Object } the instance of the first custom parent tag found
 */
      function getImmediateCustomParentTag(tag) {
        var ptag = tag;
        while (!getTag(ptag.root)) {
          if (!ptag.parent)
            break;
          ptag = ptag.parent
        }
        return ptag
      }
      /**
 * Helper function to set an immutable property
 * @param   { Object } el - object where the new property will be set
 * @param   { String } key - object key where the new property will be stored
 * @param   { * } value - value of the new property
* @param   { Object } options - set the propery overriding the default options
 * @returns { Object } - the initial object
 */
      function defineProperty(el, key, value, options) {
        Object.defineProperty(el, key, extend({
          value: value,
          enumerable: false,
          writable: false,
          configurable: false
        }, options));
        return el
      }
      /**
 * Get the tag name of any DOM node
 * @param   { Object } dom - DOM node we want to parse
 * @returns { String } name to identify this dom node in riot
 */
      function getTagName(dom) {
        var child = getTag(dom), namedTag = getAttr(dom, 'name'), tagName = namedTag && !tmpl.hasExpr(namedTag) ? namedTag : child ? child.name : dom.tagName.toLowerCase();
        return tagName
      }
      /**
 * Extend any object with other properties
 * @param   { Object } src - source object
 * @returns { Object } the resulting extended object
 *
 * var obj = { foo: 'baz' }
 * extend(obj, {bar: 'bar', foo: 'bar'})
 * console.log(obj) => {bar: 'bar', foo: 'bar'}
 *
 */
      function extend(src) {
        var obj, args = arguments;
        for (var i = 1; i < args.length; ++i) {
          if (obj = args[i]) {
            for (var key in obj) {
              // check if this property of the source object could be overridden
              if (isWritable(src, key))
                src[key] = obj[key]
            }
          }
        }
        return src
      }
      /**
 * Check whether an array contains an item
 * @param   { Array } arr - target array
 * @param   { * } item - item to test
 * @returns { Boolean } Does 'arr' contain 'item'?
 */
      function contains(arr, item) {
        return ~arr.indexOf(item)
      }
      /**
 * Check whether an object is a kind of array
 * @param   { * } a - anything
 * @returns {Boolean} is 'a' an array?
 */
      function isArray(a) {
        return Array.isArray(a) || a instanceof Array
      }
      /**
 * Detect whether a property of an object could be overridden
 * @param   { Object }  obj - source object
 * @param   { String }  key - object property
 * @returns { Boolean } is this property writable?
 */
      function isWritable(obj, key) {
        var props = Object.getOwnPropertyDescriptor(obj, key);
        return typeof obj[key] === T_UNDEF || props && props.writable
      }
      /**
 * With this function we avoid that the internal Tag methods get overridden
 * @param   { Object } data - options we want to use to extend the tag instance
 * @returns { Object } clean object without containing the riot internal reserved words
 */
      function cleanUpData(data) {
        if (!(data instanceof Tag) && !(data && typeof data.trigger == T_FUNCTION))
          return data;
        var o = {};
        for (var key in data) {
          if (!contains(RESERVED_WORDS_BLACKLIST, key))
            o[key] = data[key]
        }
        return o
      }
      /**
 * Walk down recursively all the children tags starting dom node
 * @param   { Object }   dom - starting node where we will start the recursion
 * @param   { Function } fn - callback to transform the child node just found
 */
      function walk(dom, fn) {
        if (dom) {
          // stop the recursion
          if (fn(dom) === false)
            return;
          else {
            dom = dom.firstChild;
            while (dom) {
              walk(dom, fn);
              dom = dom.nextSibling
            }
          }
        }
      }
      /**
 * Minimize risk: only zero or one _space_ between attr & value
 * @param   { String }   html - html string we want to parse
 * @param   { Function } fn - callback function to apply on any attribute found
 */
      function walkAttributes(html, fn) {
        var m, re = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g;
        while (m = re.exec(html)) {
          fn(m[1].toLowerCase(), m[2] || m[3] || m[4])
        }
      }
      /**
 * Check whether a DOM node is in stub mode, useful for the riot 'if' directive
 * @param   { Object }  dom - DOM node we want to parse
 * @returns { Boolean } -
 */
      function isInStub(dom) {
        while (dom) {
          if (dom.inStub)
            return true;
          dom = dom.parentNode
        }
        return false
      }
      /**
 * Create a generic DOM node
 * @param   { String } name - name of the DOM node we want to create
 * @returns { Object } DOM node just created
 */
      function mkEl(name) {
        return document.createElement(name)
      }
      /**
 * Shorter and fast way to select multiple nodes in the DOM
 * @param   { String } selector - DOM selector
 * @param   { Object } ctx - DOM node where the targets of our search will is located
 * @returns { Object } dom nodes found
 */
      function $$(selector, ctx) {
        return (ctx || document).querySelectorAll(selector)
      }
      /**
 * Shorter and fast way to select a single node in the DOM
 * @param   { String } selector - unique dom selector
 * @param   { Object } ctx - DOM node where the target of our search will is located
 * @returns { Object } dom node found
 */
      function $(selector, ctx) {
        return (ctx || document).querySelector(selector)
      }
      /**
 * Simple object prototypal inheritance
 * @param   { Object } parent - parent object
 * @returns { Object } child instance
 */
      function inherit(parent) {
        function Child() {
        }
        Child.prototype = parent;
        return new Child
      }
      /**
 * Get the name property needed to identify a DOM node in riot
 * @param   { Object } dom - DOM node we need to parse
 * @returns { String | undefined } give us back a string to identify this dom node
 */
      function getNamedKey(dom) {
        return getAttr(dom, 'id') || getAttr(dom, 'name')
      }
      /**
 * Set the named properties of a tag element
 * @param { Object } dom - DOM node we need to parse
 * @param { Object } parent - tag instance where the named dom element will be eventually added
 * @param { Array } keys - list of all the tag instance properties
 */
      function setNamed(dom, parent, keys) {
        // get the key value we want to add to the tag instance
        var key = getNamedKey(dom), isArr,
          // add the node detected to a tag instance using the named property
          add = function (value) {
            // avoid to override the tag properties already set
            if (contains(keys, key))
              return;
            // check whether this value is an array
            isArr = isArray(value);
            // if the key was never set
            if (!value)
              // set it once on the tag instance
              parent[key] = dom  // if it was an array and not yet set
;
            else if (!isArr || isArr && !contains(value, dom)) {
              // add the dom node into the array
              if (isArr)
                value.push(dom);
              else
                parent[key] = [
                  value,
                  dom
                ]
            }
          };
        // skip the elements with no named properties
        if (!key)
          return;
        // check whether this key has been already evaluated
        if (tmpl.hasExpr(key))
          // wait the first updated event only once
          parent.one('mount', function () {
            key = getNamedKey(dom);
            add(parent[key])
          });
        else
          add(parent[key])
      }
      /**
 * Faster String startsWith alternative
 * @param   { String } src - source string
 * @param   { String } str - test string
 * @returns { Boolean } -
 */
      function startsWith(src, str) {
        return src.slice(0, str.length) === str
      }
      /**
 * requestAnimationFrame function
 * Adapted from https://gist.github.com/paulirish/1579671, license MIT
 */
      var rAF = function (w) {
        var raf = w.requestAnimationFrame || w.mozRequestAnimationFrame || w.webkitRequestAnimationFrame;
        if (!raf || /iP(ad|hone|od).*OS 6/.test(w.navigator.userAgent)) {
          // buggy iOS6
          var lastTime = 0;
          raf = function (cb) {
            var nowtime = Date.now(), timeout = Math.max(16 - (nowtime - lastTime), 0);
            setTimeout(function () {
              cb(lastTime = nowtime + timeout)
            }, timeout)
          }
        }
        return raf
      }(window || {});
      /**
 * Mount a tag creating new Tag instance
 * @param   { Object } root - dom node where the tag will be mounted
 * @param   { String } tagName - name of the riot tag we want to mount
 * @param   { Object } opts - options to pass to the Tag instance
 * @returns { Tag } a new Tag instance
 */
      function mountTo(root, tagName, opts) {
        var tag = __tagImpl[tagName],
          // cache the inner HTML to fix #855
          innerHTML = root._innerHTML = root._innerHTML || root.innerHTML;
        // clear the inner html
        root.innerHTML = '';
        if (tag && root)
          tag = new Tag(tag, {
            root: root,
            opts: opts
          }, innerHTML);
        if (tag && tag.mount) {
          tag.mount();
          // add this tag to the virtualDom variable
          if (!contains(__virtualDom, tag))
            __virtualDom.push(tag)
        }
        return tag
      }
      /**
 * Riot public api
 */
      // share methods for other riot parts, e.g. compiler
      riot.util = {
        brackets: brackets,
        tmpl: tmpl
      };
      /**
 * Create a mixin that could be globally shared across all the tags
 */
      riot.mixin = function () {
        var mixins = {};
        /**
   * Create/Return a mixin by its name
   * @param   { String } name - mixin name (global mixin if missing)
   * @param   { Object } mixin - mixin logic
   * @returns { Object } the mixin logic
   */
        return function (name, mixin) {
          if (isObject(name)) {
            mixin = name;
            mixins[GLOBAL_MIXIN] = extend(mixins[GLOBAL_MIXIN] || {}, mixin);
            return
          }
          if (!mixin)
            return mixins[name];
          mixins[name] = mixin
        }
      }();
      /**
 * Create a new riot tag implementation
 * @param   { String }   name - name/id of the new riot tag
 * @param   { String }   html - tag template
 * @param   { String }   css - custom tag css
 * @param   { String }   attrs - root tag attributes
 * @param   { Function } fn - user function
 * @returns { String } name/id of the tag just created
 */
      riot.tag = function (name, html, css, attrs, fn) {
        if (isFunction(attrs)) {
          fn = attrs;
          if (/^[\w\-]+\s?=/.test(css)) {
            attrs = css;
            css = ''
          } else
            attrs = ''
        }
        if (css) {
          if (isFunction(css))
            fn = css;
          else
            styleManager.add(css)
        }
        name = name.toLowerCase();
        __tagImpl[name] = {
          name: name,
          tmpl: html,
          attrs: attrs,
          fn: fn
        };
        return name
      };
      /**
 * Create a new riot tag implementation (for use by the compiler)
 * @param   { String }   name - name/id of the new riot tag
 * @param   { String }   html - tag template
 * @param   { String }   css - custom tag css
 * @param   { String }   attrs - root tag attributes
 * @param   { Function } fn - user function
 * @returns { String } name/id of the tag just created
 */
      riot.tag2 = function (name, html, css, attrs, fn) {
        if (css)
          styleManager.add(css);
        //if (bpair) riot.settings.brackets = bpair
        __tagImpl[name] = {
          name: name,
          tmpl: html,
          attrs: attrs,
          fn: fn
        };
        return name
      };
      /**
 * Mount a tag using a specific tag implementation
 * @param   { String } selector - tag DOM selector
 * @param   { String } tagName - tag implementation name
 * @param   { Object } opts - tag logic
 * @returns { Array } new tags instances
 */
      riot.mount = function (selector, tagName, opts) {
        var els, allTags, tags = [];
        // helper functions
        function addRiotTags(arr) {
          var list = '';
          each(arr, function (e) {
            if (!/[^-\w]/.test(e)) {
              e = e.trim().toLowerCase();
              list += ',[' + RIOT_TAG_IS + '="' + e + '"],[' + RIOT_TAG + '="' + e + '"]'
            }
          });
          return list
        }
        function selectAllTags() {
          var keys = Object.keys(__tagImpl);
          return keys + addRiotTags(keys)
        }
        function pushTags(root) {
          if (root.tagName) {
            var riotTag = getAttr(root, RIOT_TAG_IS) || getAttr(root, RIOT_TAG);
            // have tagName? force riot-tag to be the same
            if (tagName && riotTag !== tagName) {
              riotTag = tagName;
              setAttr(root, RIOT_TAG_IS, tagName)
            }
            var tag = mountTo(root, riotTag || root.tagName.toLowerCase(), opts);
            if (tag)
              tags.push(tag)
          } else if (root.length) {
            each(root, pushTags)  // assume nodeList
          }
        }
        // ----- mount code -----
        // inject styles into DOM
        styleManager.inject();
        if (isObject(tagName)) {
          opts = tagName;
          tagName = 0
        }
        // crawl the DOM to find the tag
        if (typeof selector === T_STRING) {
          if (selector === '*')
            // select all the tags registered
            // and also the tags found with the riot-tag attribute set
            selector = allTags = selectAllTags();
          else
            // or just the ones named like the selector
            selector += addRiotTags(selector.split(/, */));
          // make sure to pass always a selector
          // to the querySelectorAll function
          els = selector ? $$(selector) : []
        } else
          // probably you have passed already a tag or a NodeList
          els = selector;
        // select all the registered and mount them inside their root elements
        if (tagName === '*') {
          // get all custom tags
          tagName = allTags || selectAllTags();
          // if the root els it's just a single tag
          if (els.tagName)
            els = $$(tagName, els);
          else {
            // select all the children for all the different root elements
            var nodeList = [];
            each(els, function (_el) {
              nodeList.push($$(tagName, _el))
            });
            els = nodeList
          }
          // get rid of the tagName
          tagName = 0
        }
        pushTags(els);
        return tags
      };
      /**
 * Update all the tags instances created
 * @returns { Array } all the tags instances
 */
      riot.update = function () {
        return each(__virtualDom, function (tag) {
          tag.update()
        })
      };
      /**
 * Export the Tag constructor
 */
      riot.Tag = Tag;
      // support CommonJS, AMD & browser
      /* istanbul ignore next */
      if (typeof exports === T_OBJECT)
        module.exports = riot;
      else if (typeof define === T_FUNCTION && typeof define.amd !== T_UNDEF)
        define(function () {
          return riot
        });
      else
        window.riot = riot
    }(typeof window != 'undefined' ? window : void 0))
  });
  // source: src/controls/text.coffee
  require.define('./controls/text', function (module, exports, __dirname, __filename, process) {
    var Control, Text, placeholder, extend = function (child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key]
        }
        function ctor() {
          this.constructor = child
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor;
        child.__super__ = parent.prototype;
        return child
      }, hasProp = {}.hasOwnProperty;
    Control = require('./controls/control');
    placeholder = require('./utils/placeholder');
    module.exports = Text = function (superClass) {
      extend(Text, superClass);
      function Text() {
        return Text.__super__.constructor.apply(this, arguments)
      }
      Text.prototype.tag = 'text-control';
      Text.prototype.type = 'text';
      Text.prototype.html = require('./templates/text');
      Text.prototype.formElement = 'input';
      Text.prototype.init = function () {
        Text.__super__.init.apply(this, arguments);
        console.log('text intiialized');
        return this.on('updated', function (_this) {
          return function () {
            var el;
            el = _this.root.getElementsByTagName(_this.formElement)[0];
            if (_this.type !== 'password') {
              return placeholder(el)
            }
          }
        }(this))
      };
      return Text
    }(Control)
  });
  // source: src/utils/placeholder.coffee
  require.define('./utils/placeholder', function (module, exports, __dirname, __filename, process) {
    var hidePlaceholderOnFocus, unfocusOnAnElement;
    hidePlaceholderOnFocus = function (event) {
      var target;
      target = event.currentTarget ? event.currentTarget : event.srcElement;
      if (target.value === target.getAttribute('placeholder')) {
        return target.value = ''
      }
    };
    unfocusOnAnElement = function (event) {
      var target;
      target = event.currentTarget ? event.currentTarget : event.srcElement;
      if (target.value === '') {
        return target.value = target.getAttribute('placeholder')
      }
    };
    if (document.createElement('input').placeholder != null) {
      module.exports = function () {
      }
    } else {
      module.exports = function (input) {
        var ref;
        input = (ref = input[0]) != null ? ref : input;
        if (input._placeholdered != null) {
          return
        }
        Object.defineProperty(input, '_placeholdered', {
          value: true,
          writable: true
        });
        if (!input.value) {
          input.value = input.getAttribute('placeholder')
        }
        if (input.addEventListener) {
          input.addEventListener('click', hidePlaceholderOnFocus, false);
          return input.addEventListener('blur', unfocusOnAnElement, false)
        } else if (input.attachEvent) {
          input.attachEvent('onclick', hidePlaceholderOnFocus);
          return input.attachEvent('onblur', unfocusOnAnElement)
        }
      }
    }
  });
  // source: src/templates/text.html
  require.define('./templates/text', function (module, exports, __dirname, __filename, process) {
    module.exports = '<input id="{ input.name }" name="{ name || input.name }" type="{ type }" onchange="{ change }" onblur="{ change }" value="{ input.ref(input.name) }" placeholder="{ placeholder }">\n<yield></yield>\n\n'
  });
  // source: src/page.coffee
  require.define('./page', function (module, exports, __dirname, __filename, process) {
    var Page, RiotPage, riot, extend = function (child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key))
            child[key] = parent[key]
        }
        function ctor() {
          this.constructor = child
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor;
        child.__super__ = parent.prototype;
        return child
      }, hasProp = {}.hasOwnProperty;
    Page = require('daisho-sdk/lib').Page;
    riot = require('riot/riot');
    module.exports = RiotPage = function (superClass) {
      extend(RiotPage, superClass);
      function RiotPage() {
        return RiotPage.__super__.constructor.apply(this, arguments)
      }
      RiotPage.prototype.tag = 'tag';
      RiotPage.prototype.opts = null;
      RiotPage.prototype.load = function (opts) {
        this.opts = opts != null ? opts : {}
      };
      RiotPage.prototype.render = function () {
        var el;
        el = document.createElement(this.tag);
        this.el.appendChild(el);
        return this.tag = riot.mount(this.tag, this.opts)[0]
      };
      RiotPage.prototype.unload = function () {
        return this.tag.unmount()
      };
      return RiotPage
    }(Page)
  });
  // source: node_modules/daisho-sdk/lib/index.js
  require.define('daisho-sdk/lib', function (module, exports, __dirname, __filename, process) {
    // Generated by CoffeeScript 1.10.0
    module.exports = {
      Page: require('daisho-sdk/lib/page'),
      Module: require('daisho-sdk/lib/module')
    }  //# sourceMappingURL=index.js.map
  });
  // source: node_modules/daisho-sdk/lib/page.js
  require.define('daisho-sdk/lib/page', function (module, exports, __dirname, __filename, process) {
    // Generated by CoffeeScript 1.10.0
    var Page;
    module.exports = Page = function () {
      Page.prototype.el = null;
      Page.prototype.module = null;
      function Page(el, module1) {
        this.el = el;
        this.module = module1
      }
      Page.prototype.load = function (opts) {
        if (opts == null) {
          opts = {}
        }
      };
      Page.prototype.render = function () {
      };
      Page.prototype.unload = function () {
      };
      Page.prototype.annotations = function () {
      };
      return Page
    }()  //# sourceMappingURL=page.js.map
  });
  // source: node_modules/daisho-sdk/lib/module.js
  require.define('daisho-sdk/lib/module', function (module, exports, __dirname, __filename, process) {
    // Generated by CoffeeScript 1.10.0
    var Module;
    module.exports = Module = function () {
      Module.prototype.json = null;
      function Module() {
      }
      Module.prototype.load = function () {
      };
      Module.prototype.unload = function () {
      };
      return Module
    }()  //# sourceMappingURL=module.js.map
  });
  // source: src/index.coffee
  require.define('./index', function (module, exports, __dirname, __filename, process) {
    var Controls;
    Controls = require('./controls');
    module.exports = {
      RiotPage: require('./page'),
      Events: require('./events'),
      register: function (m) {
        return Controls.register(m)
      }
    }
  });
  require('./index')
}.call(this, this))//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xzL2luZGV4LmNvZmZlZSIsImNvbnRyb2xzL2NvbnRyb2wuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Nyb3dkY29udHJvbC9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY3Jvd2Rjb250cm9sL2xpYi9yaW90LmpzIiwibm9kZV9tb2R1bGVzL2Nyb3dkY29udHJvbC9saWIvdmlld3MvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY3Jvd2Rjb250cm9sL2xpYi92aWV3cy9mb3JtLmpzIiwibm9kZV9tb2R1bGVzL2Nyb3dkY29udHJvbC9saWIvdmlld3Mvdmlldy5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2lzLWZ1bmN0aW9uL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Nyb3dkY29udHJvbC9saWIvdmlld3MvaW5wdXRpZnkuanMiLCJub2RlX21vZHVsZXMvYnJva2VuL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy96b3VzYW4vem91c2FuLW1pbi5qcyIsIm5vZGVfbW9kdWxlcy9yZWZlcmVudGlhbC9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVmZXJlbnRpYWwvbGliL3JlZmVyLmpzIiwibm9kZV9tb2R1bGVzL3JlZmVyZW50aWFsL2xpYi9yZWYuanMiLCJub2RlX21vZHVsZXMvbm9kZS5leHRlbmQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbm9kZS5leHRlbmQvbGliL2V4dGVuZC5qcyIsIm5vZGVfbW9kdWxlcy9pcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pcy1hcnJheS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pcy1udW1iZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMva2luZC1vZi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pcy1idWZmZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaXMtb2JqZWN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2lzLXN0cmluZy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9taXNlLXNldHRsZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9taXNlLXNldHRsZS9saWIvcHJvbWlzZS1zZXR0bGUuanMiLCJub2RlX21vZHVsZXMvY3Jvd2Rjb250cm9sL2xpYi92aWV3cy9pbnB1dC5qcyIsImV2ZW50cy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcmlvdC9yaW90LmpzIiwiY29udHJvbHMvdGV4dC5jb2ZmZWUiLCJ1dGlscy9wbGFjZWhvbGRlci5jb2ZmZWUiLCJ0ZW1wbGF0ZXMvdGV4dC5odG1sIiwicGFnZS5jb2ZmZWUiLCJub2RlX21vZHVsZXMvZGFpc2hvLXNkay9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZGFpc2hvLXNkay9saWIvcGFnZS5qcyIsIm5vZGVfbW9kdWxlcy9kYWlzaG8tc2RrL2xpYi9tb2R1bGUuanMiLCJpbmRleC5jb2ZmZWUiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsIkNvbnRyb2wiLCJyZXF1aXJlIiwiVGV4dCIsInJlZ2lzdGVyIiwibSIsIkNyb3dkQ29udHJvbCIsIkV2ZW50cyIsInJpb3QiLCJzY3JvbGxpbmciLCJleHRlbmQiLCJjaGlsZCIsInBhcmVudCIsImtleSIsImhhc1Byb3AiLCJjYWxsIiwiY3RvciIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwiX19zdXBlcl9fIiwiaGFzT3duUHJvcGVydHkiLCJzdXBlckNsYXNzIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJpbml0IiwiaW5wdXQiLCJpbnB1dHMiLCJsb29rdXAiLCJnZXRWYWx1ZSIsImV2ZW50IiwicmVmIiwiJCIsInRhcmdldCIsInZhbCIsInRyaW0iLCJlcnJvciIsImVyciIsIkRPTUV4Y2VwdGlvbiIsImNvbnNvbGUiLCJsb2ciLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwicm9vdCIsIm9mZnNldCIsInRvcCIsIndpbmRvdyIsImhlaWdodCIsImNvbXBsZXRlIiwiZHVyYXRpb24iLCJ0cmlnZ2VyIiwiQ2hhbmdlRmFpbGVkIiwibmFtZSIsImdldCIsImNoYW5nZSIsIkNoYW5nZSIsImNoYW5nZWQiLCJ2YWx1ZSIsIkNoYW5nZVN1Y2Nlc3MiLCJ1cGRhdGUiLCJ2IiwiVmlld3MiLCJJbnB1dCIsInIiLCJ0YWdzIiwic3RhcnQiLCJvcHRzIiwibW91bnQiLCJpIiwibGVuIiwicmVzdWx0cyIsInRhZyIsImxlbmd0aCIsInB1c2giLCJDcm93ZHN0YXJ0IiwiQ3Jvd2Rjb250cm9sIiwic2V0IiwiRm9ybSIsIlZpZXciLCJQcm9taXNlIiwiaW5wdXRpZnkiLCJvYnNlcnZhYmxlIiwic2V0dGxlIiwiY29uZmlncyIsImRhdGEiLCJpbml0SW5wdXRzIiwicmVzdWx0czEiLCJzdWJtaXQiLCJwUmVmIiwicHMiLCJwIiwidGhlbiIsIl90aGlzIiwicmVzdWx0IiwiaXNGdWxmaWxsZWQiLCJfc3VibWl0IiwiY29sbGFwc2VQcm90b3R5cGUiLCJpc0Z1bmN0aW9uIiwib2JqZWN0QXNzaWduIiwic2V0UHJvdG90eXBlT2YiLCJtaXhpblByb3BlcnRpZXMiLCJzZXRQcm90b09mIiwib2JqIiwicHJvdG8iLCJfX3Byb3RvX18iLCJwcm9wIiwiT2JqZWN0IiwiQXJyYXkiLCJjb2xsYXBzZSIsInBhcmVudFByb3RvIiwiZ2V0UHJvdG90eXBlT2YiLCJodG1sIiwiY3NzIiwiYXR0cnMiLCJldmVudHMiLCJuZXdQcm90byIsImJlZm9yZUluaXQiLCJmbiIsImhhbmRsZXIiLCJrIiwic2VsZiIsIm9sZEZuIiwib24iLCJwcm9wSXNFbnVtZXJhYmxlIiwicHJvcGVydHlJc0VudW1lcmFibGUiLCJ0b09iamVjdCIsInVuZGVmaW5lZCIsIlR5cGVFcnJvciIsImFzc2lnbiIsInNvdXJjZSIsImZyb20iLCJ0byIsInN5bWJvbHMiLCJzIiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwidG9TdHJpbmciLCJzdHJpbmciLCJzZXRUaW1lb3V0IiwiYWxlcnQiLCJjb25maXJtIiwicHJvbXB0IiwiaXNSZWYiLCJyZWZlciIsIm8iLCJjb25maWciLCJmbjEiLCJtaWRkbGV3YXJlIiwibWlkZGxld2FyZUZuIiwidmFsaWRhdGUiLCJwYWlyIiwicmVzb2x2ZSIsImoiLCJsZW4xIiwiUHJvbWlzZUluc3BlY3Rpb24iLCJzdXBwcmVzc1VuY2F1Z2h0UmVqZWN0aW9uRXJyb3IiLCJhcmciLCJzdGF0ZSIsInJlYXNvbiIsImlzUmVqZWN0ZWQiLCJyZWZsZWN0IiwicHJvbWlzZSIsInJlamVjdCIsInByb21pc2VzIiwiYWxsIiwibWFwIiwiY2FsbGJhY2siLCJjYiIsInQiLCJlIiwibiIsInkiLCJjIiwidSIsImYiLCJzcGxpY2UiLCJNdXRhdGlvbk9ic2VydmVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwib2JzZXJ2ZSIsImF0dHJpYnV0ZXMiLCJzZXRBdHRyaWJ1dGUiLCJzZXRJbW1lZGlhdGUiLCJzdGFjayIsImwiLCJhIiwidGltZW91dCIsIkVycm9yIiwiWm91c2FuIiwic29vbiIsImdsb2JhbCIsIlJlZiIsIm1ldGhvZCIsInJlZjEiLCJ3cmFwcGVyIiwiY2xvbmUiLCJpc0FycmF5IiwiaXNOdW1iZXIiLCJpc09iamVjdCIsImlzU3RyaW5nIiwiX3ZhbHVlIiwia2V5MSIsIl9jYWNoZSIsIl9tdXRhdGUiLCJpbmRleCIsInByZXYiLCJuZXh0IiwicHJvcHMiLCJTdHJpbmciLCJzcGxpdCIsInNoaWZ0IiwiaXMiLCJkZWVwIiwib3B0aW9ucyIsInNyYyIsImNvcHkiLCJjb3B5X2lzX2FycmF5IiwiaGFzaCIsImFycmF5IiwidmVyc2lvbiIsIm9ialByb3RvIiwib3ducyIsInRvU3RyIiwic3ltYm9sVmFsdWVPZiIsIlN5bWJvbCIsInZhbHVlT2YiLCJpc0FjdHVhbE5hTiIsIk5PTl9IT1NUX1RZUEVTIiwibnVtYmVyIiwiYmFzZTY0UmVnZXgiLCJoZXhSZWdleCIsInR5cGUiLCJkZWZpbmVkIiwiZW1wdHkiLCJlcXVhbCIsIm90aGVyIiwiZ2V0VGltZSIsImhvc3RlZCIsImhvc3QiLCJpbnN0YW5jZSIsIm5pbCIsInVuZGVmIiwiYXJncyIsImlzU3RhbmRhcmRBcmd1bWVudHMiLCJpc09sZEFyZ3VtZW50cyIsImFycmF5bGlrZSIsIm9iamVjdCIsImNhbGxlZSIsImJvb2wiLCJpc0Zpbml0ZSIsIkJvb2xlYW4iLCJOdW1iZXIiLCJkYXRlIiwiZWxlbWVudCIsIkhUTUxFbGVtZW50Iiwibm9kZVR5cGUiLCJpc0FsZXJ0IiwiaW5maW5pdGUiLCJJbmZpbml0eSIsImRlY2ltYWwiLCJkaXZpc2libGVCeSIsImlzRGl2aWRlbmRJbmZpbml0ZSIsImlzRGl2aXNvckluZmluaXRlIiwiaXNOb25aZXJvTnVtYmVyIiwiaW50ZWdlciIsIm1heGltdW0iLCJvdGhlcnMiLCJtaW5pbXVtIiwibmFuIiwiZXZlbiIsIm9kZCIsImdlIiwiZ3QiLCJsZSIsImx0Iiwid2l0aGluIiwiZmluaXNoIiwiaXNBbnlJbmZpbml0ZSIsInNldEludGVydmFsIiwicmVnZXhwIiwiYmFzZTY0IiwidGVzdCIsImhleCIsInN5bWJvbCIsInN0ciIsInR5cGVPZiIsIm51bSIsImlzQnVmZmVyIiwia2luZE9mIiwiRnVuY3Rpb24iLCJSZWdFeHAiLCJEYXRlIiwiQnVmZmVyIiwiX2lzQnVmZmVyIiwieCIsInN0clZhbHVlIiwidHJ5U3RyaW5nT2JqZWN0Iiwic3RyQ2xhc3MiLCJoYXNUb1N0cmluZ1RhZyIsInRvU3RyaW5nVGFnIiwicHJvbWlzZVJlc3VsdHMiLCJwcm9taXNlUmVzdWx0IiwiY2F0Y2giLCJyZXR1cm5zIiwiYmluZCIsInRocm93cyIsImVycm9yTWVzc2FnZSIsImVycm9ySHRtbCIsImNsZWFyRXJyb3IiLCJtZXNzYWdlIiwic2V0dGluZ3MiLCJfX3VpZCIsIl9fdmlydHVhbERvbSIsIl9fdGFnSW1wbCIsIkdMT0JBTF9NSVhJTiIsIlJJT1RfUFJFRklYIiwiUklPVF9UQUciLCJSSU9UX1RBR19JUyIsIlRfU1RSSU5HIiwiVF9PQkpFQ1QiLCJUX1VOREVGIiwiVF9CT09MIiwiVF9GVU5DVElPTiIsIlNQRUNJQUxfVEFHU19SRUdFWCIsIlJFU0VSVkVEX1dPUkRTX0JMQUNLTElTVCIsIklFX1ZFUlNJT04iLCJkb2N1bWVudE1vZGUiLCJlbCIsImNhbGxiYWNrcyIsInNsaWNlIiwib25FYWNoRXZlbnQiLCJyZXBsYWNlIiwiZGVmaW5lUHJvcGVydGllcyIsInBvcyIsInR5cGVkIiwiZW51bWVyYWJsZSIsIndyaXRhYmxlIiwiY29uZmlndXJhYmxlIiwib2ZmIiwiYXJyIiwib25lIiwiYXJnbGVuIiwiZm5zIiwiYnVzeSIsImNvbmNhdCIsIlJFX09SSUdJTiIsIkVWRU5UX0xJU1RFTkVSIiwiUkVNT1ZFX0VWRU5UX0xJU1RFTkVSIiwiQUREX0VWRU5UX0xJU1RFTkVSIiwiSEFTX0FUVFJJQlVURSIsIlJFUExBQ0UiLCJQT1BTVEFURSIsIkhBU0hDSEFOR0UiLCJUUklHR0VSIiwiTUFYX0VNSVRfU1RBQ0tfTEVWRUwiLCJ3aW4iLCJkb2MiLCJoaXN0IiwiaGlzdG9yeSIsImxvYyIsImxvY2F0aW9uIiwicHJvdCIsIlJvdXRlciIsImNsaWNrRXZlbnQiLCJvbnRvdWNoc3RhcnQiLCJzdGFydGVkIiwiY2VudHJhbCIsInJvdXRlRm91bmQiLCJkZWJvdW5jZWRFbWl0IiwiYmFzZSIsImN1cnJlbnQiLCJwYXJzZXIiLCJzZWNvbmRQYXJzZXIiLCJlbWl0U3RhY2siLCJlbWl0U3RhY2tMZXZlbCIsIkRFRkFVTFRfUEFSU0VSIiwicGF0aCIsIkRFRkFVTFRfU0VDT05EX1BBUlNFUiIsImZpbHRlciIsInJlIiwibWF0Y2giLCJkZWJvdW5jZSIsImRlbGF5IiwiY2xlYXJUaW1lb3V0IiwiYXV0b0V4ZWMiLCJlbWl0IiwiY2xpY2siLCJub3JtYWxpemUiLCJnZXRQYXRoRnJvbVJvb3QiLCJocmVmIiwiZ2V0UGF0aEZyb21CYXNlIiwiZm9yY2UiLCJpc1Jvb3QiLCJ3aGljaCIsIm1ldGFLZXkiLCJjdHJsS2V5Iiwic2hpZnRLZXkiLCJkZWZhdWx0UHJldmVudGVkIiwibm9kZU5hbWUiLCJwYXJlbnROb2RlIiwiaW5kZXhPZiIsImdvIiwidGl0bGUiLCJwcmV2ZW50RGVmYXVsdCIsInNob3VsZFJlcGxhY2UiLCJyZXBsYWNlU3RhdGUiLCJwdXNoU3RhdGUiLCJmaXJzdCIsInNlY29uZCIsInRoaXJkIiwic29tZSIsImFjdGlvbiIsIm1haW5Sb3V0ZXIiLCJyb3V0ZSIsImNyZWF0ZSIsIm5ld1N1YlJvdXRlciIsInN0b3AiLCJleGVjIiwiZm4yIiwicXVlcnkiLCJxIiwiXyIsInJlYWR5U3RhdGUiLCJicmFja2V0cyIsIlVOREVGIiwiUkVHTE9CIiwiUl9NTENPTU1TIiwiUl9TVFJJTkdTIiwiU19RQkxPQ0tTIiwiRklOREJSQUNFUyIsIkRFRkFVTFQiLCJfcGFpcnMiLCJjYWNoZWRCcmFja2V0cyIsIl9yZWdleCIsIl9zZXR0aW5ncyIsIl9sb29wYmFjayIsIl9yZXdyaXRlIiwiYnAiLCJfY3JlYXRlIiwiX2JyYWNrZXRzIiwicmVPcklkeCIsInRtcGwiLCJfYnAiLCJwYXJ0cyIsImlzZXhwciIsImxhc3RJbmRleCIsInNraXBCcmFjZXMiLCJ1bmVzY2FwZVN0ciIsImNoIiwiaXgiLCJyZWNjaCIsImhhc0V4cHIiLCJsb29wS2V5cyIsImV4cHIiLCJoYXNSYXciLCJfcmVzZXQiLCJfc2V0U2V0dGluZ3MiLCJiIiwiZGVmaW5lUHJvcGVydHkiLCJfdG1wbCIsIl9sb2dFcnIiLCJoYXZlUmF3IiwiZXJyb3JIYW5kbGVyIiwiY3R4IiwicmlvdERhdGEiLCJ0YWdOYW1lIiwiX3Jpb3RfaWQiLCJfZ2V0VG1wbCIsIlJFX1FCTE9DSyIsIlJFX1FCTUFSSyIsInFzdHIiLCJsaXN0IiwiX3BhcnNlRXhwciIsImpvaW4iLCJSRV9CUkVORCIsIkNTX0lERU5UIiwiYXNUZXh0IiwiZGl2IiwiY250IiwianNiIiwicmlnaHRDb250ZXh0IiwiX3dyYXBFeHByIiwibW0iLCJsdiIsImlyIiwiSlNfQ09OVEVYVCIsIkpTX1ZBUk5BTUUiLCJKU19OT1BST1BTIiwidGIiLCJtdmFyIiwicGFyc2UiLCJta2RvbSIsIl9ta2RvbSIsInJlSGFzWWllbGQiLCJyZVlpZWxkQWxsIiwicmVZaWVsZFNyYyIsInJlWWllbGREZXN0Iiwicm9vdEVscyIsInRyIiwidGgiLCJ0ZCIsImNvbCIsInRibFRhZ3MiLCJ0ZW1wbCIsInRvTG93ZXJDYXNlIiwibWtFbCIsInJlcGxhY2VZaWVsZCIsInNwZWNpYWxUYWdzIiwiaW5uZXJIVE1MIiwic3R1YiIsInNlbGVjdCIsImZpcnN0Q2hpbGQiLCJzZWxlY3RlZEluZGV4IiwidG5hbWUiLCJjaGlsZEVsZW1lbnRDb3VudCIsInRleHQiLCJkZWYiLCJta2l0ZW0iLCJpdGVtIiwidW5tb3VudFJlZHVuZGFudCIsIml0ZW1zIiwidW5tb3VudCIsIm1vdmVOZXN0ZWRUYWdzIiwia2V5cyIsImZvckVhY2giLCJlYWNoIiwibW92ZUNoaWxkVGFnIiwiYWRkVmlydHVhbCIsIl9yb290Iiwic2liIiwiX3ZpcnRzIiwibmV4dFNpYmxpbmciLCJpbnNlcnRCZWZvcmUiLCJhcHBlbmRDaGlsZCIsIm1vdmVWaXJ0dWFsIiwiX2VhY2giLCJkb20iLCJyZW1BdHRyIiwibXVzdFJlb3JkZXIiLCJnZXRBdHRyIiwiZ2V0VGFnTmFtZSIsImltcGwiLCJvdXRlckhUTUwiLCJ1c2VSb290IiwiY3JlYXRlVGV4dE5vZGUiLCJnZXRUYWciLCJpc09wdGlvbiIsIm9sZEl0ZW1zIiwiaGFzS2V5cyIsImlzVmlydHVhbCIsInJlbW92ZUNoaWxkIiwiZnJhZyIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJpdGVtc0xlbmd0aCIsIl9tdXN0UmVvcmRlciIsIm9sZFBvcyIsIlRhZyIsImlzTG9vcCIsImhhc0ltcGwiLCJjbG9uZU5vZGUiLCJjaGlsZE5vZGVzIiwiX2l0ZW0iLCJzaSIsIm9wIiwic2VsZWN0ZWQiLCJfX3NlbGVjdGVkIiwic3R5bGVNYW5hZ2VyIiwiX3Jpb3QiLCJhZGQiLCJpbmplY3QiLCJzdHlsZU5vZGUiLCJuZXdOb2RlIiwic2V0QXR0ciIsInVzZXJOb2RlIiwiaWQiLCJyZXBsYWNlQ2hpbGQiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImNzc1RleHRQcm9wIiwic3R5bGVTaGVldCIsInN0eWxlc1RvSW5qZWN0IiwiY3NzVGV4dCIsInBhcnNlTmFtZWRFbGVtZW50cyIsImNoaWxkVGFncyIsImZvcmNlUGFyc2luZ05hbWVkIiwid2FsayIsImluaXRDaGlsZFRhZyIsInNldE5hbWVkIiwicGFyc2VFeHByZXNzaW9ucyIsImV4cHJlc3Npb25zIiwiYWRkRXhwciIsImV4dHJhIiwiYXR0ciIsIm5vZGVWYWx1ZSIsImNvbmYiLCJpbmhlcml0IiwiY2xlYW5VcERhdGEiLCJpbXBsQXR0ciIsInByb3BzSW5TeW5jV2l0aFBhcmVudCIsIl90YWciLCJpc01vdW50ZWQiLCJ1cGRhdGVPcHRzIiwidG9DYW1lbCIsIm5vcm1hbGl6ZURhdGEiLCJpc1dyaXRhYmxlIiwiaW5oZXJpdEZyb21QYXJlbnQiLCJtdXN0U3luYyIsImNvbnRhaW5zIiwiaXNJbmhlcml0ZWQiLCJyQUYiLCJtaXgiLCJtaXhpbiIsImdldE93blByb3BlcnR5TmFtZXMiLCJnbG9iYWxNaXhpbiIsInRvZ2dsZSIsIndhbGtBdHRyaWJ1dGVzIiwiaXNJblN0dWIiLCJrZWVwUm9vdFRhZyIsInB0YWciLCJ0YWdJbmRleCIsImdldEltbWVkaWF0ZUN1c3RvbVBhcmVudFRhZyIsIm9uQ2hpbGRVcGRhdGUiLCJpc01vdW50IiwiZXZ0Iiwic2V0RXZlbnRIYW5kbGVyIiwiX3BhcmVudCIsImN1cnJlbnRUYXJnZXQiLCJzcmNFbGVtZW50IiwiY2hhckNvZGUiLCJrZXlDb2RlIiwicmV0dXJuVmFsdWUiLCJwcmV2ZW50VXBkYXRlIiwiaW5zZXJ0VG8iLCJub2RlIiwiYmVmb3JlIiwiYXR0ck5hbWUiLCJyZW1vdmUiLCJpblN0dWIiLCJzdHlsZSIsImRpc3BsYXkiLCJzdGFydHNXaXRoIiwiZWxzIiwicmVtb3ZlQXR0cmlidXRlIiwidG9VcHBlckNhc2UiLCJnZXRBdHRyaWJ1dGUiLCJhZGRDaGlsZFRhZyIsImNhY2hlZFRhZyIsIm5ld1BvcyIsIm5hbWVkVGFnIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiJCQiLCJzZWxlY3RvciIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJxdWVyeVNlbGVjdG9yIiwiQ2hpbGQiLCJnZXROYW1lZEtleSIsImlzQXJyIiwidyIsInJhZiIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1velJlcXVlc3RBbmltYXRpb25GcmFtZSIsIndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsImxhc3RUaW1lIiwibm93dGltZSIsIm5vdyIsIk1hdGgiLCJtYXgiLCJtb3VudFRvIiwiX2lubmVySFRNTCIsInV0aWwiLCJtaXhpbnMiLCJ0YWcyIiwiYWxsVGFncyIsImFkZFJpb3RUYWdzIiwic2VsZWN0QWxsVGFncyIsInB1c2hUYWdzIiwicmlvdFRhZyIsIm5vZGVMaXN0IiwiX2VsIiwiZGVmaW5lIiwiYW1kIiwicGxhY2Vob2xkZXIiLCJmb3JtRWxlbWVudCIsImhpZGVQbGFjZWhvbGRlck9uRm9jdXMiLCJ1bmZvY3VzT25BbkVsZW1lbnQiLCJfcGxhY2Vob2xkZXJlZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhdHRhY2hFdmVudCIsIlBhZ2UiLCJSaW90UGFnZSIsImxvYWQiLCJyZW5kZXIiLCJ1bmxvYWQiLCJNb2R1bGUiLCJtb2R1bGUxIiwiYW5ub3RhdGlvbnMiLCJqc29uIiwiQ29udHJvbHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUFBQSxNQUFBLENBQU9DLE9BQVAsR0FBaUI7QUFBQSxNQUNmQyxPQUFBLEVBQVNDLE9BQUEsQ0FBUSxvQkFBUixDQURNO0FBQUEsTUFFZkMsSUFBQSxFQUFNRCxPQUFBLENBQVEsaUJBQVIsQ0FGUztBQUFBLE1BR2ZFLFFBQUEsRUFBVSxVQUFTQyxDQUFULEVBQVk7QUFBQSxRQUNwQixPQUFPLEtBQUtGLElBQUwsQ0FBVUMsUUFBVixDQUFtQkMsQ0FBbkIsQ0FEYTtBQUFBLE9BSFA7QUFBQSxLOzs7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