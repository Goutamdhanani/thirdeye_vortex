import React from 'react';
import { Button, Table, Tag, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { useCampaignStore } from '../store/campaignStore';
import type { Campaign } from '../store/campaignStore';

const CampaignsPage: React.FC = () => {
  const navigate = useNavigate();
  const campaigns = useCampaignStore((state) => state.campaigns);

  const columns = [
    {
      title: 'Campaign Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = status === 'active' ? 'green' : 
                   status === 'paused' ? 'orange' :
                   status === 'completed' ? 'blue' : 'default';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => `${progress}%`,
    },
    {
      title: 'Sent',
      dataIndex: 'sent',
      key: 'sent',
    },
    {
      title: 'Clicked',
      dataIndex: 'click',
      key: 'click',
    },
    {
      title: 'Replied',
      dataIndex: 'replied',
      key: 'replied',
    },
    {
      title: 'Opportunities',
      dataIndex: 'opportunities',
      key: 'opportunities',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Campaign) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/campaigns/${record.id}`)}>
            View
          </Button>
          <Button type="link" onClick={() => navigate(`/campaigns/${record.id}/edit`)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <Button 
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/campaigns/new')}
        >
          New Campaign
        </Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={campaigns}
        rowKey="id"
        className="campaigns-table"
      />
    </div>
  );
};

export default CampaignsPage;