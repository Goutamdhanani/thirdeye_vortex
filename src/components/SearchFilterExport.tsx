import React from 'react';
import { Input, Button, Space } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';

const SearchFilterExport: React.FC = () => {
  const handleSearch = (value: string) => {
    // Implement search logic here
  };

  const handleExport = () => {
    // Implement export logic here
  };

  return (
    <Space style={{ marginBottom: 16 }}>
      <Input.Search
        placeholder="Search leads"
        onSearch={handleSearch}
        style={{ width: 200 }}
      />
      <Button icon={<ExportOutlined />} onClick={handleExport}>
        Export
      </Button>
    </Space>
  );
};

export default SearchFilterExport;