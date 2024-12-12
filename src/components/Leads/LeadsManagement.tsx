import React, { useState } from 'react';
import { Upload, Button, message, Table, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/lib/upload/interface';
import { parseFile } from '../../utils/dataProcessing';
import { addLeads, getLeads } from '../../store/leadStore';
import { showUploadSummary } from '../../components/Notifications';

const LeadsManagement: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [leads, setLeads] = useState(getLeads());

  const handleUpload = async () => {
    setUploading(true);
    let totalRows = 0;
    let duplicates = 0;
    let errors = 0;

    for (const file of fileList) {
      try {
        const newLeads = await parseFile(file.originFileObj as Blob);
        addLeads(newLeads);
        totalRows += newLeads.length;
      } catch (error) {
        errors += 1;
        message.error(`Error processing file ${file.name}: ${error.message}`);
      }
    }

    setLeads(getLeads());
    setFileList([]);
    setUploading(false);
    showUploadSummary(totalRows, duplicates, errors);
  };

  const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  const handleRemoveFile = (file: UploadFile) => {
    setFileList(fileList.filter(f => f.uid !== file.uid));
  };

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
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Leads Management</h2>
      <Upload
        multiple
        fileList={fileList}
        onChange={handleFileChange}
        beforeUpload={() => false}
        onRemove={handleRemoveFile}
      >
        <Button icon={<UploadOutlined />}>Upload CSV or XLSX</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        className="mt-4"
      >
        {uploading ? 'Uploading' : 'Start Upload'}
      </Button>
      <div className="mt-4">
        {leads.length === 0 ? (
          <p>No leads uploaded yet.</p>
        ) : (
          <Table columns={columns} dataSource={leads} rowKey="id" />
        )}
      </div>
    </div>
  );
};

export default LeadsManagement;