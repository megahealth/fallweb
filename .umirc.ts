import { defineConfig } from 'umi';
import { resolve } from 'path';

export default defineConfig({
  title: '毫米波雷达监测系统',
  hash: true,
  history: { type: 'hash' },
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  // 是否启用按需加载
  // dynamicImport: {},
  // 设置 node_modules 目录下依赖文件的编译方式
  nodeModulesTransform: {
    type: 'none',
  },
  // targets: {
  //   ie: 11,
  // },
  chainWebpack(memo) {
    memo.module
      .rule('media')
      .test(/.mp(3|4)$/)
      .use('file-loader')
      .loader(require.resolve('file-loader'));
  },
  theme: {
    '@primary-color': '#5ec394',
    '@border-radius-base': '5px',
  },
  proxy: {
    '/api': {
      target: 'http://128.1.1.1:8010/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
});
