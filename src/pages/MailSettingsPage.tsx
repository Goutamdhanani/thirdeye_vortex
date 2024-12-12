import React, { useState } from 'react';
import { Button, Form, Input, message, Table, Modal, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { saveSmtpAccount, getSmtpAccounts, deleteSmtpAccount, testSmtpConnection, testImapConnection } from '../services/mailService';

interface SmtpAccount {
  id: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  imapHost: string;
  imapPort: string;
  imapUser: string;
  imapPass: string;
  fromEmail: string;
  accountName?: string;
}

const MailSettingsPage: React.FC = () => {
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

  const handleTestSmtpConnection = async () => {
    try {
      const values = await form.validateFields();
      const account: SmtpAccount = {
        id: editingAccount ? editingAccount.id : Date.now().toString(),
        ...values,
      };
      const isValid = await testSmtpConnection(account);
      if (isValid) {
        message.success('SMTP connection successful');
      } else {
        message.error('SMTP connection failed');
      }
    } catch (error) {
      message.error('Please fill out the form correctly');
    }
  };

  const handleTestImapConnection = async () => {
    try {
      const values = await form.validateFields();
      const account: SmtpAccount = {
        id: editingAccount ? editingAccount.id : Date.now().toString(),
        ...values,
      };
      const isValid = await testImapConnection(account);
      if (isValid) {
        message.success('IMAP connection successful');
      } else {
        message.error('IMAP connection failed');
      }
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
      title: 'IMAP Host',
      dataIndex: 'imapHost',
      key: 'imapHost',
    },
    {
      title: 'IMAP Port',
      dataIndex: 'imapPort',
      key: 'imapPort',
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
          <Button type="link" icon={<CheckOutlined />} onClick={() => handleTestSmtpConnection(record)} />
          <Button type="link" icon={<CheckOutlined />} onClick={() => handleTestImapConnection(record)} />
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="link" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h2>Mail Settings</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: '16px' }}>
        Add SMTP/IMAP Account
      </Button>
      <Table columns={columns} dataSource={accounts} rowKey="id" />
      <Modal
        title={editingAccount ? 'Edit SMTP/IMAP Account' : 'Add SMTP/IMAP Account'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="accountName"
            label="Account Name"
            rules={[{ required: true, message: 'Please enter an account name' }]}
          >
            <Input />
          </Form.Item>
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
            name="imapHost"
            label="IMAP Host"
            rules={[{ required: true, message: 'Please enter your IMAP host' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="imapPort"
            label="IMAP Port"
            rules={[{ required: true, message: 'Please enter your IMAP port' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="imapUser"
            label="IMAP User"
            rules={[{ required: true, message: 'Please enter your IMAP user' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="imapPass"
            label="IMAP Password"
            rules={[{ required: true, message: 'Please enter your IMAP password' }]}
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
        </Form>
      </Modal>
    </div>
  );
};

export default MailSettingsPage;