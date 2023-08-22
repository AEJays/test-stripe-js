let config = require('./config') 
module.exports = {
    devServer: {
        proxy: {
          "/apih5": {
            target: config.endpoint,
            changeOrigin: true,
            pathRewrite: {
              "^/apih5": "/apih5",
            },
          },
        },
      },
}