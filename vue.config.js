const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

const serverConfig = {
    entry: './src/entry-server.js',
    target: 'node',
    devtool: 'source-map',
    output: {
        libraryTarget: 'commonjs2',
    },
    externals: nodeExternals({
        allowlist: /\.css$/,
    }),
    optimization: {
        splitChunks: false,
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.VUE_ENV': JSON.stringify(process.env.VUE_ENV || 'server'),
        }),
        new VueSSRServerPlugin(),
    ],
};

const cilentConfig = {
    entry: './src/entry-client.js',
    optimization: {
        runtimeChunk: {
            name: 'manifest',
        },
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },
            },
        },
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.VUE_ENV': JSON.stringify(process.env.VUE_ENV || 'client'),
        }),
        new VueSSRClientPlugin(),
    ],
};

module.exports = {
    devServer: {
        proxy: {
            '/api' : {
                target : `http://localhost:${process.env.VUE_APP_SERVER_PORT}` 
            },
        },
        // ESLint Error(router.index (from, to) error )
        // Vue CLI 3 버전 후반대부터 현재 4 버전까지 ESLint 에러를 
        // 이제 화면에까지 노출시키고 있음. 
        // 해당 ESLint를 다시 예전처럼 
        // 명령어 입력 창 레벨로 내릴거면 `vue.config.js` 파일에 아래 내용을 입력
        overlay: false
    },
    configureWebpack: process.env.VUE_ENV === 'server' ? serverConfig : cilentConfig,

    // ESLine load Skip
    // 개발 중 Lint-on-save eslint-loader는 기본적으로 활성화되어 있음. 
    // 다음 lintOnSave옵션을 사용하여 비활성화할 수 있습니다 vue.config.js.
    lintOnSave: false
}