const {createProxyMiddleware} = require("http-proxy-middleware")

/**
 * 配置请求跨域
 * @param app
 */
module.exports = function (app) {
  app.use(
      // createProxyMiddleware("/home/epidemic", {
      //   target: process.env.REACT_APP_EPIDEMIC,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "/epidemic":""
      //   }
      // }),
      createProxyMiddleware("/socket", {
        target: process.env.REACT_APP_SWEET2.replace("https","ws").replace("http","ws"),
        changeOrigin: true,
        pathRewrite: {
          "/socket":""
        }
      }),
      createProxyMiddleware("/sweet", {
        target: process.env.REACT_APP_SWEET,
        changeOrigin: true,
        pathRewrite: {
          "/sweet":""
        }
      }),
  )
}
