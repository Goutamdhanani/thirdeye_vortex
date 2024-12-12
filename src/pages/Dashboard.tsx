import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Typography,
  Layout,
  ConfigProvider,
  theme,
  Avatar,
  Space,
  Badge,
} from 'antd';
import {
  CheckCircleOutlined,
  MailOutlined,
  UserOutlined,
  BarChartOutlined,
  AreaChartOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useCampaignStore } from '../store/campaignStore';
import styled from 'styled-components';

const { Title, Text } = Typography;
const { Content, Footer, Sider } = Layout;
const { useToken } = theme;

// Styled Components
const StyledCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token } = useToken();
  const campaigns = useCampaignStore((state) => state.campaigns);
  const fetchCampaigns = useCampaignStore((state) => state.fetchCampaigns);

  // Ensure campaigns are fetched correctly
  useEffect(() => {
    // Fetch campaigns if not already fetched
    if (campaigns.length === 0) {
      fetchCampaigns();
    }
  }, [campaigns, fetchCampaigns]);

  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;
  const totalLeads = campaigns.reduce((acc, c) => acc + (c.leads ? c.leads.length : 0), 0);
  const totalReplies = campaigns.reduce((acc, c) => acc + c.replied, 0);
  const totalEmailsSent = campaigns.reduce((acc, c) => acc + c.sent, 0);

  const data = campaigns.map((campaign) => ({
    name: campaign.name,
    leads: campaign.leads ? campaign.leads.length : 0,
    replies: campaign.replied,
    emailsSent: campaign.sent,
  }));

  const gradientColors = {
    blue: ['rgba(30, 136, 229, 0.2)', 'rgba(30, 136, 229, 0)'],
    green: ['rgba(67, 160, 71, 0.2)', 'rgba(67, 160, 71, 0)'],
    orange: ['rgba(251, 140, 0, 0.2)', 'rgba(251, 140, 0, 0)'],
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1E88E5',
          colorSuccess: '#43A047',
          colorWarning: '#FB8C00',
          colorError: '#E53935',
          colorInfo: '#039BE5',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Layout>
          <Content style={{ padding: '24px', background: '#f0f2f5' }}>
            <Row gutter={[24, 24]}>
              {[
                {
                  title: 'Total Campaigns',
                  value: totalCampaigns,
                  icon: <BarChartOutlined />,
                  color: token.colorPrimary,
                },
                {
                  title: 'Active Campaigns',
                  value: activeCampaigns,
                  icon: <CheckCircleOutlined />,
                  color: token.colorSuccess,
                },
                {
                  title: 'Total Leads',
                  value: totalLeads,
                  icon: <UserOutlined />,
                  color: token.colorError,
                },
                {
                  title: 'Total Replies',
                  value: totalReplies,
                  icon: <MailOutlined />,
                  color: token.colorWarning,
                },
              ].map((stat, index) => (
                <Col xs={24} sm={12} md={6} key={index}>
                  <StyledCard>
                    <Statistic
                      title={
                        <Space>
                          {stat.icon}
                          <Text strong>{stat.title}</Text>
                        </Space>
                      }
                      value={stat.value}
                      valueStyle={{ color: stat.color, fontSize: 28 }}
                      prefix={<RiseOutlined />}
                    />
                  </StyledCard>
                </Col>
              ))}
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
              <Col xs={24} md={12}>
                <StyledCard title="Email Campaign Progress">
                  <Progress
                    type="dashboard"
                    percent={((totalEmailsSent / (totalLeads * (campaigns.length || 1))) * 100).toFixed(2)}
                    format={(percent) => (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 24, fontWeight: 'bold' }}>{percent}%</div>
                        <div style={{ fontSize: 14, color: token.colorTextSecondary }}>
                          Progress
                        </div>
                      </div>
                    )}
                    strokeColor={{
                      '0%': token.colorPrimary,
                      '100%': token.colorSuccess,
                    }}
                    size={200}
                  />
                </StyledCard>
              </Col>
              <Col xs={24} md={12}>
                <StyledCard title="Campaign Performance">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data}>
                      <defs>
                        {Object.entries(gradientColors).map(([key, colors]) => (
                          <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={colors[0]} />
                            <stop offset="100%" stopColor={colors[1]} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="leads"
                        stroke={token.colorPrimary}
                        fill={`url(#gradient-blue)`}
                        activeDot={{ r: 8 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="replies"
                        stroke={token.colorSuccess}
                        fill={`url(#gradient-green)`}
                      />
                      <Area
                        type="monotone"
                        dataKey="emailsSent"
                        stroke={token.colorWarning}
                        fill={`url(#gradient-orange)`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </StyledCard>
              </Col>
            </Row>
          </Content>
        </Layout>

        <Footer style={{ textAlign: 'center', background: '#f0f2f5' }}>
          <Text type="secondary">Cold Mail Outreach Dashboard ©2024 Created by Daksha1107</Text>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default Dashboard;