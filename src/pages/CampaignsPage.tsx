import React, { useEffect, useState } from 'react';
import { Button, Table, Tag, Space, Modal, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, PauseOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Campaign } from '../store/campaignStore';

const CampaignsPage: React.FC = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    // Load campaign data from local storage
    const savedCampaigns = localStorage.getItem('campaigns');
    if (savedCampaigns) {
      setCampaigns(JSON.parse(savedCampaigns));
    }
  }, []);

  const handleStatusToggle = (id: string) => {
    const updatedCampaigns = campaigns.map((campaign) =>
      campaign.id === id ? { ...campaign, status: campaign.status === 'active' ? 'paused' : 'active' } : campaign
    );
    localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
    setCampaigns(updatedCampaigns);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this campaign?',
      onOk: () => {
        const updatedCampaigns = campaigns.filter((campaign) => campaign.id !== id);
        localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
        setCampaigns(updatedCampaigns);
      },
    });
  };

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
          <Tooltip title="View">
            <Button type="link" icon={<EyeOutlined />} onClick={() => navigate(`/campaigns/${record.id}`)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="link" icon={<EditOutlined />} onClick={() => navigate(`/campaigns/${record.id}/edit`)} />
          </Tooltip>
          <Tooltip title={record.status === 'active' ? 'Pause' : 'Activate'}>
            <Button type="link" icon={record.status === 'active' ? <PauseOutlined /> : <PlayCircleOutlined />} onClick={() => handleStatusToggle(record.id)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button type="link" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
          </Tooltip>
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