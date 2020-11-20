import { defineConfig } from 'umi';

export default defineConfig({
  antd: {},
  title: '数字化管理平台',
  history: {
    type: 'browser',
  },
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    // { path: '/', component: '@/pages/index' },
    {
      path: '/',
      component: '@/layout/index',
      routes: [
        {
          path: '/',
          component: './Home',
        },
        {
          path: '/home',
          component: './Home',
        },
        {
          path: '/login',
          component: './Login',
        },
        {
          path: '/go',
          component: './GoDiagram',
        },
      ],
    },
  ],
  sass: {
    implementation: require('node-sass'),
  },
  cssModulesTypescriptLoader: {},
  define: {
    USERNAME: '18516577050',
    PASSWORD: 'LXCbim168',
    BUILDING_KEY: 'b8481275299b4fd4a3469347e55c704c',

    BASE_URL: 'http://building-bos-alpha.rickricks.com',
    BASE_3D_URL: 'http://building-bos3d-alpha.rickricks.com',
    BOS3D_DATABASE_KEY: 'o5fabba65a3c40c4bfeaaa1fabd443f7',
  },
});
