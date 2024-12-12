import React, { useState } from 'react';
import { Button, Table, Modal, Form, Input, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { saveSmtpAccount, getSmtpAccounts, deleteSmtpAccount, testSmtpConnection } from '../services/mailService';

interface SmtpAccount {
  id: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  fromEmail: string;
  accountName?: string;
}

const MailPage: React.FC = () => {
  const [accounts, setAccounts] = useState<SmtpAccount[]>(getSmtpAccounts());
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState<SmtpAccount | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingAccount(null);
    setModalVisible(true);
  };

  const handleEdit = (account: SmtpAccount) => {
    setEditingAccount(account);
    setModalVisible(true);
    form.setFieldsValue(account);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this account?',
      onOk: () => {
        deleteSmtpAccount(id);
        setAccounts(getSmtpAccounts());
        message.success('Account deleted successfully');
      },
    });
  };

  const handleTestConnection = async (account: SmtpAccount) => {
    const isValid = await testSmtpConnection(account);
    if (isValid) {
      message.success('Connection successful');
    } else {
      message.error('Connection failed');
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const account: SmtpAccount = {
        id: editingAccount ? editingAccount.id : Date.now().toString(),
        ...values,
      };
      saveSmtpAccount(account);
      setAccounts(getSmtpAccounts());
      setModalVisible(false);
      message.success('Account saved successfully');
    } catch (error) {
      message.error('Please fill out the form correctly');
    }
  };

  const columns = [
    {
      title: 'Account Name',
      dataIndex: 'accountName',
      key: 'accountName',
    },
    {
      title: 'SMTP Host',
      dataIndex: 'smtpHost',
      key: 'smtpHost',
    },
    {
      title: 'SMTP Port',
      dataIndex: 'smtpPort',
      key: 'smtpPort',
    },
    {
      title: 'From Email',
      dataIndex: 'fromEmail',
      key: 'fromEmail',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: SmtpAccount) => (
        <Space size="middle">
          <Button type="link" icon={<CheckOutlined />} onClick={() => handleTestConnection(record)} />
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="link" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
        Add SMTP Account
      </Button>
      <Table columns={columns} dataSource={accounts} rowKey="id" style={{ marginTop: 16 }} />
      <Modal
        title={editingAccount ? 'Edit SMTP Account' : 'Add SMTP Account'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="smtpHost"
            label="SMTP Host"
            rules={[{ required: true, message: 'Please enter your SMTP host' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="smtpPort"
            label="SMTP Port"
            rules={[{ required: true, message: 'Please enter your SMTP port' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="smtpUser"
            label="SMTP User"
            rules={[{ required: true, message: 'Please enter your SMTP user' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="smtpPass"
            label="SMTP Password"
            rules={[{ required: true, message: 'Please enter your SMTP password' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="fromEmail"
            label="From Email"
            rules={[{ required: true, message: 'Please enter your from email address' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="accountName" label="Account Name (optional)">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MailPage;