var SystemBuilder = require('systemjs-builder');
var builder = new SystemBuilder();

builder.loadConfig('./public/js/systemjs.config.js')
	.then(() => {
		return builder.buildStatic('app', './public/js/bundle.min.js', {
			minify: true,
			mangle: false,
			rollup: true
		});
	})
	.then(() => {
		console.log("bundle successful");
	});