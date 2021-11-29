const CracoAntDesignPlugin = require('craco-antd')
const path = require('path');
const ROOT_PATH = process.cwd();
const SRC_PATH = path.join(ROOT_PATH, 'src');
module.exports = {
  plugins: [
    {
      //主题颜色配置
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          '@primary-color': '#1DA57A',
        }
      }
    }
  ],
  module: {
    rules: [
      {
        test: /\.css$/, use: ['style-loader', 'less-loader', 'css-loader']
      }
    ]
  },
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, 'src'),
  //     component: path.resolve(__dirname, 'src/component'),
  //     assets: path.resolve(__dirname, 'src/assets'),
  //     request: path.resolve(__dirname, 'src/request'),
  //     utils: path.resolve(__dirname, 'src/utils')
  //   }
  // }
  webpack: {
    alias: {
      src: SRC_PATH
    }
  }
}
