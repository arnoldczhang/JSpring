/**
  * router config
  **/
var BASE = './';
var DEST = BASE + 'dist/';
require('../lib/JSpring.full.min.js');
JSpring.router('#container', {

    //test
    'test' : {
        uniqId : 'test', //模板id
        templateUrl : BASE + 'templates/test.tpl',//模板路径
        controllerFn : function (resolve) {
          require([BASE + 'test/test.js', BASE + 'test/test.css'], resolve)
        },
        title : 'test',//T
        description : 'test',//D
        keywords : 'test',//K
        readyTransition : 'fadeIn',//当前视图首次加载完效果
        transition : 'slideLeft',//模板切换效果
        cach : false//是否缓存
    },
    'default' : ''
}, require('./cm.js')());
