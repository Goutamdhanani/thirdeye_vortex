import React, { useState, useEffect } from 'react';
import { Upload, Table, Button, Select, Input, Tag, Card, Modal, Form, message, Space, Drawer, Descriptions, Tooltip, Row, Col } from 'antd';
import { InboxOutlined, DeleteOutlined, FilterOutlined, UploadOutlined, EyeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { Campaign, Lead } from '../../../types/campaign';
import { getLeads, addLeads, deleteLead } from '../../../store/leadStore';
import { parseFile } from '../../../utils/dataProcessing';
import { showUploadSummary } from '../../../components/Notifications';

const { Dragger } = Upload;
const { Option } = Select;

interface Props {
  data: Partial<Campaign>;
  onUpdate: (data: Partial<Campaign>) => void;
}

const AudienceSetup: React.FC<Props> = ({ data, onUpdate }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [mappingModalVisible, setMappingModalVisible] = useState(false);
  const [columnMapping, setColumnMapping] = useState<{ [key: string]: string }>({});
  const [parsedData, setParsedData] = useState<Lead[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  useEffect(() => {
    // Fetch leads data on component mount
    const fetchedLeads = getLeads();
    setLeads(fetchedLeads);
  }, []);

  const handleUpload = async () => {
    setUploading(true);
    let totalRows = 0;
    let duplicates = 0;
    let errors = 0;

    for (const file of fileList) {
      try {
        const { columns, data } = await parseFile(file.originFileObj as Blob);
        setParsedData(data);
        setColumns(columns);
        setMappingModalVisible(true);
        setUploading(false);
        return; // Exit the loop to wait for user mapping
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

  const handleMappingSubmit = () => {
    const mappedLeads = parsedData.map((lead) => ({
      id: lead.id,
      name: lead[columnMapping['name']] || '',
      email: lead[columnMapping['email']] || '',
      company: lead[columnMapping['company']] || '',
      phone: lead[columnMapping['phone']] || '',
    }));

    addLeads(mappedLeads);
    setLeads(getLeads());
    setFileList([]);
    setMappingModalVisible(false);
    showUploadSummary(mappedLeads.length, 0, 0);
  };

  const showDrawer = (lead: Lead) => {
    setSelectedLead(lead);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedLead(null);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this lead?',
      onOk: () => {
        deleteLead(id);
        setLeads(getLeads());
      },
    });
  };

  const handleBulkDelete = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete the selected leads?',
      onOk: () => {
        selectedRowKeys.forEach(id => deleteLead(id));
        setLeads(getLeads());
        setSelectedRowKeys([]);
      },
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys as string[]);
    },
  };

  const systemColumns = ['name', 'email', 'company', 'phone'];

  const columnsPreview = columns.map((column) => ({
    title: column,
    dataIndex: column,
    key: column,
    ellipsis: true,
  }));

  return (
    <Card title="Audience Setup">
      <Form layout="vertical">
        <Form.Item label="Leads Upload">
          <Upload
            multiple
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false}
            onRemove={handleRemoveFile}
          >
            <Button icon={<UploadOutlined />}>Upload Files</Button>
          </Upload>
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
          >
            {uploading ? 'Uploading' : 'Start Upload'}
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={handleBulkDelete}
            disabled={selectedRowKeys.length === 0}
          >
            Delete Selected
          </Button>
        </Form.Item>
        <Table
          rowSelection={rowSelection}
          columns={[
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
              ellipsis: true,
            },
            {
              title: 'Email',
              dataIndex: 'email',
              key: 'email',
              ellipsis: true,
            },
            {
              title: 'Company',
              dataIndex: 'company',
              key: 'company',
              ellipsis: true,
            },
            {
              title: 'Phone',
              dataIndex: 'phone',
              key: 'phone',
              ellipsis: true,
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_: any, record: Lead) => (
                <Space size="middle">
                  <Button type="link" icon={<EyeOutlined />} onClick={() => showDrawer(record)} />
                  <Button type="link" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                </Space>
              ),
            },
          ]}
          dataSource={leads}
          rowKey="id"
        />
      </Form>
      <Drawer
        title="Lead Details"
        width={640}
        placement="right"
        onClose={closeDrawer}
        open={drawerOpen}
      >
        {selectedLead && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Name">{selectedLead.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedLead.email}</Descriptions.Item>
            <Descriptions.Item label="Company">{selectedLead.company}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selectedLead.phone}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
      <Modal
        title="Map Columns"
        visible={mappingModalVisible}
        onCancel={() => setMappingModalVisible(false)}
        onOk={handleMappingSubmit}
        width={800}
      >
        <Tooltip title="Map the columns from your file to the system-defined columns.">
          <InfoCircleOutlined style={{ marginBottom: 16 }} />
        </Tooltip>
        <Form layout="vertical">
          <Row gutter={16}>
            {columns.map((column) => (
              <Col span={12} key={column}>
                <Form.Item label={`Map ${column} to`}>
                  <Select
                    onChange={(value) => setColumnMapping({ ...columnMapping, [value]: column })}
                  >
                    {systemColumns.map((sysColumn) => (
                      <Option key={sysColumn} value={sysColumn}>
                        {sysColumn.charAt(0).toUpperCase() + sysColumn.slice(1)}
                      </Option>
                    ))}
                    <Option value="ignore">Ignore</Option>
                  </Select>
                </Form.Item>
                <Table
                  columns={[{ title: column, dataIndex: column, key: column, ellipsis: true }]}
                  dataSource={parsedData.slice(0, 5)}
                  pagination={false}
                  rowKey="id"
                  size="small"
                />
              </Col>
            ))}
          </Row>
        </Form>
      </Modal>
    </Card>
  );
};

export default AudienceSetup;