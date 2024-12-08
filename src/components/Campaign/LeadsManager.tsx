import React, { useState } from 'react';
import { Upload, Button, Table, message } from 'antd';
import { UploadOutlined, SearchOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  position: string;
}

interface LeadsManagerProps {
  campaignId: string;
  onLeadsUpdate: (leads: Lead[]) => void;
}

const LeadsManager: React.FC<LeadsManagerProps> = ({ campaignId, onLeadsUpdate }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [uploading, setUploading] = useState(false);

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
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
  ];

  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file as any);
    });

    setUploading(true);

    try {
      // Here you would typically make an API call to upload the file
      // For now, we'll simulate processing a CSV file
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n');
        const headers = rows[0].split(',');
        
        const newLeads: Lead[] = rows.slice(1).map((row, index) => {
          const values = row.split(',');
          return {
            id: String(index + 1),
            firstName: values[0] || '',
            lastName: values[1] || '',
            email: values[2] || '',
            company: values[3] || '',
            position: values[4] || '',
          };
        });

        setLeads(newLeads);
        onLeadsUpdate(newLeads);
        message.success('Upload successful');
      };

      reader.readAsText(fileList[0] as any);
    } catch (error) {
      message.error('Upload failed');
    }

    setUploading(false);
  };

  const props = {
    onRemove: (file: UploadFile) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file: UploadFile) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Select CSV File</Button>
        </Upload>
        <Button
          type="primary"
          onClick={handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
        >
          {uploading ? 'Uploading' : 'Start Upload'}
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={leads}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default LeadsManager;
