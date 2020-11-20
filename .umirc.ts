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
    USERNAME: "18516577050",
    PASSWORD: "LXCbim168168",
    BUILDING_KEY: "d4da34d82e9c44838a594a7a43dc1c4a",
    
    BASE_URL: "http://building-bos.rickricks.com",
    BASE_3D_URL: "http://building-bos3d.rickricks.com",
    BOS3D_DATABASE_KEY: "k542c7943fec4a27ac68531d42ab5972"
  }
  
});
