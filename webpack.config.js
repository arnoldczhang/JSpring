var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var version = '20160919001';
var serverFlag = false;

var HOST = '.';
var lib = './lib/';
var src = './src/';
var entryArr = [src + 'main.js'];
var plugins = [
    new webpack.optimize.DedupePlugin(),
    new HtmlWebpackPlugin({
        template : src + 'index.html',
        filename : 'index.html'
    })
];

//if use webpack-dev-server
if (serverFlag) {
    var HOST = 'http://localhost:8080';
    [].push.apply(entryArr, ['webpack-dev-server/client?http://0.0.0.0:8080', 'webpack/hot/only-dev-server']);
    plugins.push(new webpack.HotModuleReplacementPlugin());
}

var dest = HOST + '/dist/';

var entryObj = {
    'entry': entryArr
};

if (process.env.NODE_ENV != 'development') {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));
}

module.exports = {
    //页面入口
    entry: entryObj,
    //出口文件输出配置
    output: {
        path: dest, //js位置
        publicPath: dest, //web打包的资源地址
        filename: 'bundle.js?v=' + version
    },
    // devtool: '',//'#source-map',//source map 支持
    watchOptions: [lib + '**.js', src + '**.js', src + '*/**.js', src + '**.css'], //监控脚本
    plugins: plugins,
    //加载器
    module: {
        loaders: [{
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }, {
            test: /\.html$/,
            loader: "html-loader"
        }, {
            test: /\.tpl$/,
            loader: "html-loader"
        }, {
            test: /.*\.(png|jpg|jpe?g|ico|gif|svg)$/i,
            loaders: [
                'image-webpack?{progressive:true, optimizationLevel: 3, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
                'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
            ]
        }]
    },
    resolve: {
        extensions: ['', '.js']
    }
};