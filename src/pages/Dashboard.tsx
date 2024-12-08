import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { useCampaignStore } from '../store/campaignStore';

const Dashboard: React.FC = () => {
  const campaigns = useCampaignStore((state) => state.campaigns);

  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalLeads = campaigns.reduce((acc, c) => acc + c.leads.length, 0);
  const totalReplies = campaigns.reduce((acc, c) => acc + c.replied, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic title="Total Campaigns" value={totalCampaigns} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Active Campaigns" value={activeCampaigns} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Leads" value={totalLeads} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Replies" value={totalReplies} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;