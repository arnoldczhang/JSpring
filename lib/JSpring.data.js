/**
 * DIY ATTRIBUTE - data
 *
 * @format id:'112233' + @c.id
 * @format {index:'112233' + @c.index, name : @c.name}
 * @author Arnold.Zhang
 *
 */
;(function(global) {
  global = global || window;
  var J = JSpring,
        $ = J.$,
        REGEXP = $.REGEXP,
        WARN = $.WARN,
        $keys = Object.keys,
        attrParamREG = /^\s*([^\s\{]+)\s*\:\s*([^\{\}]+)$/,
        objParamREG = /^\s*\{(\s*['"]*([\w\$\+\-\s]+)['"]*\s*\:\s*([^,]+),?)+\}$/,
        semiREG = /\s*;\s*\w+/,
        toStrREG = /([\{,\s]+)['"]*([^\{\s\:'"]+)['"]*\s*\:/g;

  J.diyAttrs['data'] = 1;
  J.diyWatchers['data'] = setDataProps;
  J.diyDirects['data'] = vData;

  function setDataProps (vm, node, attr, expression, props) {

    //2016.7.31 fix 'data' attribute key must be surrrounded with '' or ""
    expression = REGEXP.replace(expression, toStrREG, "$1'$2':");
    props.fnBody = $.getFnBody(vm, expression);
    
    //id:'112233' + @c.id
    if (matchArr = REGEXP.exec(attrParamREG, props.fnBody)) {
      props.dataKey = matchArr[1].replace(/\$scope\./, '');
      props.fnBody = matchArr[2];

    //{index:'112233' + @c.index, name : @c.name}
    } else if (REGEXP.test(objParamREG, props.fnBody)) {
      props.objFormat = false;
    }else {
      $.warn(J.WARN.format('data', expression));
    }
  };

  function vData (node, value) {
    var props = this.watcher.props;
    if ($.isObject(value)) {
      $.each($keys(value), function vDataEach (k) {
        $.data(node, k, value[k]);
      });
    } else if (value) {
      !REGEXP.test(semiREG, value)
        ? $.data(node, props.dataKey, value)
        : $.warn(WARN.oneAttr);
    }
  };

}(this || window));