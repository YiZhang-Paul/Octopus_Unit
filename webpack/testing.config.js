const merge = require('webpack-merge');
const base = require('./base.config');
const NodeExternals = require('webpack-node-externals');

const config = {
    mode: 'development',
    devtool: 'inline-cheap-module-source-map',
    externals: [NodeExternals()]
};

module.exports = merge(base, config);
