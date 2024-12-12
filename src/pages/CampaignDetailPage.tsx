import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Tabs, Button, Progress, Statistic, Row, Col, Table, Tag, Modal, Drawer, Descriptions, Space, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, PauseOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Campaign } from '../store/campaignStore';
import ErrorBoundary from '../components/ErrorBoundary';

const { TabPane } = Tabs;

const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    // Load campaign data from local storage
    const savedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const foundCampaign = savedCampaigns.find((c: Campaign) => c.id === id);
    setCampaign(foundCampaign || null);
  }, [id]);

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
      render: (status: string | undefined) => (
        <Tag color={
          status === 'sent' ? 'blue' :
          status === 'opened' ? 'green' :
          status === 'replied' ? 'purple' :
          'default'
        }>
          {status ? status.toUpperCase() : 'UNKNOWN'}
        </Tag>
      ),
    },
    {
      title: 'Last Action',
      dataIndex: 'lastAction',
      key: 'lastAction',
    },
  ];

  const handleStatusToggle = () => {
    const updatedCampaign = { ...campaign, status: campaign.status === 'active' ? 'paused' : 'active' };
    const savedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const updatedCampaigns = savedCampaigns.map((c: Campaign) =>
      c.id === id ? updatedCampaign : c
    );
    localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
    setCampaign(updatedCampaign);
  };

  const handleDelete = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this campaign?',
      onOk: () => {
        const savedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
        const updatedCampaigns = savedCampaigns.filter((c: Campaign) => c.id !== id);
        localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
        navigate('/campaigns');
      },
    });
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <ErrorBoundary>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{campaign.name}</h1>
          <div>
            <Button type="primary" onClick={handleStatusToggle} style={{ marginRight: '8px' }}>
              {campaign.status === 'active' ? 'Pause Campaign' : 'Start Campaign'}
            </Button>
            <Button type="danger" onClick={handleDelete}>
              Delete Campaign
            </Button>
          </div>
        </div>

        <Row gutter={[16, 16]} className="mb-6">
          <Col span={6}>
            <Card>
              <Statistic
                title="Progress"
                value={campaign.progress}
                suffix="%"
                prefix={<Progress type="circle" percent={campaign.progress} size={50} />}
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
              {campaign.steps?.length ? (
                campaign.steps.map((step, index) => (
                  <Card key={index} className="mb-4">
                    <h3 className="font-medium mb-2">Step {index + 1}</h3>
                    <p className="text-gray-600">{step.content}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Wait {step.delay} days before next step
                    </p>
                  </Card>
                ))
              ) : (
                <p>No steps available</p>
              )}
            </TabPane>
            <TabPane tab="Leads" key="leads">
              <Table
                columns={leadsColumns}
                dataSource={campaign.leads?.map(lead => ({ ...lead, key: lead.id })) || []}
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

        <Drawer
          title="Campaign Details"
          width={640}
          placement="right"
          onClose={closeDrawer}
          visible={drawerVisible}
        >
          {campaign && (
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Name">{campaign.name}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={campaign.status === 'active' ? 'green' : campaign.status === 'paused' ? 'orange' : 'blue'}>
                  {campaign.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Progress">
                <Progress percent={campaign.progress} size="small" />
              </Descriptions.Item>
              <Descriptions.Item label="Emails Sent">{campaign.sent}</Descriptions.Item>
              <Descriptions.Item label="Emails Clicked">{campaign.click}</Descriptions.Item>
              <Descriptions.Item label="Emails Replied">{campaign.replied}</Descriptions.Item>
              <Descriptions.Item label="Opportunities">{campaign.opportunities}</Descriptions.Item>
              <Descriptions.Item label="Steps">
                {campaign.steps?.length ? (
                  campaign.steps.map((step, index) => (
                    <div key={index}>
                      <h4>Step {index + 1}</h4>
                      <p>{step.content}</p>
                      <p><strong>Delay:</strong> {step.delay} days</p>
                    </div>
                  ))
                ) : (
                  <p>No steps available</p>
                )}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Drawer>
      </div>
    </ErrorBoundary>
  );
};

export default CampaignDetailPage;