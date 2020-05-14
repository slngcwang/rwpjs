const path = require('path') 
const Webpack = require('webpack')
const WebpackDevServer = require("webpack-dev-server");
const HtmlWebpackPlugin = require("html-webpack-plugin")

const Routers = require('./models/routers')
const HookCompiler = require('./models/compiler')

async function initWebPack(config) {
    const routers = await Routers.getSrcRouter(path.join(process.cwd(),'src','pages'), function(element){
        return Object.assign(element,{
            name: element.path.replace(path.join(process.cwd(),'src','pages'), '').replace(/\.[A-Za-z1-9]+$/g,'')
        })
    })

    // 预设webpack属性
    let webpackConfig = {
        mode: 'development',
        devtool: 'cheap-module-source-map',
        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        },
        entry: {
            home: path.join(process.cwd(),'src','pages','.rwp','rwp.js'),
        },
        output: {
            filename: 'rwp.js',
            path: path.join(process.cwd(),'dist' ),
        },
        module: {
            rules: [
                {
                    loader: "babel-loader",
                    test: /\.(ts|js)x?$/,
                    exclude: /node_modules/,
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                        plugins: ['@babel/proposal-class-properties', '@babel/proposal-object-rest-spread']
                    },
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                hash: true,
                template: path.join(process.cwd(),'src','pages','.rwp','document.ejs')
            }),
            new Webpack.DefinePlugin({
                // 系统约定的路由信息
                'RWP.routes': JSON.stringify(routers),
                // 系统的标题信息
                'RWP.title': JSON.stringify(config.title || '')
            })
        ]
    }

    return Webpack(webpackConfig)
}

function initDevWebpackServer(compiler, plugins, config) {
    // 添加devWebpackServer预设
    let devWebpackServerConfig = {
        hot: true,
        host: config.devServer && config.devServer.host ? config.devServer.host : '127.0.0.1'
    }

    // 加载插件信息, 初始化webpack信息
    Object.keys(plugins).forEach(function (plugin) {
        const pluginConfig = plugin.default({
            webpackConfig,
            devWebpackServerConfig,
        })
        webpackConfig = pluginConfig.webpackConfig
        devWebpackServerConfig = pluginConfig.devWebpackServerConfig
    })

    // 初始化开发服务器
    const server = new WebpackDevServer(compiler, devWebpackServerConfig);
    if (config.devServer && config.devServer.port) {
        server.listen(Number.parseInt(config.devServer.port, 10))
    } else {
        server.listen(8000)
    }
}

// 初始化webpack相关的信息
exports.default = function ({ config, plugins }) {
    // 初始化webpack编译
    initWebPack(config).then(function(compiler){
        // 完成编译之前的任务
        HookCompiler.default(compiler)
        // 初始化开发服务器
        initDevWebpackServer(compiler, plugins, config)
    })
}

