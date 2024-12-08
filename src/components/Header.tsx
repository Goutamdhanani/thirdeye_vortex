// src/components/Header.tsx
import React from 'react';
import { Layout, Button, Dropdown, Avatar } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/campaigns') return 'Campaigns';
    if (path === '/campaigns/new') return 'New Campaign';
    if (path === '/analytics') return 'Analytics';
    if (path === '/settings') return 'Settings';
    return '';
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <AntHeader className="bg-white px-6 flex items-center justify-between border-b">
      <h1 className="text-xl font-semibold m-0">{getPageTitle()}</h1>
      <div className="flex items-center">
        <Button type="primary" className="mr-4">
          Get All Features
        </Button>
        <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
          <div className="flex items-center cursor-pointer">
            <span className="mr-2">My Organization</span>
            <Avatar icon={<UserOutlined />} />
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;