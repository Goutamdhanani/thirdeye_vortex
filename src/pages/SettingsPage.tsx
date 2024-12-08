import React from 'react';
import { Card, Form, Input, Button, Tabs, Switch, InputNumber, message } from 'antd';

const { TabPane } = Tabs;

const SettingsPage: React.FC = () => {
  const handleSaveMailgun = (values: any) => {
    console.log('Mailgun settings:', values);
    message.success('Mailgun settings saved successfully');
  };

  const handleSaveGeneral = (values: any) => {
    console.log('General settings:', values);
    message.success('General settings saved successfully');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Card>
        <Tabs defaultActiveKey="mailgun">
          <TabPane tab="Mailgun Settings" key="mailgun">
            <Form
              layout="vertical"
              onFinish={handleSaveMailgun}
              initialValues={{
                apiKey: '',
                domain: '',
                fromEmail: '',
                fromName: '',
              }}
            >
              <Form.Item
                label="API Key"
                name="apiKey"
                rules={[{ required: true, message: 'Please enter your Mailgun API key' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Domain"
                name="domain"
                rules={[{ required: true, message: 'Please enter your Mailgun domain' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="From Email"
                name="fromEmail"
                rules={[
                  { required: true, message: 'Please enter your from email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="From Name"
                name="fromName"
                rules={[{ required: true, message: 'Please enter your from name' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save Mailgun Settings
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane tab="General Settings" key="general">
            <Form
              layout="vertical"
              onFinish={handleSaveGeneral}
              initialValues={{
                dailyEmailLimit: 100,
                enableTracking: true,
                replyTrackingEnabled: true,
              }}
            >
              <Form.Item
                label="Daily Email Limit"
                name="dailyEmailLimit"
                rules={[{ required: true, message: 'Please set a daily email limit' }]}
              >
                <InputNumber min={1} max={1000} />
              </Form.Item>

              <Form.Item
                label="Enable Email Tracking"
                name="enableTracking"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="Enable Reply Tracking"
                name="replyTrackingEnabled"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save General Settings
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SettingsPage;
