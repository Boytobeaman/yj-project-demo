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
    USERNAME: 'yingjiahulian',
    PASSWORD: 'admin_2017',
    BUILDING_KEY: 'h191c7f5fc68490ea2e36629bdbcd7c5',

    BASE_URL: 'http://alpha-building-hkiot-bosgw.rickricks.com.cn',
    BASE_3D_URL: 'http://alpha-building-hkiot-bos3d.rickricks.com.cn',
    BOS3D_DATABASE_KEY: 's3b3e1986d044aa299f0d45ae98a7651',
  },
});
