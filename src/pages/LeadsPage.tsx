// src/pages/LeadsPage.tsx
import React, { useState } from 'react';
import { Button, Table, Upload, message, Space } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import type { Lead } from '../store/campaignStore';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);

  const columns = [
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
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Lead) => (
        <Space size="middle">
          <Button type="link">Edit</Button>
          <Button type="link" danger>Delete</Button>
        </Space>
      ),
    },
  ];

  const handleImport = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Leads</h1>
          <Space>
            <Upload onChange={handleImport}>
              <Button icon={<UploadOutlined />}>Import CSV</Button>
            </Upload>
            <Button type="primary" icon={<PlusOutlined />}>
              Add Lead
            </Button>
          </Space>
        </div>

        <Table 
          columns={columns} 
          dataSource={leads}
          rowKey="id"
        />
      </div>
    </div>
  );
};

export default LeadsPage;