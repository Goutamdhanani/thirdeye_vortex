import React from 'react';
import { Layout } from 'antd';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const { Content } = Layout;

const MainLayout: React.FC = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Header />
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;