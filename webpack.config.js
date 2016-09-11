if (process.env.PRODUCTION) {
  module.exports = require('./client/webpack.prod.js');
} else {
  module.exports = require('./client/webpack.dev.js');  
}
