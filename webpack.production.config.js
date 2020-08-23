const path = require('path');

module.exports = {
  mode: "production",
  // Workaround for webpack bug: https://github.com/webpack-contrib/css-loader/issues/447
  node: {
    fs: 'empty'
  },
  optimization: {
    minimize: true,
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
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.lazy\.css$/i,
        use: [
          {
            loader: 'style-loader',
            options: { injectType: 'lazySingletonStyleTag' },
          },
          'css-loader',
        ],
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
