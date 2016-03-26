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
    var Control, Text, extend = function (child, parent) {
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
    module.exports = Text = function (superClass) {
      extend(Text, superClass);
      function Text() {
        return Text.__super__.constructor.apply(this, arguments)
      }
      Text.prototype.tag = 'text-control';
      Text.prototype.type = 'text';
      Text.prototype.html = require('./Users/dtai/work/hanzo/daisho-riot/templates/text');
      Text.prototype.formElement = 'input';
      Text.prototype.init = function () {
        Text.__super__.init.apply(this, arguments);
        console.log('text intiialized');
        return this.on('updated', function (_this) {
          return function () {
            var el;
            return el = _this.root.getElementsByTagName(_this.formElement)[0]
          }
        }(this))
      };
      return Text
    }(Control)
  });
  // source: templates/text.html
  require.define('./Users/dtai/work/hanzo/daisho-riot/templates/text', function (module, exports, __dirname, __filename, process) {
    module.exports = '<input id="{ input.name }" name="{ name || input.name }" type="{ type }" class="{ filled: input.ref(input.name) }" onchange="{ change }" onblur="{ change }" value="{ input.ref(input.name) }">\n<label for="{ input.name }">{ placeholder }</label>\n'
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
      RiotPage.prototype.tagEl = 'tag';
      RiotPage.prototype.opts = null;
      RiotPage.prototype.load = function (opts) {
        this.opts = opts != null ? opts : {}
      };
      RiotPage.prototype.render = function () {
        var el;
        el = document.createElement(this.tag);
        this.el.appendChild(el);
        return this.tagEl = riot.mount(this.tag, this.opts)[0]
      };
      RiotPage.prototype.unload = function () {
        return this.tagEl.unmount()
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
      function Page(el, module1, opts1) {
        this.el = el;
        this.module = module1;
        this.opts = opts1
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
  // source: src/forms/index.coffee
  require.define('./forms', function (module, exports, __dirname, __filename, process) {
    module.exports = {
      TableRow: require('./forms/table-row'),
      register: function () {
        return this.TableRow.register()
      }
    }
  });
  // source: src/forms/table-row.coffee
  require.define('./forms/table-row', function (module, exports, __dirname, __filename, process) {
    var CrowdControl, TableRow, extend = function (child, parent) {
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
    module.exports = TableRow = function (superClass) {
      extend(TableRow, superClass);
      function TableRow() {
        return TableRow.__super__.constructor.apply(this, arguments)
      }
      TableRow.prototype.tag = 'table-row';
      TableRow.prototype.configs = null;
      TableRow.prototype.data = null;
      TableRow.prototype.columns = null;
      TableRow.prototype.html = require('./Users/dtai/work/hanzo/daisho-riot/templates/table-row');
      return TableRow
    }(CrowdControl.Views.Form)
  });
  // source: templates/table-row.html
  require.define('./Users/dtai/work/hanzo/daisho-riot/templates/table-row', function (module, exports, __dirname, __filename, process) {
    module.exports = ''
  });
  // source: src/widgets/index.coffee
  require.define('./widgets', function (module, exports, __dirname, __filename, process) {
    module.exports = {
      TableWidget: require('./widgets/table-widget'),
      register: function () {
        return this.TableWidget.register()
      }
    }
  });
  // source: src/widgets/table-widget.coffee
  require.define('./widgets/table-widget', function (module, exports, __dirname, __filename, process) {
    var CrowdControl, TableWidget, extend = function (child, parent) {
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
    module.exports = TableWidget = function (superClass) {
      extend(TableWidget, superClass);
      function TableWidget() {
        return TableWidget.__super__.constructor.apply(this, arguments)
      }
      TableWidget.prototype.tag = 'table-widget';
      TableWidget.prototype.configs = [];
      TableWidget.prototype.columns = [];
      TableWidget.prototype.data = null;
      TableWidget.prototype.html = require('./Users/dtai/work/hanzo/daisho-riot/templates/table-widget');
      return TableWidget
    }(CrowdControl.Views.View)
  });
  // source: templates/table-widget.html
  require.define('./Users/dtai/work/hanzo/daisho-riot/templates/table-widget', function (module, exports, __dirname, __filename, process) {
    module.exports = '<div class="table-head">\n  <div class="table-row table-head">\n    <div each="{ column, i in columns }">{ column.id }</div>\n  </div>\n</div>\n<div class="table-body">\n  <table-row class="table-row" each="{ item, i in data.get(\'items\') }" data="{ data.ref(\'items.\' + i) }" config="{ config }" columns="{ columns }"></table-row>\n</div>\n\n'
  });
  // source: src/index.coffee
  require.define('./index', function (module, exports, __dirname, __filename, process) {
    var Controls;
    Controls = require('./controls');
    module.exports = {
      RiotPage: require('./page'),
      Events: require('./events'),
      Controls: require('./controls'),
      Forms: require('./forms'),
      Widgets: require('./widgets'),
      register: function () {
        this.Controls.register();
        this.Forms.register();
        return this.Widgets.register()
      }
    }
  });
  require('./index')
}.call(this, this))//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyb2xzL2luZGV4LmNvZmZlZSIsImNvbnRyb2xzL2NvbnRyb2wuY29mZmVlIiwibm9kZV9tb2R1bGVzL2Nyb3dkY29udHJvbC9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY3Jvd2Rjb250cm9sL2xpYi9yaW90LmpzIiwibm9kZV9tb2R1bGVzL2Nyb3dkY29udHJvbC9saWIvdmlld3MvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY3Jvd2Rjb250cm9sL2xpYi92aWV3cy9mb3JtLmpzIiwibm9kZV9tb2R1bGVzL2Nyb3dkY29udHJvbC9saWIvdmlld3Mvdmlldy5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2lzLWZ1bmN0aW9uL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Nyb3dkY29udHJvbC9saWIvdmlld3MvaW5wdXRpZnkuanMiLCJub2RlX21vZHVsZXMvYnJva2VuL2xpYi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy96b3VzYW4vem91c2FuLW1pbi5qcyIsIm5vZGVfbW9kdWxlcy9yZWZlcmVudGlhbC9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvcmVmZXJlbnRpYWwvbGliL3JlZmVyLmpzIiwibm9kZV9tb2R1bGVzL3JlZmVyZW50aWFsL2xpYi9yZWYuanMiLCJub2RlX21vZHVsZXMvbm9kZS5leHRlbmQvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbm9kZS5leHRlbmQvbGliL2V4dGVuZC5qcyIsIm5vZGVfbW9kdWxlcy9pcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pcy1hcnJheS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pcy1udW1iZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMva2luZC1vZi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9pcy1idWZmZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaXMtb2JqZWN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2lzLXN0cmluZy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9taXNlLXNldHRsZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9taXNlLXNldHRsZS9saWIvcHJvbWlzZS1zZXR0bGUuanMiLCJub2RlX21vZHVsZXMvY3Jvd2Rjb250cm9sL2xpYi92aWV3cy9pbnB1dC5qcyIsImV2ZW50cy5jb2ZmZWUiLCJub2RlX21vZHVsZXMvcmlvdC9yaW90LmpzIiwiY29udHJvbHMvdGV4dC5jb2ZmZWUiLCJVc2Vycy9kdGFpL3dvcmsvaGFuem8vZGFpc2hvLXJpb3QvdGVtcGxhdGVzL3RleHQuaHRtbCIsInBhZ2UuY29mZmVlIiwibm9kZV9tb2R1bGVzL2RhaXNoby1zZGsvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2RhaXNoby1zZGsvbGliL3BhZ2UuanMiLCJub2RlX21vZHVsZXMvZGFpc2hvLXNkay9saWIvbW9kdWxlLmpzIiwiZm9ybXMvaW5kZXguY29mZmVlIiwiZm9ybXMvdGFibGUtcm93LmNvZmZlZSIsIlVzZXJzL2R0YWkvd29yay9oYW56by9kYWlzaG8tcmlvdC90ZW1wbGF0ZXMvdGFibGUtcm93Lmh0bWwiLCJ3aWRnZXRzL2luZGV4LmNvZmZlZSIsIndpZGdldHMvdGFibGUtd2lkZ2V0LmNvZmZlZSIsIlVzZXJzL2R0YWkvd29yay9oYW56by9kYWlzaG8tcmlvdC90ZW1wbGF0ZXMvdGFibGUtd2lkZ2V0Lmh0bWwiLCJpbmRleC5jb2ZmZWUiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsIkNvbnRyb2wiLCJyZXF1aXJlIiwiVGV4dCIsInJlZ2lzdGVyIiwibSIsIkNyb3dkQ29udHJvbCIsIkV2ZW50cyIsInJpb3QiLCJzY3JvbGxpbmciLCJleHRlbmQiLCJjaGlsZCIsInBhcmVudCIsImtleSIsImhhc1Byb3AiLCJjYWxsIiwiY3RvciIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwiX19zdXBlcl9fIiwiaGFzT3duUHJvcGVydHkiLCJzdXBlckNsYXNzIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJpbml0IiwiaW5wdXQiLCJpbnB1dHMiLCJsb29rdXAiLCJnZXRWYWx1ZSIsImV2ZW50IiwicmVmIiwiJCIsInRhcmdldCIsInZhbCIsInRyaW0iLCJlcnJvciIsImVyciIsIkRPTUV4Y2VwdGlvbiIsImNvbnNvbGUiLCJsb2ciLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwicm9vdCIsIm9mZnNldCIsInRvcCIsIndpbmRvdyIsImhlaWdodCIsImNvbXBsZXRlIiwiZHVyYXRpb24iLCJ0cmlnZ2VyIiwiQ2hhbmdlRmFpbGVkIiwibmFtZSIsImdldCIsImNoYW5nZSIsIkNoYW5nZSIsImNoYW5nZWQiLCJ2YWx1ZSIsIkNoYW5nZVN1Y2Nlc3MiLCJ1cGRhdGUiLCJ2IiwiVmlld3MiLCJJbnB1dCIsInIiLCJ0YWdzIiwic3RhcnQiLCJvcHRzIiwibW91bnQiLCJpIiwibGVuIiwicmVzdWx0cyIsInRhZyIsImxlbmd0aCIsInB1c2giLCJDcm93ZHN0YXJ0IiwiQ3Jvd2Rjb250cm9sIiwic2V0IiwiRm9ybSIsIlZpZXciLCJQcm9taXNlIiwiaW5wdXRpZnkiLCJvYnNlcnZhYmxlIiwic2V0dGxlIiwiY29uZmlncyIsImRhdGEiLCJpbml0SW5wdXRzIiwicmVzdWx0czEiLCJzdWJtaXQiLCJwUmVmIiwicHMiLCJwIiwidGhlbiIsIl90aGlzIiwicmVzdWx0IiwiaXNGdWxmaWxsZWQiLCJfc3VibWl0IiwiY29sbGFwc2VQcm90b3R5cGUiLCJpc0Z1bmN0aW9uIiwib2JqZWN0QXNzaWduIiwic2V0UHJvdG90eXBlT2YiLCJtaXhpblByb3BlcnRpZXMiLCJzZXRQcm90b09mIiwib2JqIiwicHJvdG8iLCJfX3Byb3RvX18iLCJwcm9wIiwiT2JqZWN0IiwiQXJyYXkiLCJjb2xsYXBzZSIsInBhcmVudFByb3RvIiwiZ2V0UHJvdG90eXBlT2YiLCJodG1sIiwiY3NzIiwiYXR0cnMiLCJldmVudHMiLCJuZXdQcm90byIsImJlZm9yZUluaXQiLCJmbiIsImhhbmRsZXIiLCJrIiwic2VsZiIsIm9sZEZuIiwib24iLCJwcm9wSXNFbnVtZXJhYmxlIiwicHJvcGVydHlJc0VudW1lcmFibGUiLCJ0b09iamVjdCIsInVuZGVmaW5lZCIsIlR5cGVFcnJvciIsImFzc2lnbiIsInNvdXJjZSIsImZyb20iLCJ0byIsInN5bWJvbHMiLCJzIiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwidG9TdHJpbmciLCJzdHJpbmciLCJzZXRUaW1lb3V0IiwiYWxlcnQiLCJjb25maXJtIiwicHJvbXB0IiwiaXNSZWYiLCJyZWZlciIsIm8iLCJjb25maWciLCJmbjEiLCJtaWRkbGV3YXJlIiwibWlkZGxld2FyZUZuIiwidmFsaWRhdGUiLCJwYWlyIiwicmVzb2x2ZSIsImoiLCJsZW4xIiwiUHJvbWlzZUluc3BlY3Rpb24iLCJzdXBwcmVzc1VuY2F1Z2h0UmVqZWN0aW9uRXJyb3IiLCJhcmciLCJzdGF0ZSIsInJlYXNvbiIsImlzUmVqZWN0ZWQiLCJyZWZsZWN0IiwicHJvbWlzZSIsInJlamVjdCIsInByb21pc2VzIiwiYWxsIiwibWFwIiwiY2FsbGJhY2siLCJjYiIsInQiLCJlIiwibiIsInkiLCJjIiwidSIsImYiLCJzcGxpY2UiLCJNdXRhdGlvbk9ic2VydmVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwib2JzZXJ2ZSIsImF0dHJpYnV0ZXMiLCJzZXRBdHRyaWJ1dGUiLCJzZXRJbW1lZGlhdGUiLCJzdGFjayIsImwiLCJhIiwidGltZW91dCIsIkVycm9yIiwiWm91c2FuIiwic29vbiIsImdsb2JhbCIsIlJlZiIsIm1ldGhvZCIsInJlZjEiLCJ3cmFwcGVyIiwiY2xvbmUiLCJpc0FycmF5IiwiaXNOdW1iZXIiLCJpc09iamVjdCIsImlzU3RyaW5nIiwiX3ZhbHVlIiwia2V5MSIsIl9jYWNoZSIsIl9tdXRhdGUiLCJpbmRleCIsInByZXYiLCJuZXh0IiwicHJvcHMiLCJTdHJpbmciLCJzcGxpdCIsInNoaWZ0IiwiaXMiLCJkZWVwIiwib3B0aW9ucyIsInNyYyIsImNvcHkiLCJjb3B5X2lzX2FycmF5IiwiaGFzaCIsImFycmF5IiwidmVyc2lvbiIsIm9ialByb3RvIiwib3ducyIsInRvU3RyIiwic3ltYm9sVmFsdWVPZiIsIlN5bWJvbCIsInZhbHVlT2YiLCJpc0FjdHVhbE5hTiIsIk5PTl9IT1NUX1RZUEVTIiwibnVtYmVyIiwiYmFzZTY0UmVnZXgiLCJoZXhSZWdleCIsInR5cGUiLCJkZWZpbmVkIiwiZW1wdHkiLCJlcXVhbCIsIm90aGVyIiwiZ2V0VGltZSIsImhvc3RlZCIsImhvc3QiLCJpbnN0YW5jZSIsIm5pbCIsInVuZGVmIiwiYXJncyIsImlzU3RhbmRhcmRBcmd1bWVudHMiLCJpc09sZEFyZ3VtZW50cyIsImFycmF5bGlrZSIsIm9iamVjdCIsImNhbGxlZSIsImJvb2wiLCJpc0Zpbml0ZSIsIkJvb2xlYW4iLCJOdW1iZXIiLCJkYXRlIiwiZWxlbWVudCIsIkhUTUxFbGVtZW50Iiwibm9kZVR5cGUiLCJpc0FsZXJ0IiwiaW5maW5pdGUiLCJJbmZpbml0eSIsImRlY2ltYWwiLCJkaXZpc2libGVCeSIsImlzRGl2aWRlbmRJbmZpbml0ZSIsImlzRGl2aXNvckluZmluaXRlIiwiaXNOb25aZXJvTnVtYmVyIiwiaW50ZWdlciIsIm1heGltdW0iLCJvdGhlcnMiLCJtaW5pbXVtIiwibmFuIiwiZXZlbiIsIm9kZCIsImdlIiwiZ3QiLCJsZSIsImx0Iiwid2l0aGluIiwiZmluaXNoIiwiaXNBbnlJbmZpbml0ZSIsInNldEludGVydmFsIiwicmVnZXhwIiwiYmFzZTY0IiwidGVzdCIsImhleCIsInN5bWJvbCIsInN0ciIsInR5cGVPZiIsIm51bSIsImlzQnVmZmVyIiwia2luZE9mIiwiRnVuY3Rpb24iLCJSZWdFeHAiLCJEYXRlIiwiQnVmZmVyIiwiX2lzQnVmZmVyIiwieCIsInN0clZhbHVlIiwidHJ5U3RyaW5nT2JqZWN0Iiwic3RyQ2xhc3MiLCJoYXNUb1N0cmluZ1RhZyIsInRvU3RyaW5nVGFnIiwicHJvbWlzZVJlc3VsdHMiLCJwcm9taXNlUmVzdWx0IiwiY2F0Y2giLCJyZXR1cm5zIiwiYmluZCIsInRocm93cyIsImVycm9yTWVzc2FnZSIsImVycm9ySHRtbCIsImNsZWFyRXJyb3IiLCJtZXNzYWdlIiwic2V0dGluZ3MiLCJfX3VpZCIsIl9fdmlydHVhbERvbSIsIl9fdGFnSW1wbCIsIkdMT0JBTF9NSVhJTiIsIlJJT1RfUFJFRklYIiwiUklPVF9UQUciLCJSSU9UX1RBR19JUyIsIlRfU1RSSU5HIiwiVF9PQkpFQ1QiLCJUX1VOREVGIiwiVF9CT09MIiwiVF9GVU5DVElPTiIsIlNQRUNJQUxfVEFHU19SRUdFWCIsIlJFU0VSVkVEX1dPUkRTX0JMQUNLTElTVCIsIklFX1ZFUlNJT04iLCJkb2N1bWVudE1vZGUiLCJlbCIsImNhbGxiYWNrcyIsInNsaWNlIiwib25FYWNoRXZlbnQiLCJyZXBsYWNlIiwiZGVmaW5lUHJvcGVydGllcyIsInBvcyIsInR5cGVkIiwiZW51bWVyYWJsZSIsIndyaXRhYmxlIiwiY29uZmlndXJhYmxlIiwib2ZmIiwiYXJyIiwib25lIiwiYXJnbGVuIiwiZm5zIiwiYnVzeSIsImNvbmNhdCIsIlJFX09SSUdJTiIsIkVWRU5UX0xJU1RFTkVSIiwiUkVNT1ZFX0VWRU5UX0xJU1RFTkVSIiwiQUREX0VWRU5UX0xJU1RFTkVSIiwiSEFTX0FUVFJJQlVURSIsIlJFUExBQ0UiLCJQT1BTVEFURSIsIkhBU0hDSEFOR0UiLCJUUklHR0VSIiwiTUFYX0VNSVRfU1RBQ0tfTEVWRUwiLCJ3aW4iLCJkb2MiLCJoaXN0IiwiaGlzdG9yeSIsImxvYyIsImxvY2F0aW9uIiwicHJvdCIsIlJvdXRlciIsImNsaWNrRXZlbnQiLCJvbnRvdWNoc3RhcnQiLCJzdGFydGVkIiwiY2VudHJhbCIsInJvdXRlRm91bmQiLCJkZWJvdW5jZWRFbWl0IiwiYmFzZSIsImN1cnJlbnQiLCJwYXJzZXIiLCJzZWNvbmRQYXJzZXIiLCJlbWl0U3RhY2siLCJlbWl0U3RhY2tMZXZlbCIsIkRFRkFVTFRfUEFSU0VSIiwicGF0aCIsIkRFRkFVTFRfU0VDT05EX1BBUlNFUiIsImZpbHRlciIsInJlIiwibWF0Y2giLCJkZWJvdW5jZSIsImRlbGF5IiwiY2xlYXJUaW1lb3V0IiwiYXV0b0V4ZWMiLCJlbWl0IiwiY2xpY2siLCJub3JtYWxpemUiLCJnZXRQYXRoRnJvbVJvb3QiLCJocmVmIiwiZ2V0UGF0aEZyb21CYXNlIiwiZm9yY2UiLCJpc1Jvb3QiLCJ3aGljaCIsIm1ldGFLZXkiLCJjdHJsS2V5Iiwic2hpZnRLZXkiLCJkZWZhdWx0UHJldmVudGVkIiwibm9kZU5hbWUiLCJwYXJlbnROb2RlIiwiaW5kZXhPZiIsImdvIiwidGl0bGUiLCJwcmV2ZW50RGVmYXVsdCIsInNob3VsZFJlcGxhY2UiLCJyZXBsYWNlU3RhdGUiLCJwdXNoU3RhdGUiLCJmaXJzdCIsInNlY29uZCIsInRoaXJkIiwic29tZSIsImFjdGlvbiIsIm1haW5Sb3V0ZXIiLCJyb3V0ZSIsImNyZWF0ZSIsIm5ld1N1YlJvdXRlciIsInN0b3AiLCJleGVjIiwiZm4yIiwicXVlcnkiLCJxIiwiXyIsInJlYWR5U3RhdGUiLCJicmFja2V0cyIsIlVOREVGIiwiUkVHTE9CIiwiUl9NTENPTU1TIiwiUl9TVFJJTkdTIiwiU19RQkxPQ0tTIiwiRklOREJSQUNFUyIsIkRFRkFVTFQiLCJfcGFpcnMiLCJjYWNoZWRCcmFja2V0cyIsIl9yZWdleCIsIl9zZXR0aW5ncyIsIl9sb29wYmFjayIsIl9yZXdyaXRlIiwiYnAiLCJfY3JlYXRlIiwiX2JyYWNrZXRzIiwicmVPcklkeCIsInRtcGwiLCJfYnAiLCJwYXJ0cyIsImlzZXhwciIsImxhc3RJbmRleCIsInNraXBCcmFjZXMiLCJ1bmVzY2FwZVN0ciIsImNoIiwiaXgiLCJyZWNjaCIsImhhc0V4cHIiLCJsb29wS2V5cyIsImV4cHIiLCJoYXNSYXciLCJfcmVzZXQiLCJfc2V0U2V0dGluZ3MiLCJiIiwiZGVmaW5lUHJvcGVydHkiLCJfdG1wbCIsIl9sb2dFcnIiLCJoYXZlUmF3IiwiZXJyb3JIYW5kbGVyIiwiY3R4IiwicmlvdERhdGEiLCJ0YWdOYW1lIiwiX3Jpb3RfaWQiLCJfZ2V0VG1wbCIsIlJFX1FCTE9DSyIsIlJFX1FCTUFSSyIsInFzdHIiLCJsaXN0IiwiX3BhcnNlRXhwciIsImpvaW4iLCJSRV9CUkVORCIsIkNTX0lERU5UIiwiYXNUZXh0IiwiZGl2IiwiY250IiwianNiIiwicmlnaHRDb250ZXh0IiwiX3dyYXBFeHByIiwibW0iLCJsdiIsImlyIiwiSlNfQ09OVEVYVCIsIkpTX1ZBUk5BTUUiLCJKU19OT1BST1BTIiwidGIiLCJtdmFyIiwicGFyc2UiLCJta2RvbSIsIl9ta2RvbSIsInJlSGFzWWllbGQiLCJyZVlpZWxkQWxsIiwicmVZaWVsZFNyYyIsInJlWWllbGREZXN0Iiwicm9vdEVscyIsInRyIiwidGgiLCJ0ZCIsImNvbCIsInRibFRhZ3MiLCJ0ZW1wbCIsInRvTG93ZXJDYXNlIiwibWtFbCIsInJlcGxhY2VZaWVsZCIsInNwZWNpYWxUYWdzIiwiaW5uZXJIVE1MIiwic3R1YiIsInNlbGVjdCIsImZpcnN0Q2hpbGQiLCJzZWxlY3RlZEluZGV4IiwidG5hbWUiLCJjaGlsZEVsZW1lbnRDb3VudCIsInRleHQiLCJkZWYiLCJta2l0ZW0iLCJpdGVtIiwidW5tb3VudFJlZHVuZGFudCIsIml0ZW1zIiwidW5tb3VudCIsIm1vdmVOZXN0ZWRUYWdzIiwia2V5cyIsImZvckVhY2giLCJlYWNoIiwibW92ZUNoaWxkVGFnIiwiYWRkVmlydHVhbCIsIl9yb290Iiwic2liIiwiX3ZpcnRzIiwibmV4dFNpYmxpbmciLCJpbnNlcnRCZWZvcmUiLCJhcHBlbmRDaGlsZCIsIm1vdmVWaXJ0dWFsIiwiX2VhY2giLCJkb20iLCJyZW1BdHRyIiwibXVzdFJlb3JkZXIiLCJnZXRBdHRyIiwiZ2V0VGFnTmFtZSIsImltcGwiLCJvdXRlckhUTUwiLCJ1c2VSb290IiwiY3JlYXRlVGV4dE5vZGUiLCJnZXRUYWciLCJpc09wdGlvbiIsIm9sZEl0ZW1zIiwiaGFzS2V5cyIsImlzVmlydHVhbCIsInJlbW92ZUNoaWxkIiwiZnJhZyIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJpdGVtc0xlbmd0aCIsIl9tdXN0UmVvcmRlciIsIm9sZFBvcyIsIlRhZyIsImlzTG9vcCIsImhhc0ltcGwiLCJjbG9uZU5vZGUiLCJjaGlsZE5vZGVzIiwiX2l0ZW0iLCJzaSIsIm9wIiwic2VsZWN0ZWQiLCJfX3NlbGVjdGVkIiwic3R5bGVNYW5hZ2VyIiwiX3Jpb3QiLCJhZGQiLCJpbmplY3QiLCJzdHlsZU5vZGUiLCJuZXdOb2RlIiwic2V0QXR0ciIsInVzZXJOb2RlIiwiaWQiLCJyZXBsYWNlQ2hpbGQiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImNzc1RleHRQcm9wIiwic3R5bGVTaGVldCIsInN0eWxlc1RvSW5qZWN0IiwiY3NzVGV4dCIsInBhcnNlTmFtZWRFbGVtZW50cyIsImNoaWxkVGFncyIsImZvcmNlUGFyc2luZ05hbWVkIiwid2FsayIsImluaXRDaGlsZFRhZyIsInNldE5hbWVkIiwicGFyc2VFeHByZXNzaW9ucyIsImV4cHJlc3Npb25zIiwiYWRkRXhwciIsImV4dHJhIiwiYXR0ciIsIm5vZGVWYWx1ZSIsImNvbmYiLCJpbmhlcml0IiwiY2xlYW5VcERhdGEiLCJpbXBsQXR0ciIsInByb3BzSW5TeW5jV2l0aFBhcmVudCIsIl90YWciLCJpc01vdW50ZWQiLCJ1cGRhdGVPcHRzIiwidG9DYW1lbCIsIm5vcm1hbGl6ZURhdGEiLCJpc1dyaXRhYmxlIiwiaW5oZXJpdEZyb21QYXJlbnQiLCJtdXN0U3luYyIsImNvbnRhaW5zIiwiaXNJbmhlcml0ZWQiLCJyQUYiLCJtaXgiLCJtaXhpbiIsImdldE93blByb3BlcnR5TmFtZXMiLCJnbG9iYWxNaXhpbiIsInRvZ2dsZSIsIndhbGtBdHRyaWJ1dGVzIiwiaXNJblN0dWIiLCJrZWVwUm9vdFRhZyIsInB0YWciLCJ0YWdJbmRleCIsImdldEltbWVkaWF0ZUN1c3RvbVBhcmVudFRhZyIsIm9uQ2hpbGRVcGRhdGUiLCJpc01vdW50IiwiZXZ0Iiwic2V0RXZlbnRIYW5kbGVyIiwiX3BhcmVudCIsImN1cnJlbnRUYXJnZXQiLCJzcmNFbGVtZW50IiwiY2hhckNvZGUiLCJrZXlDb2RlIiwicmV0dXJuVmFsdWUiLCJwcmV2ZW50VXBkYXRlIiwiaW5zZXJ0VG8iLCJub2RlIiwiYmVmb3JlIiwiYXR0ck5hbWUiLCJyZW1vdmUiLCJpblN0dWIiLCJzdHlsZSIsImRpc3BsYXkiLCJzdGFydHNXaXRoIiwiZWxzIiwicmVtb3ZlQXR0cmlidXRlIiwidG9VcHBlckNhc2UiLCJnZXRBdHRyaWJ1dGUiLCJhZGRDaGlsZFRhZyIsImNhY2hlZFRhZyIsIm5ld1BvcyIsIm5hbWVkVGFnIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiJCQiLCJzZWxlY3RvciIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJxdWVyeVNlbGVjdG9yIiwiQ2hpbGQiLCJnZXROYW1lZEtleSIsImlzQXJyIiwidyIsInJhZiIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1velJlcXVlc3RBbmltYXRpb25GcmFtZSIsIndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsImxhc3RUaW1lIiwibm93dGltZSIsIm5vdyIsIk1hdGgiLCJtYXgiLCJtb3VudFRvIiwiX2lubmVySFRNTCIsInV0aWwiLCJtaXhpbnMiLCJ0YWcyIiwiYWxsVGFncyIsImFkZFJpb3RUYWdzIiwic2VsZWN0QWxsVGFncyIsInB1c2hUYWdzIiwicmlvdFRhZyIsIm5vZGVMaXN0IiwiX2VsIiwiZGVmaW5lIiwiYW1kIiwiZm9ybUVsZW1lbnQiLCJQYWdlIiwiUmlvdFBhZ2UiLCJ0YWdFbCIsImxvYWQiLCJyZW5kZXIiLCJ1bmxvYWQiLCJNb2R1bGUiLCJtb2R1bGUxIiwib3B0czEiLCJhbm5vdGF0aW9ucyIsImpzb24iLCJUYWJsZVJvdyIsImNvbHVtbnMiLCJUYWJsZVdpZGdldCIsIkNvbnRyb2xzIiwiRm9ybXMiLCJXaWRnZXRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBQUEsTUFBQSxDQUFPQyxPQUFQLEdBQWlCO0FBQUEsTUFD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