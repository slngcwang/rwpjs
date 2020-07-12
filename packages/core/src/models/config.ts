import { join } from 'path'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { Configuration } from 'webpack'
import * as TerserPlugin from 'terser-webpack-plugin';
import * as WebpackBar from 'webpackbar';

import { getProjectDir } from './utils'
import { Config } from '../interface'


const getTemplateConfig = (): Configuration => {
    const babelLoader = {
        loader: "babel-loader",
        options: {
            sourceType: 'unambiguous',
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
            plugins: [
                '@babel/plugin-transform-runtime',
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-object-rest-spread',
            ]
        },
    }
    
    return {
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
        },
        context: getProjectDir(),
        output: {
            filename: 'rwp.bundle.js',
            publicPath: '/',
            path: join(getProjectDir(), 'dist')
        },
        module: {
            rules: [{
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }, {
                test: /\.less$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }, {
                    loader: 'less-loader',
                    options: {
                        lessOptions: {
                            javascriptEnabled: true
                        }
                    }
                }]
            }, {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    babelLoader
                ]
            },
            ]
        },
        plugins: [new WebpackBar()]
    }
}

const getDevConfig = () => {
    const template: Configuration = getTemplateConfig()
    template.mode = 'development'
    template.devtool = 'cheap-module-source-map'
    template.plugins = [new WebpackBar()]
    return template
}

const getBuildConfig = () => {
    const template: Configuration = getTemplateConfig()
    template.mode = 'production'
    template.devtool = false
    // 添加压缩编译
    template.optimization = {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                sourceMap: false,
                extractComments: false,
            })
        ],
    }
    return template
}

const getAnalyzerConfig = () => {
    const template = getDevConfig()
    template.plugins!.push(new BundleAnalyzerPlugin())
    return template
}


/**
 * 获取当前的config信息
 */
export default ({
    state
}: {
    config: Config,
    state: 'build' | 'dev' | 'watch' | 'analyzer'
}): Configuration => {
    if (state === 'build') return getBuildConfig()
    if (state === 'dev') return getDevConfig()
    if (state === 'watch') return getDevConfig()
    if (state === 'analyzer') return getAnalyzerConfig()
    throw new Error(`No corresponding state found. [${state}]`);
}
