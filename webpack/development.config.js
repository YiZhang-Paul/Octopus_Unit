const path = require('path');
const merge = require('webpack-merge');
const base = require('./base.config');
const ElectronReloadPlugin = require('webpack-electron-reload')({
    path: path.join(__dirname, '../dist/main.bundle.js'),
});

const config = {
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [ElectronReloadPlugin()]
};

module.exports = merge(base, config);
