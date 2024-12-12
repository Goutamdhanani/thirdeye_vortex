import React from 'react';
import { Layout, Menu, Badge, Switch, Avatar, Tooltip } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  RocketOutlined,
  TeamOutlined,
  FileTextOutlined,
  BarChartOutlined,
  MailOutlined,
  SettingOutlined,
  BulbOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './Sidebar.css';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse, darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/campaigns',
      icon: <Badge count={3}><RocketOutlined /></Badge>,
      label: 'Campaigns',
    },
    {
      key: '/leads',
      icon: <Badge count={12}><TeamOutlined /></Badge>,
      label: 'Leads',
    },
    {
      key: '/templates',
      icon: <FileTextOutlined />,
      label: 'Templates',
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics',
    },
    {
      key: '/mail',
      icon: <Badge count={5}><MailOutlined /></Badge>,
      label: 'Mail',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={280}
      className="sidebar"
      trigger={null} // Remove the default blue collapse button
    >
      <div className="logo">
        <Avatar size="large" icon={<MailOutlined />} />
        {!collapsed && <span className="logo-text">MyApp</span>}
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        className="sidebar-menu"
      />
      <div className="sidebar-footer">
        <Tooltip title="Toggle Dark Mode">
          <Switch
            checked={darkMode}
            onChange={toggleDarkMode}
            className="theme-switch"
            checkedChildren="Dark"
            unCheckedChildren="Light"
            icon={<BulbOutlined />}
          />
        </Tooltip>
      </div>
    </Sider>
  );
};

export default Sidebar;