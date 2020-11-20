// .umirc.pro.ts 
import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    REACT_APP_USERNAME: "username",
    REACT_APP_PASSWORD: "password",
    // 数字建筑物生产环境 app key
    REACT_APP_APP_KEY: "f83d5f7aa0154ecca48014284d44ee98",
    REACT_APP_BASE_URL: "http://building-bos.rickricks.com",
    REACT_APP_BASE_3D_URL: "http://building-bos3d.rickricks.com",
  }
})