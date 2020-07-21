const path = require('path');

module.exports = {
  devtool: 'source-map',
  mode: "development",
  module: {
    rules: [
      {
        test: /\.m?(js|jsx)/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
              {
                  loader: 'file-loader',
                  options: { outputPath: 'css/', name: '[name].min.css'}
              },
              'sass-loader'
          ]
      }
    ],
  },

  entry: {
    tidyblocks: ['./index.js'],
    style: ['./static/sass/base.scss'],
  },
  output: {
    library: 'tidyblocks',
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },

  resolve: {
    //tells webpack where to look for modules
    modules: ['node_modules'],
    //extensions that should be used to resolve modules
    extensions: ['*', '.js', '.jsx'],
  }

};
