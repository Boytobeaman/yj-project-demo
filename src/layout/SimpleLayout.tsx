import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useHistory } from 'umi';

const { Header, Content, Footer, Sider } = Layout;


const index = (props: { children: React.ReactNode }) => {
  const { location } = useHistory();


  return (
      <Layout className="site-layout">
        <Content
          className="site-layout-background"
          style={{ minHeight: 'max-content' }}
        >
          {props.children}
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>

        </Footer> */}
      </Layout>
  );
};

export default index;