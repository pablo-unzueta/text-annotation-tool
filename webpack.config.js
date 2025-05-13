// webpack.config.js (Corrected)
module.exports = {
  entry: './frontend/src/index.js',
  output: {
    path: __dirname + '/frontend/public',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    static: {
      directory: __dirname + '/frontend/public' // Serves files from this directory
    },
    port: 3000, // Dev server will run on http://localhost:3000
    proxy: [ // <-- Changed to an ARRAY
      {
        context: ['/api'], // The path(s) to proxy
        target: 'http://localhost:8000', // Your backend API server
        pathRewrite: { '^/api': '' }, // Rewrites /api/users to /users before sending to target
        changeOrigin: true // Good practice: changes the origin of the host header to the target URL
      }
    ],
    historyApiFallback: true // Important for Single Page Applications using HTML5 History API
  }
};
