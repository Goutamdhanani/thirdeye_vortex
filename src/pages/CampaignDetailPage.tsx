import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Tabs, Button, Progress, Statistic, Row, Col, Table, Tag } from 'antd';
import { useCampaignStore } from '../store/campaignStore';

const { TabPane } = Tabs;

const CampaignDetailPage: React.FC = () => {
  const { id } = useParams();
  const campaign = useCampaignStore(state => 
    state.campaigns.find(c => c.id === id)
  );

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  const leadsColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'sent' ? 'blue' :
          status === 'opened' ? 'green' :
          status === 'replied' ? 'purple' :
          'default'
        }>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Last Action',
      dataIndex: 'lastAction',
      key: 'lastAction',
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{campaign.name}</h1>
        <Button type="primary">
          {campaign.status === 'active' ? 'Pause Campaign' : 'Start Campaign'}
        </Button>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Progress"
              value={campaign.progress}
              suffix="%"
              prefix={<Progress type="circle" percent={campaign.progress} width={50} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Emails Sent"
              value={campaign.sent}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Replies"
              value={campaign.replied}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Opportunities"
              value={campaign.opportunities}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs defaultActiveKey="sequence">
          <TabPane tab="Sequence" key="sequence">
            {campaign.steps.map((step, index) => (
              <Card key={index} className="mb-4">
                <h3 className="font-medium mb-2">Step {index + 1}</h3>
                <p className="text-gray-600">{step.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Wait {step.delay} days before next step
                </p>
              </Card>
            ))}
          </TabPane>
          <TabPane tab="Leads" key="leads">
            <Table
              columns={leadsColumns}
              dataSource={campaign.leads}
              rowKey="id"
            />
          </TabPane>
          <TabPane tab="Analytics" key="analytics">
            {/* Add campaign analytics charts here */}
          </TabPane>
          <TabPane tab="Settings" key="settings">
            {/* Add campaign settings form here */}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default CampaignDetailPage;
