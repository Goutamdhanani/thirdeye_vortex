import React, { useState } from 'react';
import { Upload, Table, Button, Select, Input, Tag, Card, Modal, Form, message } from 'antd';
import { InboxOutlined, DeleteOutlined, FilterOutlined } from '@ant-design/icons';
import type { Campaign, Lead } from '../../../types/campaign';

const { Dragger } = Upload;
const { Option } = Select;

interface Props {
  data: Partial<Campaign>;
  onUpdate: (data: Partial<Campaign>) => void;
}

const AudienceSetup: React.FC<Props> = ({ data, onUpdate }) => {
  const [leads, setLeads] = useState<Lead[]>(data.leads || []);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [filterForm] = Form.useForm();

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
      title: 'Job Title',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <>
          {tags?.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Lead) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveLead(record.id)}
        />
      ),
    },
  ];

  const handleFileUpload = async (file: File) => {
    try {
      // Mock CSV parsing
      const text = await file.text();
      const rows = text.split('\n');
      const headers = rows[0].split(',');
      
      const newLeads: Lead[] = rows.slice(1).map((row, index) => {
        const values = row.split(',');
        return {
          id: `imported-${index}`,
          email: values[headers.indexOf('email')]?.trim(),
          name: values[headers.indexOf('name')]?.trim(),
          company: values[headers.indexOf('company')]?.trim(),
          jobTitle: values[headers.indexOf('job_title')]?.trim(),
          tags: [],
        };
      }).filter(lead => lead.email);

      if (newLeads.length === 0) {
        message.error('No valid leads found in the CSV file');
        return false;
      }

      setLeads(prev => {
        const uniqueLeads = [...prev];
        newLeads.forEach(newLead => {
          if (!uniqueLeads.find(lead => lead.email === newLead.email)) {
            uniqueLeads.push(newLead);
          }
        });
        onUpdate({ leads: uniqueLeads });
        return uniqueLeads;
      });

      message.success(`Successfully imported ${newLeads.length} leads`);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      message.error('Failed to import leads. Please check your CSV format.');
    }
    return false;
  };

  const handleRemoveLead = (leadId: string) => {
    const updatedLeads = leads.filter(lead => lead.id !== leadId);
    setLeads(updatedLeads);
    onUpdate({ leads: updatedLeads });
  };

  const handleFilter = () => {
    const values = filterForm.getFieldsValue();
    const filteredLeads = leads.filter(lead => {
      if (values.industries?.length && !values.industries.includes(lead.industry)) return false;
      if (values.regions?.length && !values.regions.includes(lead.region)) return false;
      if (values.tags?.length && !values.tags.some((tag: string) => lead.tags?.includes(tag))) return false;
      if (values.engagement && lead.engagement !== values.engagement) return false;
      return true;
    });

    setLeads(filteredLeads);
    onUpdate({ leads: filteredLeads });
    setIsFilterModalVisible(false);
  };

  return (
    <div>
      <Card title="Import Leads" className="mb-6">
        <Dragger
          accept=".csv"
          beforeUpload={handleFileUpload}
          showUploadList={false}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag CSV file to this area to upload</p>
          <p className="ant-upload-hint">
            Required columns: email, name, company, job_title
          </p>
        </Dragger>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="mr-2">Total Leads: {leads.length}</span>
          {selectedLeads.length > 0 && (
            <span className="mr-2">Selected: {selectedLeads.length}</span>
          )}
        </div>
        <Button
          icon={<FilterOutlined />}
          onClick={() => setIsFilterModalVisible(true)}
        >
          Filter Leads
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={leads}
        rowKey="id"
        rowSelection={{
          selectedRowKeys: selectedLeads,
          onChange: (selectedRowKeys) => {
            setSelectedLeads(selectedRowKeys as string[]);
          },
        }}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Filter Leads"
        open={isFilterModalVisible}
        onCancel={() => setIsFilterModalVisible(false)}
        onOk={handleFilter}
      >
        <Form form={filterForm} layout="vertical">
          <Form.Item name="industries" label="Industry">
            <Select mode="multiple" placeholder="Select industries">
              <Option value="technology">Technology</Option>
              <Option value="finance">Finance</Option>
              <Option value="healthcare">Healthcare</Option>
            </Select>
          </Form.Item>

          <Form.Item name="regions" label="Region">
            <Select mode="multiple" placeholder="Select regions">
              <Option value="na">North America</Option>
              <Option value="eu">Europe</Option>
              <Option value="asia">Asia</Option>
            </Select>
          </Form.Item>

          <Form.Item name="tags" label="Tags">
            <Select mode="tags" placeholder="Select or create tags" />
          </Form.Item>

          <Form.Item name="engagement" label="Engagement">
            <Select placeholder="Select engagement level">
              <Option value="opened">Previously Opened</Option>
              <Option value="clicked">Clicked Links</Option>
              <Option value="replied">Replied</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AudienceSetup;
