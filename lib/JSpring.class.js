/**
 * DIY ATTRIBUTE - class
 *
 * @format myclass
 * @format {true : 'aa', false : 'bb'}[isFlag]
 * @format {'aa' : isFlag, 'bb' : !isFlag}
 * @author Arnold.Zhang
 *
 */
;(function(global) {
  global = global || window;
  var J = JSpring,
        $ = J.$,
        REGEXP = $.REGEXP,
        objREG = /\(*(\{[^\{\}]+\})\)*/,
        toBoolREG = /([^\[]+\[\s*)([^\[\s!\]]+)(\s*\])/g,
        normParamREG = /^\s*([\w\$\:\.\*@\(\)\+\-\s\!\+'"\u4E00-\u9FA5_（）<>\/\[\]]+)\s*((?:\s*\|\s*\w+|)*)\s*$/,
        classParamREG = /^\{(\s*['"]([\w\$\+\-\s\u4E00-\u9FA5_]+)['"]\s*\:\s*([^,]+),?)+\}$/,
        classValueParamREG = /^\{(\s*['"]*\s*(?:true|false|\w+)\s*['"]*\s*\:\s*['"]\s*([\w\$\:_\->;\(\)\u4E00-\u9FA5\+@\.\+\s'"]*)\s*['"]*\s*,?\s*)+\}\s*\[\s*(['"!\w\.\$@\(\)\|>\=\s\u4E00-\u9FA5\[\]]+)\s*\]$/,
        toStrREG = /['"]*([^\{\:'",]+)['"]*\s*\:/g;

  J.diyAttrs['class'] = 1;
  J.diyWatchers['class'] = setClassProps;
  J.diyDirects['class'] = vClass;

  function setClassProps (vm, node, attr, expression, props) {

    //2016.7.30 fix 'class' attribute key must be surrrounded with '' or ""
    //2016.8.23 modify replace function
    expression = REGEXP.replace(expression, toStrREG, function (match, $1) {
      return "'" + $1.trim() + "':";
    });
    props.fnBody = $.getFnBody(vm, expression);
    
    //{true : 'aa', false : 'bb'}[isFlag]
    if (REGEXP.test(classValueParamREG, expression)) {

      //2016.8.6 $1!!$2$3 => $1$2$3
        props.fnBody = REGEXP.replace(REGEXP.replace(props.fnBody, toBoolREG, '$1$2$3'), objREG, '($1)');
        vm.cach.get('exp')[expression] = props.fnBody;
    
    //{'aa' : isFlag, 'bb' : !isFlag}
    } else if (REGEXP.test(classParamREG, expression)) {
      props.objFormat = true;

    //myclass
    } else if (REGEXP.test(normParamREG, expression)) {
      ;
    } else {
      $.warn(J.WARN.format('class', expression));
    }
  };

  function vClass (node, value) {
    var _this = this,
          watcher = _this.watcher,
          dropValue;

    //2016.7.29 fix 'class' attribute has multiple space
    watcher.dropValue = watcher.dropValue || [];
    $.each(watcher.dropValue, function vClassDropEach (v) {
      v && node.classList.remove(v);
    });
    watcher.dropValue = [];

    if ($.isArray(value)) {
      $.each(value, function vClassEach (v) {
        v && node.classList.add(v);
        $.push(watcher.dropValue, v);
      });  
    } else if (value) {
      value && node.classList.add(value);
      $.push(watcher.dropValue, value);
    }
    
  };

}(this || window));
