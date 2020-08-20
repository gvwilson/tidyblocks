const path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  devtool: 'source-map',
  mode: "development",
  target: "node",
  // Workaround for webpack bug: https://github.com/webpack-contrib/css-loader/issues/447
  node: {
    fs: 'empty',
    canvas: 'empty',
    document: 'empty'

  },
  module: {
    rules: [
      {
        test: /\.m?(js|jsx)/,

        // react-data-grid uses ES2020, given current babel-loaders, this is
        // the recommended way to include it.
        exclude: /node_modules[/\\](?!react-data-grid[/\\]lib)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/i,
        exclude: /\.lazy\.css$/i,
        use: ['null-loader'],
      },
      {
        test: /\.lazy\.css$/i,
        use: [
          'null-loader',
        ],
      },
      {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
              {
                  loader: 'null-loader',
                  options: { outputPath: 'css/', name: '[name].min.css'}
              },
              'null-loader'
          ]
      }
    ],
  },
  resolve: {
    //tells webpack where to look for modules
    modules: ['node_modules'],
    //extensions that should be used to resolve modules
    extensions: ['*', '.js', '.jsx'],
  },
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder

};
