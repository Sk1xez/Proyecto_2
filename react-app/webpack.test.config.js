export default {
  mode: 'development',
  devtool: 'inline-source-map',
  optimization: {
    minimize: false,
    splitChunks: false,
    runtimeChunk: false
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        resolve: { fullySpecified: false },
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { chrome: '120' } }],
              ['@babel/preset-react', { runtime: 'automatic' }]
            ],
            plugins: [
              ['babel-plugin-istanbul', { exclude: ['**/*.spec.jsx'] }]
            ],
            babelrc: false,
            configFile: false
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|avif|webp|gif|svg)$/,
        type: 'asset/resource'
      }
    ]
  }
}
