const path = require('path');
const merge = require('webpack-merge');
const base = require('./base.config');
const NodeExternals = require('webpack-node-externals');

const config = {
    mode: 'development',
    devtool: 'inline-cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: 'post',
                include: path.resolve('./src'),
                exclude: [/\.specs?.ts$/],
                use: {
                    loader: 'istanbul-instrumenter-loader',
                    options: { esModules: true }
                }
            }
        ]
    },
    externals: [NodeExternals()]
};

module.exports = merge(base, config);
