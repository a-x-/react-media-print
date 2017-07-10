const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: { index: '.' },

  output: {
    filename: 'dist/[name].js'
  },

  context: path.join(__dirname, "src"),

  resolve: {
    extensions: ['.js', '.jsx']
  },

  plugins: [
    new webpack.DefinePlugin({
      DEBUG: process.env.NODE_ENV !== 'production',
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      }
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(), // webpack3
  ],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',

        options: {
          presets: [
            ['env', {
              modules: false,
              useBuiltIns: true,
            }],
            'react',
            'stage-2',
          ],
          cacheDirectory: true,
          plugins: [
            ['transform-react-remove-prop-types', {
              mode: 'remove',
              removeImport: true,
            }],
          ]
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              camelCase: 'only',
              importLoaders: 1,
              getLocalIdent: (ctx, localIdentName, localName) => `print-${ new Buffer('p').toString('base64').slice(0, -2) }__${ localName }`,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer')({
                  browsers: ['last 1 version'],
                }),
                require('postcss-nested')({}),
              ],
            }
          },
        ]
      }
    ]
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
}
