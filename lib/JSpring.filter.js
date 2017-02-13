/**
 * DIY ATTRIBUTE - filter
 *
 * @format | uppercase
 * @format | uppercase | capitalize
 * @format | sortBy param
 * @format | sortBy 'map.index'
 * @author Arnold.Zhang
 *
 */
;(function(global) {
  global = global || window;
  var J = JSpring,
        $ = J.$,
        STRING = '',
        digitsREG = /(\d{3})(?=\d)/g,
        arrowREG = /\s*\->\s*/,
        paramREG = /\s*\.\s*/g,
        signREG = /\-|\+/,
        REGEXP = $.REGEXP,
        $upper = STRING.toUpperCase,
        $lower = STRING.toLowerCase,
        $charAt = STRING.charAt,
        $substr = STRING.substr,
        $split = STRING.split,
        $slice = STRING.slice,
        $oCreate = Object.create,
        $keys = Object.keys,

        module = J.module,
        extendObj = {},
        $filter = extendObj.$filter = $oCreate(null);

  

  /**
    * JSpring.module.$filter
    */
  $filter.cach = {};
  $filter.init = function _init (key, list) {
    $filter.cach[key] = $.toArray(list);
  };

  $filter.run = function _run (key, predicateFn) {
    // var arr = $filter.cach[key],
    //       predicateVal;
    // if ($.isFunction(predicateFn)) {
    //   return arr.filter(predicateFn);
    // } else if ($.isObject(predicateFn)) {
    //   arr = $.toArray(arr);
    //   $.each($keys(predicateFn), function predicateFnEach (k) {
    //     var kArr = k.split(paramREG);
    //     predicateVal = predicateFn[k];
    //     if ($.isFunction(predicateVal)) {
    //       arr = arr.filter(predicateVal);
    //     } else {
    //       arr = arr.filter(function (val) {
    //         return new Function('return ' + REGEXP.replace(predicateVal, /\$1/g, '"' + getSortVal(kArr, val) + '"') + ';')();
    //       });
    //     }
    //   });
    //   return arr;
    // }
  };
  $.extend(module, extendObj);

  /**
    * JSpring.filter
    */
  J.filter = {
    uppercase : uppercase,
    lowercase : lowercase,
    capitalize : capitalize,
    currency : currency,
    json : json,
    trimBr : trimBr
  };

  function uppercase (value) {
    return $upper.call(String(value));
  };

  function lowercase (value) {
    return $lower.call(String(value));
  };

  function capitalize (value) {
    if (!value.length) return value;
    value = String(value);
    return $upper.call($charAt.call(value, 0)) + $substr.call(value, 1);
  };

  function currency (value) {
    var valueStr = String(value),
          currency = valueStr[0],
          sign = valueStr[1],
          prefix,
          body,
          suffix, i;

    if (REGEXP.test(signREG, currency)) {
        sign = currency;
        currency = '$';
        i = 1;
    } else if ($.isNaN(+currency)) {
        !REGEXP.test(signREG, sign) ? (sign = '', i = 1) : i = 2;
    } else {
        currency = '$';
        sign = '';
    }

    value = (+(i ? $slice.call(valueStr, i) : value)).toFixed(2);
    body = $slice.call(value, 0, -3);
    prefix = $slice.call(value, 0, i = body.length % 3)
    prefix += prefix != 0 && prefix.length >= 1 ? ',' : '';
    body = REGEXP.replace($slice.call(body, i), digitsREG, '$1,');
    suffix = $slice.call(value, -3);
    return currency + sign + prefix + body + suffix;
  };

  function json (value) {
    return JSON.stringify(value);
  };

  function trimBr (value) {
    return REGEXP.replace(value, /<br\s*\/?>/g, '\n');
  };

  // J.filter['sortBy'] = (function () {
  //   var sortCach = $oCreate(null),
  //         lastSortKey;

  //   return function sortBy (expression, value, sortKey, version) {
  //     var cachId = expression + '_' + version,
  //           sortKeyArr,
  //           sortValue,
  //           nowCach,
  //           dir = 0;

  //     if (!sortKey) return value;
  //     if (nowCach = sortCach[version]) {        
  //       if (sortValue = nowCach[cachId]) {
  //         return sortValue;
  //       }
  //     } else {
  //       lastSortKey && (delete sortCach[lastSortKey]);
  //       nowCach = sortCach[version] = $oCreate(null);
  //       lastSortKey = version;
  //     }

  //     if ($.isArray(value)) {
  //       if (sortKey[0] == '-') {
  //         dir = 1;
  //         sortKey = $substr.call(sortKey, 1);
  //       }
  //       sortKeyArr = $split.call(sortKey, paramREG);
  //       return nowCach[cachId] = dir ? value.sort(sortDescend) : value.sort(sortAscend);
  //     }
  //     return value;

  //     function sortAscend (a, b) {
  //       return getSortVal(sortKeyArr, a) - getSortVal(sortKeyArr, b);
  //     };

  //     function sortDescend (a, b) {
  //       return getSortVal(sortKeyArr, b) - getSortVal(sortKeyArr, a);
  //     };
  //   };
  // } ());

  // function getSortVal (arr, obj) {
  //   return arr.reduce(function (pre, next) {
  //     return pre[next];
  //   }, obj);
  // };

  return $filter;
}(this || window));