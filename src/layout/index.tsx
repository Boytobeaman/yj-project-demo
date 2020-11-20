import React from 'react';
import { Layout, Menu } from 'antd';
import './index.scss';
import '../assets/scss/main.scss';
import styles from './index.scss';
import { Link, useHistory } from 'umi';
import SimpleLayout from './SimpleLayout';
import { Redirect } from 'umi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { publicAccessRoutes } from '@/utils/utils';
import PageHeader from '../components/pageHeader';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

// 根据获取到的所有地址,来决定选中状态
const getMenuSeletedKeys = (pathname: string): string[] => {
  if (pathname == '') return [];

  let paths: string[] = pathname.split('/');
  let selectedKeys: string[] = [];

  paths.forEach((_, i) => {
    selectedKeys.push(paths.slice(0, paths.length - i).join('/'));
  });

  return selectedKeys;
};

const index = (props: { children: React.ReactNode }) => {
  const { location } = useHistory();
  // console.log(location);
  if (location.pathname === '/login') {
    return <SimpleLayout>{props.children}</SimpleLayout>;
  }

  //没有登录 且 不是公开访问的路由时，跳转到login 页面
  const isLogin = sessionStorage.getItem('accessToken');
  let pathname = location.pathname;
  if (pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  let isPublicAccessRoute = false;
  const matchedPathObj = publicAccessRoutes.find( (item:any) => item.url === pathname);
  if(matchedPathObj){
    isPublicAccessRoute = true;
  }

  if (!isLogin && !isPublicAccessRoute) {
    return <Redirect to="/login" />;
  }

  if(matchedPathObj && matchedPathObj.type === "noLayout"){
    return (
      <div className="no-layout-wrap">
        {props.children}
      </div>
    )
  }

  return (
    <Layout className="site-layout">
      <PageHeader />
      <Content
        className="site-layout-background"
        style={{
          margin: '65px 8px 24px 8px',
          padding: 15,
          minHeight: 'max-content',
        }}
      >
        {props.children}
      </Content>
      {/* <Footer style={{ textAlign: 'center' }}>umi3-demo</Footer> */}
    </Layout>
  );
};

export default index;
