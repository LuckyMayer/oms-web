module.exports = {
	entry: './src/main.js',
	output: {
		path: './dist',
		publicPath: '/dist/',
		filename: 'bundle.js'
	},
	module: {
		loaders: [{
			test: /\.js$/,
			loader: 'babel-loader',
			query: {
				presets: ['es2015']
			}
		}, {
			test: /\.css$/,
			loader: 'style-loader!css-loader'
		}, {
			test: /\.vue$/,
			loader: 'vue'
		}, {
      test: /\.scss$/,
      loader: 'style!css!sass?sourceMap'
    }
		]
	},
	resolve: {
		extensions: ['', '.js', '.vue', '.css'],
		alias: {
		    'vue$': 'vue/dist/vue.js'
		 }
	}
};