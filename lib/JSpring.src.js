/**
 * DIY ATTRIBUTE - src
 *
 * @format 'aaaaa'
 * @format @child.src
 * @format {true : 'aaa', false : 'bbb'}[@child.isSrc]
 * @format {true : param.aa, false : param.bb}[@child.isSrc]
 * @author Arnold.Zhang
 *
 */
;(function(global) {
  global = global || window;
  var J = JSpring,
        $ = J.$,
        REGEXP = $.REGEXP,
        $keys = Object.keys,
        normParamREG = /^\s*([\w\$\.#\:\/@\(\)\+\-\s\!\+'"\[\]]+)\s*$/,
        srcParamREG = /^\s*\{(\s*(?:true|false)\s*\:\s*['"]*\s*([\w\$\:\;\(\)\+@\.\+\s'"\[\]]+)\s*['"]*\s*,?\s*)+\}\s*\[\s*([\w\.\$@\(\)\|\=\s]+)\s*\]$/;

  J.diyAttrs['src'] = 1;
  J.diyWatchers['src'] = setSrcProps;
  J.diyDirects['src'] = vSrc;

  function setSrcProps (vm, node, attr, expression, props) {
    props.fnBody = $.getFnBody(vm, expression);

    //'aaaaa'
    //@child.src
    if (matchArr = REGEXP.exec(normParamREG, props.fnBody)) {
      props.fnBody = matchArr[1];

    //{true : 'aaa', false : 'bbb'}[@child.isSrc]
    //{true : param.aa, false : param.bb}[@child.isSrc]
    } else if (REGEXP.test(srcParamREG, props.fnBody)) {
      props.objFormat = false;
    }else {
      $.warn(J.WARN.format('src', expression));
    }
  };

  function vSrc (node, value) {
    $.attr(node, 'src', value);
  };

}(this || window));