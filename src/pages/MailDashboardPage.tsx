import React, { useState, useEffect } from 'react';
import { Button, Table, message, Space, Tag, Modal, Form, Input, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getSmtpAccounts, saveSmtpAccount, deleteSmtpAccount, testSmtpConnection, testImapConnection } from '../services/mailService';
import { CheckOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

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
  status?: string;
}

const MailDashboardPage: React.FC = () => {
  const [accounts, setAccounts] = useState<SmtpAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState<SmtpAccount | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      const accounts = getSmtpAccounts();
      for (const account of accounts) {
        account.status = await checkAccountStatus(account);
      }
      setAccounts(accounts);
      setLoading(false);
    };

    fetchAccounts();
  }, []);

  const checkAccountStatus = async (account: SmtpAccount) => {
    try {
      const smtpValid = await testSmtpConnection(account);
      const imapValid = await testImapConnection(account);
      return smtpValid && imapValid ? 'active' : 'error';
    } catch (error) {
      return 'error';
    }
  };

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

  const handleTestConnection = async (account: SmtpAccount) => {
    const status = await checkAccountStatus(account);
    message.info(`Account ${account.accountName} is ${status}`);
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Active' : 'Error'}
        </Tag>
      ),
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
    <div style={{ padding: '24px' }}>
      <Title level={2}>Mail Accounts</Title>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: '16px' }}>
        Add New Mail Account
      </Button>
      <Table columns={columns} dataSource={accounts} rowKey="id" loading={loading} />
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

export default MailDashboardPage;