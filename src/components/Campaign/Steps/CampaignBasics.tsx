import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Alert, Spin, Button } from 'antd';
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import type { Campaign, SenderProfile } from '../../../types/campaign';

interface Props {
  data: Partial<Campaign>;
  onUpdate: (data: Partial<Campaign>) => void;
}

const CampaignBasics: React.FC<Props> = ({ data, onUpdate }) => {
  const [form] = Form.useForm();
  const [domainStatus, setDomainStatus] = useState<{
    spf: boolean;
    dkim: boolean;
    dmarc: boolean;
    loading: boolean;
  }>({
    spf: false,
    dkim: false,
    dmarc: false,
    loading: true,
  });

  // Mock sender profiles (replace with API call)
  const senderProfiles: SenderProfile[] = [
    {
      id: '1',
      email: 'john@company.com',
      name: 'John from Company',
      isVerified: true,
    },
    {
      id: '2',
      email: 'sales@company.com',
      name: 'Sales Team',
      isVerified: true,
    },
  ];

  useEffect(() => {
    // Mock API call to check domain authentication
    const checkDomainAuth = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setDomainStatus({
          spf: true,
          dkim: true,
          dmarc: true,
          loading: false,
        });
      } catch (error) {
        console.error('Error checking domain auth:', error);
        setDomainStatus(prev => ({ ...prev, loading: false }));
      }
    };

    checkDomainAuth();
  }, []);

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    onUpdate({
      name: values.name,
      senderProfile: senderProfiles.find(p => p.id === values.senderId),
      replyToEmail: values.replyToEmail,
    });
  };

  return (
    <div className="max-w-2xl">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: data.name,
          senderId: data.senderProfile?.id,
          replyToEmail: data.replyToEmail,
        }}
        onValuesChange={handleFormChange}
      >
        <Form.Item
          label="Campaign Name"
          name="name"
          rules={[
            { required: true, message: 'Please enter a campaign name' },
            { min: 3, message: 'Name must be at least 3 characters' },
          ]}
        >
          <Input placeholder="e.g., Tech Startup Outreach - Q1 2024" />
        </Form.Item>

        <Form.Item
          label="Sender Profile"
          name="senderId"
          rules={[{ required: true, message: 'Please select a sender profile' }]}
        >
          <Select placeholder="Select a sender profile">
            {senderProfiles.map(profile => (
              <Select.Option key={profile.id} value={profile.id}>
                {profile.name} ({profile.email})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Reply-To Email"
          name="replyToEmail"
          rules={[{ type: 'email', message: 'Please enter a valid email' }]}
        >
          <Input placeholder="e.g., support@company.com" />
        </Form.Item>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-medium mb-3">Domain Authentication Status</h3>
          {domainStatus.loading ? (
            <Spin />
          ) : (
            <div className="space-y-2">
              <div className="flex items-center">
                {domainStatus.spf ? (
                  <CheckCircleOutlined className="text-green-500 mr-2" />
                ) : (
                  <WarningOutlined className="text-yellow-500 mr-2" />
                )}
                <span>SPF Record</span>
              </div>
              <div className="flex items-center">
                {domainStatus.dkim ? (
                  <CheckCircleOutlined className="text-green-500 mr-2" />
                ) : (
                  <WarningOutlined className="text-yellow-500 mr-2" />
                )}
                <span>DKIM Signature</span>
              </div>
              <div className="flex items-center">
                {domainStatus.dmarc ? (
                  <CheckCircleOutlined className="text-green-500 mr-2" />
                ) : (
                  <WarningOutlined className="text-yellow-500 mr-2" />
                )}
                <span>DMARC Policy</span>
              </div>
            </div>
          )}
        </div>

        {!domainStatus.loading && (!domainStatus.spf || !domainStatus.dkim || !domainStatus.dmarc) && (
          <Alert
            message="Domain Authentication Issues"
            description="Some authentication records are missing. This may affect email deliverability."
            type="warning"
            showIcon
            action={
              <Button size="small" type="ghost">
                View Setup Guide
              </Button>
            }
          />
        )}
      </Form>
    </div>
  );
};

export default CampaignBasics;
