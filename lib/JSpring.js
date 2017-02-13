/**
  * JSpring.js v1.0.3
  * (c) 2016 Arnold.Zhang
  */
;(function (global, doc, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      global.JSpring = factory(global, doc);
}(this || window, document, function (global, doc) {
  "use strict"
  var 
        OBJ = {},
        ARRAY = [],
        STRING = '',

        doc = doc || document,
        global = global || window,
        body = doc.body,
        previousJSpring = global.JSpring,
        _ = require('./JSpring._.js'),
        $ = require('./JSpring.$.js')(_),
        REGEXP = $.REGEXP,
        WARN = $.WARN,
        UNIQ = 'lv-',
        UNIQ_LEN = UNIQ.length,
        VERSION = '1.0.3',

        spaceREG = /\s+/g,
        semiREG = /\s*;\s*/,
        colonREG = /\s*\:\s*/,
        filterREG = /\s*\|\s*/,
        restoreRE = /"(\d+)"/g,
        arrowREG = /\s*\->\s*/,
        forChildREG = /(@[^@\.'"\]]+)/,
        complexInnerForParentREG = /@[^\.]+\.[^\.]+/,
        complexForParentREG = /[\.\[\]]/,
        complexForReplaceREG = /([^\[\]'"]+)(?=\[|\.|\])/g,
        
        prefixREG = new RegExp(UNIQ + '(\\w+)'),
        toBoolREG = /([^\[]+\[\s*)([^\[\s!\]]+)(\s*\])/g,

        //pic.xx == 'dd'
        ifParamREG = /^\s*([\w\$\.@\(\)\+\-\s\!\+%'"\u4E00-\u9FA5\[\]<>]+)\s*[\!\=\*<>\|&-]*\s*[!@<>'"\w\u4E00-\u9FA5+-=\d_\.\[\]]*\s*$/,

        //'aa' / 'param.dd'
        normParamREG = /^\s*([\w\$\:\.\*@\(\)\+%\-\s\!\+'"\u4E00-\u9FA5_（）：<>\/\[\]\|¥×]+)\s*((?:\s*\|\s*\w+|)*)\s*$/,
        evtParamREG = /^\s*(\w+)\s*\:\s*([^\(\)!'"\u4E00-\u9FA5\+\-]+\(.*\))\s*$/,
        evtParamObjREG = /^\s*\{(\s*['"]*([\w\$\+\-\s]+)['"]*\s*\:\s*([^\:]+),?)+\}$/,
        filterPipeREG = /([^\|]\|[^\|]+)/,
        
        //{'aa' : isFlag, 'bb' : !isFlag}
        objParamREG = /^\{(\s*['"]([\w\$\+\-\s\u4E00-\u9FA5<>\/\\\='"_]+)['"]\s*\:\s*([^,]+),?)+\}$/,
        forREG = /^(@[\w\$]+)\b\s+in\b\s+([\[\]\s\w\$@\.]+)((?:\s*\|\s*[^\s\:]+\s*\:\s*['"]*[^'"]+['"]*|)*)\s*$/,

        //{true : 'aa', false : 'bb'}[isFlag]
        objValParamREG = /^\{(\s*(?:true|false)\s*\:\s*['"]*\s*([\w\$\:\-<>\/;\(\)\u4E00-\u9FA5\+@\.\+\s'"_]+)\s*['"]*\s*,?\s*)+\}\s*\[\s*([_\w\.\$@\(\)\|\=\s%]+)\s*\]$/,

        $defineProps = Object.defineProperties,
        $defineProp = Object.defineProperty,
        $substring = STRING.substring,
        $substr = STRING.substr,
        $oCreate = Object.create,
        $split = STRING.split,
        $unshift = ARRAY.unshift,
        $shift = ARRAY.shift,
        $filter = ARRAY.filter,
        $push = ARRAY.push,
        $slice = ARRAY.slice,
        $keys = Object.keys,
        $join = ARRAY.join,
        $pop = ARRAY.pop;


  /**
    * JSpring main
    */
  function isMatchedAttr (attr) {
    return attr && !(attr.nodeName || '').indexOf(UNIQ);
  };

  function makeGetterFn (body) {
    return new Function('$scope', 'return ' + body + ';');
  };

  //2016.8.27 add array protoType methods, use for update trigger
  function defineArrayProto () {
    var arrProto = Array.prototype;
    $.each(['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'], function arrayProtoEach (method) {
      var protoMethod = arrProto[method];
      $defineProp(arrProto, '$' + method, {
        enumerable: false,
        configurable: true,
        value: function() {
          var result = protoMethod.apply(this, arguments);
          updateWatcher.call(this._vm_, this._ob_, this);
          return result;
        }
      });
    });

    $defineProp(arrProto, '$set', {
      enumerable: false,
      configurable: true,
      value: function(index, value) {
        var len = this.length;

        if (index > len) {
          this.length = +index + 1;
        }
        return this.$splice(index, 1, value)[0];
      }
    });

    $defineProp(arrProto, '$remove', {
      enumerable: false,
      configurable: true,
      value: function(index) {
        var len = this.length;

        if (!len) return;
        index = +index;

        if ($.isNaN(index)) return;

        if (index < len) {
          return this.$splice(index, 1);
        }
      }
    });
  };

  // function define$bind () {
  //   $defineProp(Function.prototype, '$bind', {
  //     enumerable: false,
  //     configurable: true,
  //     value: function() {
  //       var _this = this,
  //             args = arguments;
        
  //       if (!$.isObject(args[0])) {
  //         return $.warn(WARN.beObj);
  //       }

  //       return function () {
  //         _this.apply(this, arguments);
  //       }.bind(args[0] || global);
  //     }
  //   });
  // };

  function firstLizeFor (attrs) {
    var attrArr = [],
          wIf = UNIQ + 'if',
          wFor = UNIQ + 'for';
    $.each($keys(attrs), function (i) {
      var attr = attrs[i], name;
      
      if ($.isVoid0(attr)) {
        return;
      }
      
      name = attr.name;

      if (isMatchedAttr(attr)) {

        if (name != wFor && name != wIf) {
          $push.call(attrArr, attr);
        } else {
          $unshift.call(attrArr, attr);
        }

      }
      
    });

    if (attrArr[0] == wIf && attrArr[1] == wFor) {
      attrArr[0] = wFor;
      attrArr[1] = wIf;
    }

    return attrArr;
  };

  function getDeepObjKey (arr, scope) {
    return arr.reduce(function (a, b) {
      return a[b];
    }, scope);
  };

  function defineProp (target, keyset) {
    var _source = {};
    if ($.isArray(keyset)) {
      $.each(keyset, function (v, i) {
        _source[v] = {
          enumerable : false,
          configurable : true,
          set : function proxySet (value) {
            if (!proxyEqual(value, target.$_scope[v])) {
              target.$_scope[v] = value;
            }
          },
          get : function proxyGet () {
            return target.$_scope[v];
          }
        };
      });
      $defineProps(target.$scope, _source);
    } else {
      $.warn(WARN.keyset);
    }
  };

  function defineMultiProp (target, keyset) {
    var _source = {};
    if ($.isArray(keyset)) {
      $.each(keyset, function defineMultiPropEach (v, i) {
        var pre = $slice.call(v, 0, -1),
              suf = v[v.length - 1],
              objKey = getDeepObjKey(pre, target.$scope);

        $defineProp(objKey, suf, {
          enumerable : false,
          configurable : true,
          set : function proxyMultiSet (value) {
            objKey = getDeepObjKey(pre, target.$_scope);
            if (value != objKey[suf]) {
              objKey[suf] = value;
            }
          },
          get : function proxyMultiGet () {
            return getDeepObjKey(pre, target.$_scope)[suf];
          }
        });
      });
    } else {
      $.warn(WARN.keyset);
    }
  };

  function defineReact (target, keyset) {
    var _source = {},
          cach = target.cach,
          keyWatcher = cach.get('keyWatcher');

    if ($.isArray(keyset)) {
      $.each(keyset, function defineReactEach (v, i) {
        _source[v] = {
          enumerable : false,
          configurable : true,
          set : function reactSet (value) {
            target.data[v] = value;

            //2016.8.27 add "_ob_" and "_vm_", is useful in update trigger
            if ($.isArray(value)) {
              target.data[v]._ob_ = v;
              target.data[v]._vm_ = target;  
            }
            updateWatcher.call(target, v, value);
          },
          get : function reactGet () {
            if (canAddKeyWatcher(target, v)) {
              $.uniqPush((keyWatcher[v] || (keyWatcher[v] = [])), target.nowWatcher);
              //2016.7.30 REMOVE clear nowWatcher
              // target.nowWatcher = '';
            }
            return target.data[v];
          }
        };
      });
      $defineProps(target.$_scope, _source);
    }
  };

  function defineMultiReact (target, keyset) {
    var _source = {},
          cach = target.cach,
          keyWatcher = cach.get('keyWatcher');
          
    if ($.isArray(keyset)) {
      $.each(keyset, function defineMultiReactEach (v, i) {
        var pre = $slice.call(v, 0, -1),
              suf = v[v.length - 1],
              objKey = getDeepObjKey(pre, target.$_scope);

        v = $join.call(v, '.');
        $defineProp(objKey, suf, {
          enumerable : false,
          configurable : true,
          set : function reactMultiSet (value) {
            objKey = getDeepObjKey(pre, target.data);
            objKey[suf] = value;

            //2016.8.27 add "_ob_" and "_vm_", is useful in update trigger
            if ($.isArray(value)) {
              objKey[suf]._ob_ = v;
              objKey[suf]._vm_ = target;  
            }
            updateWatcher.call(target, v, value);
          },
          get : function reactMultiGet () {
            if (canAddKeyWatcher(target, v)) {
              $.uniqPush((keyWatcher[v] || (keyWatcher[v] = [])), target.nowWatcher);
              //2016.7.30 REMOVE clear nowWatcher
              // target.nowWatcher = '';
            }
            return getDeepObjKey(pre, target.data)[suf];
          }
        });
      });
    }
  };

  function proxyEqual (v1, v2) {
    if (!$.isReferType(v1)) {
      return v1 === v2;
    }
    return $.eq(v2, v1, true);
  };

  function getIndex (node, endNode) {
    endNode = endNode || body;
    var parent = node,
          index;

    if (!$.isNode(parent)) {
      return '';
    }

    while (parent) {
      index = $.attr(parent, UNIQ + 'index');
      if (!$.isNull(index) && index >= 0) {
        return index;
      }
      parent = $.parent(parent);
      if (parent == endNode) 
        return '';
    }
    return '';
  };

  function getForId (node) {
    var parent = node, forid;
    while (parent) {
      if (forid = $.attr(parent, UNIQ + 'forid')) {
        return forid;
      }
      parent = $.parent(parent);
    }
    return false;
  };

  function getForFnBody (forParent) {
    //a
    //aa.a
    //aaa.aa.a
    //aaa['aa'].a
    //a['b']
    //a[@aa]
    //@aa.bb
    //aa.a['b']
    //aaa.aa.a[@aaa]
    //aa.a[@aa['b']]
    //aa.a[@aa.b]
    //aa.a[@aa['a'].b]
    if (!REGEXP.test(complexForParentREG, forParent)) {
      return '$scope["' + forParent + '"]';
    } else {
      return REGEXP.replace(forParent, complexForReplaceREG, function (match, $1) {
        if (!$1) return '';
        var _i = $.indexOf($1, '.');
        if (!_i) {
          return $1;
        } else if (_i > 0) {
          return '$scope["' + $substring.call($1, 0, _i) + '"]' + $substr.call($1, _i);
        } else {
          return '$scope["' + $1 + '"]';
        }
      });
    }
  };

  function isDeepParam (fnBody) {
    return $split.call(fnBody, '.').length > 2;
  };

  function canAddKeyWatcher (target, reactKey) {
    var _watcher = target.nowWatcher,
          _props = _watcher.props;

    return _watcher && $.inString(_props.expression, reactKey) 
      && REGEXP.test(new RegExp('\\b' + reactKey + '\\b'), _props.expression)
      && (!target.initial || _props.type != 'for'  || _props.filter.length 
        && !_props.forChild);
  };

  function updateWatcher (key, value) {
    var _this = this;
    _this.updateQueue[key] = value;

    if (_this.onDigesting) {
      return;
    }
    _this.onDigesting = true;
    return setTimeout(function () {
      $.each(_this.updateQueue, function (v, k) {
        _updateWatcher.call(_this, k, v);
      });
      _this.updateQueue = {};
      _this.onDigesting = false;
      _this.nextTick();
    });
  };

  function _updateWatcher (key, value) {
    key = key.trim();
    var _this = this,
          keyWatcher = _this.cach.get('keyWatcher'),
          watchers, keyTpl,
          i, l,
          normWatcher = [],
          forWatcher = [],
          forWatcherObj = {},
          forWatcherObjKey;

    _this.updateVersion();
    refreshKeyWatcher(_this, key);
    if (watchers = keyWatcher[key]) {
      $.each(watchers, function watcherEach (w) {
        var _type = w.props.type;
        _type != 'for' ? $.push(normWatcher, w) : $.push(forWatcher, w);
      });

      if (normWatcher.length) {
        $.each(normWatcher, function normWatcherEach (w, i) {
          w.update(i);
        });
      } 

      if (forWatcher.length) {
        forWatcherObj = {};
        keyTpl = _this.cach.get('keyForTpl')[key];
        forWatcher.filter(function (w) {
          var _child = w.props.child;
          if (forWatcherObj[_child]) {
            $.push(forWatcherObj[_child], w);
          } else {
            forWatcherObj[_child] = [w];
          }
        });

        if ((forWatcherObjKey = $keys(forWatcherObj)).length) {
          $.each(forWatcherObjKey, function forWatcherEach (k) {
            var _forWatcher = forWatcherObj[k],
                  _nowKeyTpl;

            $.each(_forWatcher, function updateWatcherEach (w, i) {
              w.update(i);
            });
            
            if ($.isArray(value) && (l = value.length) > (i = _forWatcher.length)) {
              _nowKeyTpl = keyTpl.filter(function (_k) {
                return $.attr(_k[0], UNIQ + 'for').indexOf(k) > -1;
              })[0];
              _this.updateNode($.clone(_nowKeyTpl[0]), _nowKeyTpl[1]);
            }
          });
        } else {
          if ($.isArray(value) && (l = value.length) > (i = watchers.length)) {
            keyTpl.forEach(function (k) {
              _this.updateNode($.clone(k[0]), k[1]);
            });
          }
        }
      } else {
        //2016.8.7 fix for update error
        keyTpl = _this.cach.get('keyForTpl')[key];
        keyTpl && keyTpl.forEach(function (k) {
          _this.updateNode($.clone(k[0]), k[1]);
        });
      }

      if (_this.appendQueue.length) {
        var ap = $shift.call(_this.appendQueue);
        while(ap) {
          if ($.isArray(ap)) {
            $.before(ap[1], ap[0]);
          } else {
            _this.viewport.appendChild(ap);
          }
          ap = $shift.call(_this.appendQueue);
        }
      }
      _this.clearGcQueue();
    }
  };

  function attachWatcher (vm, node, attr, expression) {
    var props = $oCreate(null);
    props.expression = expression;
    props.type = attr;
    JSpring.diyWatchers[attr](vm, node, attr, expression, props);
    return new Watcher(vm, node, props);
  };

  function addNewAppendVar (variable) {
    return $.uniqPush(this.newAppendVar, variable);
  };

  function withinIf (node) {

    while (node = node.parentNode) {
      
      if ($.attr(node, UNIQ + 'if')) {
        return true;
      }
    }

    return false;
  };

  function refreshKeyWatcher (vm, key) {
    var keyWatcher = vm.cach.get('keyWatcher');
    if ($.isArray(keyWatcher[key])) {
      keyWatcher[key] = keyWatcher[key].filter(function (watcher) {
        var _node = watcher.node;
        return $.inDOC(_node) || $.isComment(_node) 
          || $.attr(_node, UNIQ + 'if') || withinIf(_node);
      });
    }
  };

  function JSpring (propsArr, opts) {
    $.time('Service Init DONE');
    if (!(this instanceof JSpring)) {
        return new JSpring(propsArr, opts);
    }

    var _this = this,
          props;

    propsArr = propsArr || [];
    if (propsArr.length < 3) {
      $.warn(WARN.lack);
    }

    if ($.isString(propsArr[0])) {

      //router/plugin pattern
      props = this.defaultProps;
    } else {

      //singleton pattern
      props = this.simpleProps;
    }

    $.each($split.call(props, spaceREG), function propsEach (v) {
      _this[v] = $shift.call(propsArr);
    });

    _this.UUID = $.toInt($.genUUID(''));
    this.opts = opts || $oCreate(null);
    this.$scope = $oCreate(null);
    this.$_scope = $oCreate(null);
    this.updateQueue = $oCreate(null);
    this.tempScope = null;
    this.onDigesting = false;

    this.cach = new $.Cach({

      //watcher cach(option)
      watcher : [],

      //directive cach(option)
      directive : [],

      //new Function cach
      fn : $oCreate(null),

      //key -> for template
      keyForTpl : $oCreate(null),

      //key -> generated for element match result cach(option)
      keyForEl : [],

      //key -> Watcher match result cach
      keyWatcher : $oCreate(null),

      //new RegExp cach
      exp : $oCreate(null)
    });

    this.data = $.isFunction(this.service) 
      ? this.service($, JSpring.module, JSpring.plugin) 
      : this.service;

    if (!$.isObject(this.data)) {
      return $.warn(WARN.beObj);
    }

    this.keys = this.dataResolve(this.data);
    this.dataKey = this.keys.dataKey;
    this.dataMultiKey = this.keys.dataMultiKey;
    this.routeInfo = JSpring.routeCach[this.uniqId] || $oCreate(null);
    this.hash = this.routeInfo.hash;
    this.useCach = this.routeInfo.cach || false;
    this.template = this.routeInfo.template || $shift.call(propsArr);
    this.transition = this.routeInfo.transition || this.opts.transitionIn || 'fadeIn';
    this.readyTransition = this.routeInfo.readyTransition;
    this.transitionLeave = this.routeInfo.transitionLeave;
    this.container = this.opts.container || JSpring.container || $($shift.call(propsArr));
    this.viewport = this.createViewport();
    this.treeWalkQueue = [];
    this.nextTickQueue = [];
    this.appendQueue = [];
    this.newAppendVar = [];
    this.forAssignArr = [];
    this.gcQueue = [];
    this.initial = false;

    if (!this.container.exist) {
      return $.warn(WARN.container);
    }
    
    defineProp(this, this.dataKey);
    defineReact(this, this.dataKey);
    if (this.dataMultiKey.length) {
      defineMultiProp(this, this.dataMultiKey);
      defineMultiReact(this, this.dataMultiKey);
    }
    this.init();
  };

  JSpring.prototype = {
    constructor : JSpring,
    frag : doc.createElement('div'),
    defaultProps : 'uniqId controller service',
    simpleProps : 'controller service',
    init : function init () {
      this.treeWalk().render();
    },

    createViewport : function createViewport () {
      var view = doc.createElement('div');
      var transition = this.readyTransition || this.transition;
      view.className = 'viewport ' + (JSpring.backViewPort 
        ? JSpring.transitionMap[transition] 
        : transition);
      view.id = 'viewport_' + (this.uniqId || $.genUUID(''));
      if ($.isNode(this.template)) {
        view.appendChild(this.template);
        this.template = this.template.outerHTML;
      } else {
        view.innerHTML = this.template;
      }
      return view;
    },

    updateNode : (function () {
      var siblingMap = {};
      return function updateNode (frag, sibling) {
        var _this = this,
              parent, queryList;
        
        _this.initNode(_this.getTreeNodes(_this.viewport, {subFrag : frag}));

        if (sibling) {

          if ($.inDOC($.parent(sibling), _this.viewport)) {
            $.push(this.appendQueue, [frag, sibling]);
          } else {
            $.before(sibling, frag);
          }
          siblingMap[$.attr(frag, UNIQ + 'for')] = sibling;
        }

        if (frag = this.treeWalkQueue.pop()) {

          if (sibling = siblingMap[$.attr(frag, UNIQ + 'for')]) {
            this.updateNode(frag, sibling);  
          } else {
            this.updateNode(frag);
          }
        }
        return this;
      };
    } ()),

    treeWalk : function treeWalk (frag) {
      var _this = this;
      _this.initNode(_this.getTreeNodes(_this.viewport, {subFrag : frag}));

      if (frag = $pop.call(_this.treeWalkQueue)) {
        _this.popForAssign(frag).treeWalk(frag);
      }
      return _this;
    },

    popForAssign : function popForAssign (frag) {
      var forAssign, parent,
            arr = this.forAssignArr;
      if (arr.length) {
        forAssign = $pop.call(arr);
        parent = $.parent(frag);
        if (parent != forAssign[2] && $.attr(parent, UNIQ + 'for') == $.attr(forAssign[2], UNIQ + 'for')) {
          this.$scope[forAssign[0]] = forAssign[1];
        } else {
          $.push(arr, forAssign);
        }
      }
      return this;
    },

    getTreeNodes : function getTreeNodes (frag, opts, whatToShow, filter) {
      opts = opts || {};
      var treeWalker = doc.createTreeWalker(opts.subFrag || frag, 
        whatToShow || NodeFilter.SHOW_ELEMENT, 
        filter || function (node) {
          return $.each(node.attributes, function getTreeNodesEach (v) {
            if (isMatchedAttr(v)) return true;
          }) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }, false), arr = [], node;

      node = opts.subFrag || treeWalker.nextNode();
      while (node) {
        $.push(arr, node);
        node = treeWalker.nextNode();
      }
      return arr;
    },

    initNode : function initNode (nodelist) {
      var _this = this,
            attrs;

     return $.each(nodelist, function nodelistEach (node) {
        attrs = firstLizeFor(node.attributes);
        $.each(attrs, function initNodeEach (v) {
          var match, matchArr;
          JSpring.diyAttrs[match = $substr.call(v.nodeName, UNIQ_LEN)] 
            ? attachWatcher(_this, node, match, v.value)
            : null;
        });
     });
    },

    dataResolve : function dataResolve (data) {
      var _this = this,
            dataKey = [], dataMultiKey = [],
            tmpKey;

      $.each($keys(data), function dataResolveEach (d) {
        dataKeyResolve(data, d, {
          scope : _this.$scope,
          _scope : _this.$_scope,
          arr : []
        });
      });

      function dataKeyResolve (datas, key, props) {
        var _key = datas[key],
              tmpKey;

        if ($.isObject(_key)) {
          !props.scope[key] && (props.scope[key] = $oCreate(null));
          !props._scope[key] && (props._scope[key] = $oCreate(null));
          $.each($keys(_key), function dataResolveKeyEach (_d) {
            tmpKey = props.arr || [];

            //2016.8.27 add "_ob_" and "_vm_", is useful in update trigger
            if ($.isArray(_key[_d])) {
              tmpKey = tmpKey.concat([key, _d]);
              _key[_d]._ob_ = [key, _d].join('.');
              _key[_d]._vm_ = _this;

            } else if ($.isObject(_key[_d])) {
              tmpKey = tmpKey.concat(key);
              return dataKeyResolve(_key, _d, {
                scope : props.scope[key],
                _scope : props._scope[key],
                arr : tmpKey
              });

            } else {
              tmpKey = tmpKey.concat([key, _d]);
            }
            $.push(dataMultiKey, tmpKey);
          });
        } else {

          //2016.8.27 add "_ob_" and "_vm_", is useful in update trigger
          if ($.isArray(_key)) {
            _key._ob_ = key;
            _key._vm_ = _this;
          }
          tmpKey = props.arr.concat(key);

          if (tmpKey.length == 1) {
            $.push(dataKey, tmpKey[0]);
          } else {
            $.push(dataMultiKey, tmpKey);
          }
        }
      };

      return {
        dataKey : dataKey,
        dataMultiKey : dataMultiKey
      }
    },

    clearGcQueue : function clearGcQueue () {
      var _this = this,
            cach = _this.cach.get('keyWatcher');

      if (_this.gcQueue.length) {
        $.each(_this.gcQueue, function gcEach (gc) {
          var parent = gc[0],
                watchId = gc[1],
                child = gc[2],
                cachParent, cachChild;

          clearChildCach(cach, child, watchId);
          $.isObject(cachParent = cach[parent])
            ? clearParentCach(watchId, cachParent)
            : clearParentCach(watchId, parent, cach);
        });

        $.each($keys(cach), function gcKeyEach (k) {
          if (!$keys(cach[k]).length && $.inArray(_this.newAppendVar, k)) {
            delete cach[k];
          }
        });
        _this.gcQueue = [];
      }
      _this.tempScope = null;
      return _this.treeWalkQueue = [];

      function clearChildCach (cach, childkey, watchId) {
        var child, _child, _prop, _ckeys;

        if (child = cach[childkey]) {
          if (watchId) {
            _child = child[watchId] || '';
            if (_child.length && _child[0].props.child) {
              $.each(_child, function clearChildOuterEach (_c) {
                if (_prop = _c.props.child) {
                  clearChildCach(cach, _prop, _c.watchId);
                }
              });
            }
            child[watchId] && delete child[watchId];
          } else {
            if (_child = child) {
              _ckeys = $keys(_child);
              if (_prop = _child[_ckeys[0]][0].props.child) {
                $.each(_ckeys, function clearChildMiddleEach (_pk) {
                  $.each(_child[_pk], function clearChildInnerEach (_cpk) {
                    if (_prop = _cpk.props.child) {
                      clearChildCach(cach, _prop, _c.watchId);
                    }
                  });
                });
              }
              cach[childkey] && delete cach[childkey];
            }
          }
        }
      };

      function clearParentCach (watchId, parent, cach) {
        var _parent;

        if (watchId) {
          if (!cach && $.isObject(parent)) {
            $.each($keys(parent), function clearParentCachEach (p) {
              parent[p] = parent[p].filter(function (_p) {
                return _p.watchId != watchId;
              });

              if (!parent[p].length && $.inArray(_this.newAppendVar, p)) {
                delete parent[p];
              }
            });
          } else if ($.isArray(_parent = cach[parent])) {
            _parent = _parent.filter(function (c) {
              return c.watchId != watchId;
            });
            cach[parent] = _parent;
            if (!_parent.length && $.inArray(_this.newAppendVar, parent)) {
              delete cach[parent];
            }
          }
        }
      };
    },

    updateVersion : function updateVersion () {
      this.UUID += 1;
    },

    resetValue : function resetValue (key, value) {
      this.$scope[key] = value;
      this.$scope[key] = [];
    },

    render : function render (opts) {
      // $.timeEnd('Service Init DONE');
      // $.time('View Rendered DONE');
      opts = opts || {};
      var _this = this,
            comment, 
            firstChild;

      JSpring.vm[_this.uniqId || (_this.uniqId = $.genUUID())] = _this;
      _this.nowWatcher = '';
      _this.initial = true;

      if (!_this.opts.replace) {
        if ($.isGoodBrowser()) {
          _this.updateViewPort();
        } else {
          //normal transform
          !_this.opts.keepViewport
            ? _this.container.html('').append(_this.viewport)
            : _this.container.append(_this.viewport);
          setTimeout(function () {
            _this.viewport.classList.add('effect_active');
          }, 10);
        }
      } else {
        firstChild = _this.container.eq(0);
        comment = doc.createComment(firstChild.outerHTML);
        $.after(firstChild, comment);
        $.replace(firstChild, _this.viewport);
      }
      JSpring.backViewPort = false;
      // $.timeEnd('View Rendered DONE');
      // $.time('Controller Init DONE');
      !opts.cachFlag && _this.controller.call(_this, _this.$scope, $, JSpring.module, JSpring.plugin);
      // $.timeEnd('Controller Init DONE');
      _this.tempScope = null;
      return _this;
    },

    renderFromCach : function renderFromCach () {
      var _this = this;
      _this.viewport.className = 'viewport ' + JSpring.transitionMap[_this.transition];
      _this.viewport.style.display = '';
      return _this.render({cachFlag : true});
    },

    updateViewPort : function updateViewPort () {
      var _this = this,
            children = this.container.children();

      if (children.length && !_this.opts.keepViewport) {
        //视图切换 渐隐效果
        $.transitionRemove($.last(children), _this.transitionLeave 
            ? _this.transitionLeave
            : !JSpring.backViewPort 
            ? 'slideOutLeft'
            : 'slideOutRight',
            JSpring.backViewPort);
      }
      _this.container.append(_this.viewport);
      setTimeout(function () {
        _this.viewport.classList.add('effect_active');
        //2016.8.24 reset viewport className
        setTimeout(function () {
          _this.viewport.className = 'viewport';
        }, 500);
      }, 10);
      _this.addScrollEffect();
      return _this;
    },

    addScrollEffect : function addScrollEffect () {
      //模拟滚动效果
      // var _this = this,
      //       scrollEl = _this.viewport.querySelectorAll('.viewport_scroll');
      // $.each($.toArray(scrollEl), function scrollElEach (el) {
      //   var pageY;
      //   if (!el.addEventListener) return;
      //   el.addEventListener('touchstart', function (e) {
      //     var touch = e.changedTouches[0];
      //     pageY = touch.pageY;
      //   }, false);
      //   el.addEventListener('touchmove', function (e) {
      //     var touch = e.changedTouches[0];
      //     el.style.transform = 'translateY(' + (touch.pageY - pageY) + 'px)';
      //   }, false);
      //   el.addEventListener('touchend', function (e) {
      //     var touch = e.changedTouches[0];
      //     el.style.transform = 'translateY(0)';
      //   }, false);
      // });
    },

    pushNext : function pushNext (callback) {
      if ($.isFunction(callback)) {
        return $.push(this.nextTickQueue, callback);
      }
      return $.warn(WARN.fn);
    },

    nextTick : function nextTick () {
      var nextTick = $shift.call(this.nextTickQueue);
      while (nextTick) {
        nextTick(this.$scope, $);
        nextTick = $shift.call(this.nextTickQueue);
      }
    },

    attachBackViewEvent : function attachBackViewEvent (hash, callback) {

      if (!(1 in arguments)) {
        return $.warn(WARN.lack);
      }

      if ($.isFunction(callback)) {
        JSpring.backViewEvent[hash] = callback;
      }
    },

    compileTemplate : function compileTemplate (template, container) {
      var div = doc.createElement('div'),
            nodeList,
            _this = this;

      div.innerHTML = template;
      _this.initNode(_this.getTreeNodes(_this.viewport, {subFrag : div}));

      if (container) {
        container = $.isElement(container) ? $(container) : container;
        return container.append(div.childNodes);
      }

      return div;
    }

  };


  /**
    * JSpring自定义属性
    */

  //版本
  JSpring.version = VERSION;

  //内部选择器
  JSpring.$ = $;

  //错误信息
  JSpring.WARN = WARN;

  //请求公共参数
  JSpring.commonParam = $oCreate(null);

  //视图返回标志
  JSpring.backViewPort = false;

  //视图实例集
  JSpring.vm = $oCreate(null);

  //扩展模块
  JSpring.module = $oCreate(null);

  //扩展插件
  JSpring.plugin = $oCreate(null);

  //路由缓存
  JSpring.routeCach = $oCreate(null);

  //浏览器返回或硬件返回处理集
  JSpring.backViewEvent = $oCreate(null);

  //app里默认不支持左滑回上一页
  JSpring.swiperBack = false;

  //自定义watcher
  JSpring.diyWatchers = {
    'for' : setForProps,
    text : setHalfObjProps,
    html : setHalfObjProps,
    show : setNormProps,
    hide : setNormProps,
    toggle : setNormProps,
    'if' : setIfProps,
    on : setEventProps,
    model : setNormProps
  };

  //自定义directive
  JSpring.diyDirects = {
    text : vText,
    html : vHtml,
    toggle : vToggle,
    show : vShow,
    hide : vHide,
    'if' : vIf,
    on : vOn,
    model : vModel,
    'for' : vFor
  };

  //自定义扫描属性
  JSpring.diyAttrs = {
    'for' : 1,
    text : 1,
    html : 1,
    show : 1,
    hide : 1,
    toggle : 1,
    'if' : 1,
    on : 1,
    model : 1
  };

  //切换效果
  JSpring.transitionMap = {
    slideLeft : 'slideRight',
    slideRight : 'slideLeft',
    slideDown : 'slideUp',
    slideUp : 'slideDown',
    fadeIn : 'fadeIn'
  };

  //APP左滑上一页事件
  JSpring.enableSwipeBack = function () {
    JSpring.swiperBack = true;
  };

  JSpring.noConflict = function noConflict() {
    global.JSpring = previousJSpring;
    return JSpring;
  };


  /**
    * Watcher
    */
  function Watcher (vm, node, props) {
    var _this = this,
          args = $.toArray(arguments),
          index;
    
    $.each($split.call(this.defaultProps, spaceREG), function defaultPropsEach (v) {
      _this[v] = $shift.call(args);
    });

    _this.watchId = $.genUUID();
    //2016.8.6 add _this.$scope
    _this.$scope = $oCreate(vm.$scope);
    index = _this.$scope.$index;
    _this.$scope.$index = index >= 0 ? index : $.getStrVal(vm.$scope.$index);
    _this.value = _this.getFnBodyVal();

    if (props.objFormat) {
      _this.protoValue = _this.value;
      _this.value = _this.arrifyVal();
    }

    if (props.filter && _this.value.length) {
      _this.forFilter(_this.value, props);
    }

    //2016.8.28 remove uniq attributes
    props.type != 'for' && props.type != 'if' && $.delAttr(node, UNIQ + props.type);
    _this.addDirective();
  };

  Watcher.prototype = {
    constructor : Watcher,
    defaultProps : 'vm node props',
    getFnBodyVal : function getFnBodyVal () {
      var _this = this,
            vm = _this.vm,
            props = _this.props,
            fnBody = props.fnBody,
            fnCach = vm.cach.get('fn'), fn;

      try {
        vm.nowWatcher = _this;
        if (!(fn = fnCach[fnBody])) {
          fn = fnCach[fnBody] = makeGetterFn(fnBody);
        }

        if (props.event) {
          _this.$scope.$index = getIndex(this.node);
        }

        return $.getStrVal(fn(_this.$scope));
      } catch (err) {
        if (REGEXP.test(forChildREG, fnBody)) {
          return '';
        }
        return $.warn(err);
      }
    },

    arrifyVal : function arrifyVal () {
      var _this = this, arr = [];
      _this.dropValue = [];

      if (!$.isUndefined(_this.value)) {
        $.each($keys(_this.value), function arrifyValEach (v) {
          _this.value[v] ? $.push(arr, v) : $.push(_this.dropValue, v);
        });
        return arr;
      }
      return null;
    },

    addDirective : function addDirective () {
      var _this = this, 
            value = _this.value, 
            node = _this.node,
            vm = _this.vm,
            index, forEnd,
            props = _this.props,
            child = props.child,
            parent = props.parent,
            cach = vm.cach.get('keyWatcher'),
            cachForChildren,
            forChild,
            forId,
            nodeParent,
            cachTarget, 
            watchList;

      // try {
        if (props.type == 'for') {
          if ($.isObject(cachTarget = cach[parent])) {
            forId = getForId($.parent(node));
            forId && (cachTarget = cachTarget[forId] || []);
          }

          if (!(cachForChildren = cach[child])) {
            cachForChildren = cach[child] = {};
          }
          
          if (!cachForChildren[_this.watchId]) {
            cachForChildren[_this.watchId] = [];
          }

          if ($.isArray(cachTarget)) {
            if (nodeParent = $.parent(node)) {
              watchList = cachTarget.filter(function (c) {
                return c.props.type == 'for' && $.parent(c.node) === nodeParent;
              });
            } else {
              watchList = cachTarget.filter(function (c) {
                return c.props.child == child;
              });
            }

            watchList = (watchList || cachTarget).map(function (c) {
              return c.watchId;
            });

            if ((index = $.indexOf(watchList, _this.watchId)) < 0) {
              $.push(cachTarget, _this);
              index = watchList.length;
            }
          } else if (!$.isVoid0(value)) {
            cach[parent] = [_this];
            index = 0;
          }

          value = $.isVoid0(value) ? '' : $.getStrVal(value[index]);
          forEnd = $.isVoid0(_this.value) ? true : (index >= _this.value.length - 1);
          _this.$scope.$index = vm.$scope.$index = index;
          _this.$scope.$last = forEnd;
          child && (_this.$scope[child] = value);
          vm.tempScope = _this.$scope;
        } else if (forChild = REGEXP.exec(forChildREG, props.fnBody)) {
          forId = getForId(node);
          props.forChild = forChild[1];
          props.forValue = vm.$scope[forChild[1]];
          forId && cach[props.forChild] && $.push(cach[props.forChild][forId], _this);
        }
        return _this.directive = new Directive(vm, _this, value, {forEnd : forEnd, index : index});
      // } catch (err) {
      //   return $.warn(err);
      // }
    },

    update : function update (index, value) {
      var _this = this,
            vm = _this.vm,
            props = _this.props,
            type = props.type;

      //2016.8.17 if value passed, just give the value
      if (1 in arguments) {
        _this.value = value;
        return this.directive.update();
      }

      _this.value = _this.getFnBodyVal();
      if (props.objFormat) {
        _this.protoValue = _this.value;
        _this.value = _this.arrifyVal();
      }

      if (props.filter && _this.value.length) {
        _this.forFilter(_this.value, props);
      }

      if (!$.isUndefined(index) && !$.isUndefined(_this.value) && type == 'for') {
        _this.value = _this.value[index];
        if ($.isUndefined(_this.value)) {
          _this.gc(_this.watchId) && _this.clear(props.parent, props.child);
        }
      }

      return this.directive.update();
    },

    forFilter : function forFilter (value, props) {
      var _this = this,
            vm = _this.vm,
            fnCach = vm.cach.get('fn'),
            filterObj = props.filterObj,
            fnBody,
            fn;
      
      value = value.slice();
      $.each(props.filterObjKey, function filterObjKeyEach (fk) {
        fnBody = filterObj[fk];
        if (!(fn = fnCach[fnBody])) {
          fn = fnCach[fnBody] = makeGetterFn(fnBody);
        }
        vm.nowWatcher = _this;
        value = JSpring.filter[fk](props.expression, value, fn(vm.$scope), vm.UUID);
      });
      _this.value = value;
    },

    gc : function garbageCollect (watchId) {
      var _this = this,
            vm = _this.vm,
            props = _this.props,
            keyWatcher = vm.cach.get('keyWatcher'),
            keyWatcherGC = keyWatcher[_this.watchId == watchId 
              ? props.parent : props.child];

      return $.each(keyWatcherGC[watchId] || [], function keyWatcherGCEach (w, i, arr) {
        var _props = w.props;
        if (_props.type == 'for') {
          w.gc(w.watchId) && _this.clear(_props.parent, _props.child);
        } else {
          _this.clear(_props.forChild);
        }
      }), true;
    },

    clear : function clear (parent, child) {
      var _this = this;
      $.remove(_this.node);
      $.push(_this.vm.gcQueue, [parent, _this.watchId, child]);
    }
  };


  /**
    * Directive
    */
  function Directive (vm, watcher, value, props) {
    var _this = this,
          args = $.toArray(arguments);
    
    $.each($split.call(this.defaultProps, spaceREG), function defaultPropsEach (v) {
      _this[v] = $shift.call(args);
    });

    _this.type = watcher.props.type;
    _this.node = watcher.node;
    _this.fillNodeData();
  };

  Directive.prototype = {
    constructor : Directive,
    defaultProps : 'vm watcher value props',
    fillNodeData : function fillNodeData () {
      var value = this.value;
      value = value || ($.isNumber(value) ? value === value ? value : '' : '');
      return JSpring.diyDirects[this.type].call(this, this.node, this.value = value);
    },

    update : function update () {
      var watcher = this.watcher,
            props = watcher.props;

      this.value = watcher.value;
      if ($.isUndefined(this.value) && props.type == 'for') {
        watcher.clear(props.parent, props.child);
      }
      return this.fillNodeData();
    }
  };

  //for
  function setForProps (vm, node, attr, expression, props) {
    var cach,
          nextNode,
          comment,
          keyForTpl,
          keyForEl,
          keyForNowTpl,
          matchArr,
          forExpr;

    if (matchArr = REGEXP.exec(forREG, expression)) {
      cach = vm.cach;
      keyForTpl = cach.get('keyForTpl');
      keyForEl = cach.get('keyForEl');
      props.child = matchArr[1];
      props.parent = matchArr[2].trim();
      props.filter = matchArr[3] || '';

      if (props.filter) {
        props.filter = $slice.call(props.filter.replace(spaceREG, '').split('|'), 1);
        props.filterObj = $oCreate(null);
        $.each(props.filter, function filterEach (f) {
          var _fResult = f.split(colonREG);
          props.filterObj[_fResult[0]] = (!$.inString(_fResult[1], "'") 
            ? '$scope.' : '') + _fResult[1];
        });
        props.filterObjKey = $keys(props.filterObj);
      }

      if (props.child === props.parent) {
        $.warn(WARN.forSame);
      }

      keyForNowTpl = keyForTpl[props.parent];
      !keyForNowTpl && (keyForNowTpl = keyForTpl[props.parent] = []);

      if (!REGEXP.test(forChildREG, props.parent)) {
        forExpr = new RegExp(props.child + '\\s+in\\s+' + props.parent);
        if (!(nextNode = $.next(node)) || !REGEXP.test(forExpr, nextNode.textContent)) {
          comment = doc.createComment(node.outerHTML);
          $.after(node, comment);
        }
        props.fnBody = '$scope.' + props.parent;
        isDeepParam(props.fnBody) && (props.valFn = makeGetterFn(props.fnBody));
        node.nextSibling && !keyForNowTpl.filter(function (kt) {
          return REGEXP.test(forExpr, kt[1].textContent)
            && $.parent(node) == $.parent(kt[1]);
        }).length && $.push(keyForNowTpl, [$.clone(node), node.nextSibling]);
      } else {

        //2016.8.17 detect complex inner for parent
        if (REGEXP.test(complexInnerForParentREG, props.parent)) {
          $.uniqPush(keyForEl, props.parent);
        }
        props.fnBody = getForFnBody(props.parent) || '$scope["' + props.parent + '"]';
        keyForTpl[props.parent] = $.clone(node);
      }
    } else {
      $.warn(WARN.format('for', expression));
    }
  };

  //on
  function setEventProps (vm, node, attr, expression, props) {
    var matchArr;
    props.fnBody = $.getFnBody(vm, expression, true);
    props.triggable = true;

    if (matchArr = REGEXP.exec(evtParamREG, props.fnBody)) {
      props.event = matchArr[1];
      props.fnBody = '(function ($event) { return ' + matchArr[2] + ';})';

    } else if (matchArr = REGEXP.test(evtParamObjREG, props.fnBody)) {
      props.fn = {};
      props.objFormat = false;
      
    } else {
      $.warn(WARN.format('on', expression));
    }
  };

  //text, html
  function setHalfObjProps (vm, node, attr, expression, props) {
    var matchArr;
    props.fnBody = $.getFnBody(vm, expression);

    //param.aa or 'bb'
    if (matchArr = REGEXP.exec(normParamREG, expression)) {
      props.parent = matchArr[1];
      props.filter = matchArr[2] || REGEXP.exec(filterPipeREG, expression) || '';

      if (props.filter) {

        if ($.isArray(props.filter)) {
          props.filter = props.filter[1];
        }
        props.fnBody = props.fnBody.replace(/([^\|]+)\s*\|.+/, '$1');
        props.filter = $slice.call(props.filter.replace(/(\s*\|\s*[^\s]+)\s*/g, '$1').split(filterREG), 1);
      }

    //{true : 'aa', false : 'bb'}[isFlag]
    } else if (REGEXP.test(objValParamREG, expression)) {
      props.fnBody = REGEXP.replace(props.fnBody, toBoolREG, '$1!!$2$3');
      vm.cach.get('exp')[expression] = props.fnBody;
    
    //{'aa' : isFlag, 'bb' : !isFlag}
    } else if (REGEXP.test(objParamREG, expression)) {
      props.objFormat = true;

    } else {
      $.warn(WARN.format('text/html', expression));
    }
  };

  //show, hide, toggle, model
  function setNormProps (vm, node, attr, expression, props) {
    var matchArr;
    props.fnBody = $.getFnBody(vm, expression);

    if (matchArr = REGEXP.exec(normParamREG, expression)) {
      props.parent = matchArr[1];

    } else if (matchArr = REGEXP.exec(ifParamREG, expression)) {
      props.parent = matchArr[1];

    } else {
      $.warn(WARN.format('show/hide/toggle/model', expression));
    }
  };

  //if
  function setIfProps (vm, node, attr, expression, props) {
    var matchArr;
    props.fnBody = $.getFnBody(vm, expression);
    if (matchArr = REGEXP.exec(ifParamREG, expression)) {
      props.parent = matchArr[1];
    } else {
      $.warn(WARN.format('if', expression));
    }
  };

  function vText (node, value) {
    var _this = this,
          watcher = _this.watcher,
          props = watcher.props;

    if (props.filter) {
      try {
        $.each(props.filter, function (f) {
          value = JSpring.filter[f](value);
        });
      } catch (err) {
        $.warn(WARN.filter);
      }
    }

    if (node.textContent !== value) {
        node.textContent = value;
    }
  };

  function vHtml (node, value) {
    var _this = this,
          watcher = _this.watcher,
          props = watcher.props;

    if (props.filter) {
      try {
        $.each(props.filter, function (f) {
          value = JSpring.filter[f](value);
        });
      } catch (err) {
        $.warn(WARN.filter);
      }
    }

    if (node.innerHTML !== value) {
        node.innerHTML = value;
    }
  };

  function vToggle (node, value) {
    node.style.display = value ? 'block' : 'none';
  };

  function vShow (node, value) {
    node.style.display = value ? 'block' : 'none';
  };

  function vHide (node, value) {
    node.style.display = value ? 'none' : 'block';
  };

  function vIf (node, value) {
    var _this = this, comment,
          props = _this.watcher.props;
    if (value && $.isComment(node)) {
      $.replace(node, _this.toggleNode);
      _this.watcher.node = _this.node = _this.toggleNode;
      _this.toggleNode = node;
    } else if (!value && $.isElement(node)) {
      _this.toggleNode = node;
      if (props.forChild) {
        $.attr(node, UNIQ + 'forid', getForId($.parent(node)));
      }
      $.replace(node, comment = doc.createComment(node.outerHTML));
      _this.watcher.node = _this.node = comment;
    }
  };

  function vOn (node, value) {
    var _this = this,
          watcher = _this.watcher,
          vm = watcher.vm,
          $scope = vm.$scope,
          props = _this.watcher.props,
          forChild = props.forChild,
          isSearch = props.event == 'search',
          event = !isSearch ? props.event : 'input';

    if (event) {
      props.fn && node.removeEventListener(event, props.fn);
      node.addEventListener(event, props.fn = function (e) {

        if (!props.triggable) return;
        watcher.$scope.$index = $scope.$index = getIndex(node, vm.viewport) || '';
        watcher.$scope.$parent = {
          $index : getIndex(node.parentNode, vm.viewport) || ''
        };
        isSearch && (watcher.$scope.$value = e.target.value);
        forChild && ($scope[forChild] = props.forValue);
        return watcher.value(e);
      }, false);

      if (isSearch) {
        node.addEventListener('compositionstart', function (e) {
          props.triggable = false;
        }, false);

        node.addEventListener('compositionend', function (e) {
          props.triggable = true;
        }, false);
      }
    } else {
      $.each($keys(value), function vOnEach (k) {
        props.fn[k] && node.removeEventListener(k, props.fn[k]);
        node.addEventListener(k, props.fn[k] = function (e) {
          return value[k].call(watcher.$scope, e, $.getStrVal(props.forValue), getIndex(node, vm.viewport) || '');
        }, false);
      });
    }
    
  };

  function vModel (node, value) {
    var _this = this,
          watcher = _this.watcher,
          $scope = watcher.vm.$scope,
          props = _this.watcher.props,
          forChild = props.forChild;

    node.value = value;
    if (!props.fn) {
      node.addEventListener('keyup', props.fn || (props.fn = function (e) {
        return (props.keyUpFn || (props.keyUpFn = new Function('$scope', 'value', 'return ' + props.fnBody + ' = value;')))(watcher.$scope, node.value);
      }), false);
    }
  };

  function vFor (node, value) {
    var _this = this,
          vm = _this.vm,
          watcher = _this.watcher,
          props = watcher.props,
          watcherList, 
          firstWatcher,
          forChild,
          clone,
          parentVal,
          keyTpl;

    if ($.inDOC(node, vm.container) && !$.attr(node, UNIQ + 'fix')) {
      var keyWatcher = vm.cach.get('keyWatcher');

      if (watcherList = keyWatcher[props.child][watcher.watchId]) {

        if (watcherList.length && (firstWatcher = watcherList[0]).props.type != 'for') {
          forChild = firstWatcher.props.forChild;
          vm.$scope[forChild] = value;
          addNewAppendVar.call(vm, forChild);
          $.each(watcherList, function watcherListEach (w, i) {
            w.props.forValue = _this.value;
            w.update();
          });
        } else {
          $.each(watcherList, function watcherListEach (w, i) {
            vm.$scope[props.child] = (value || [''])[i];
            $.attr(w.node, UNIQ + 'index', i);
            addNewAppendVar.call(vm, props.child);
            w.update();
          });

          //if watcher length < child value length in the deepest of for
          insertNewValue(props.child, value);
        }
      }

      //2016.8.17 detect complex inner for parent
      var keyForEl = vm.cach.get('keyForEl');

      if (keyForEl.length) {
        var relateKeys = keyForEl.filter(function (key) {
          return key.indexOf(props.child) > -1;
        });

        if (relateKeys.length) {
          $.each(relateKeys, function relateKeysEach (rel) {
            watcherList = keyWatcher[rel].filter(function (w) {
              return node.contains(w.node);
            });
            value = watcherList[0] && watcherList[0].getFnBodyVal();
            $.each(watcherList, function watcherListEach (w, i) {
              w.update(0, (value || [''])[i]);
            });
            insertNewValue(rel, value);
          });
        }
      }
    } else {
      vm.$scope[props.child] = value;

      if (!vm.initial && $.isArray(watcher.value) && !watcher.value.length) {
        return $.remove(node);
      }
      addNewAppendVar.call(vm, props.child);
      $.attr(node, UNIQ + 'forid', watcher.watchId);
      $.attr(node, UNIQ + 'index', this.props.index);

      if (!this.props.forEnd) {
        var clone = $.clone(node);
        $.after(node, clone);
        $.push(vm.treeWalkQueue, clone);
      } else {

        if (!REGEXP.test(forChildREG, props.parent)) {
          parentVal = (!props.valFn ? vm.$scope[props.parent] : props.valFn(vm.$scope)) || '';
          $.push(vm.forAssignArr, [props.child, $.getStrVal(parentVal[0]), node]);
        }
      }
      $.delAttr(node, UNIQ + 'fix');
    }

    function insertNewValue (key, value) {

      if (value && watcherList.length < value.length) {
        keyTpl = vm.cach.get('keyForTpl')[key];
        vm.$scope[key] = value;
        clone = $.clone($.isNode(keyTpl) ? keyTpl : keyTpl[0]);
        $.attr(clone, UNIQ + 'fix', 'fix');
        $.attr(clone, UNIQ + 'index', watcherList.length);
        $.after($.last(watcherList).node, clone);
        vm.updateNode(clone);
      }
    };
  };

  // define$bind();
  defineArrayProto();
  global.JSpring = global.JSpring || JSpring;
  return JSpring;
  
}));
