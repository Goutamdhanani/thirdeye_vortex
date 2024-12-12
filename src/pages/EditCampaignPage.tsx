import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Steps } from 'antd';
import { Campaign } from '../store/campaignStore';
import SchedulingDelivery from '../components/Campaign/Steps/SchedulingDelivery';
import Targeting from '../components/Campaign/Steps/Targeting';
import ContentCreation from '../components/Campaign/Steps/ContentCreation';
import ReviewLaunch from '../components/Campaign/Steps/ReviewLaunch';

const { Step } = Steps;

const EditCampaignPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Load campaign data from local storage
    const savedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const foundCampaign = savedCampaigns.find((c: Campaign) => c.id === id);
    setCampaign(foundCampaign || null);
    if (foundCampaign) {
      form.setFieldsValue(foundCampaign);
    }
  }, [id, form]);

  const handleSave = (values: Partial<Campaign>) => {
    const savedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const updatedCampaigns = savedCampaigns.map((c: Campaign) =>
      c.id === id ? { ...c, ...values } : c
    );
    localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
    navigate(`/campaigns/${id}`);
  };

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

  const steps = [
    {
      title: 'Campaign Details',
      content: (
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="name" label="Campaign Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          {/* Add other form fields as necessary */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Scheduling',
      content: <SchedulingDelivery data={campaign} onUpdate={handleSave} />,
    },
    {
      title: 'Targeting',
      content: <Targeting data={campaign} onUpdate={handleSave} />,
    },
    {
      title: 'Content',
      content: <ContentCreation data={campaign} onUpdate={handleSave} />,
    },
    {
      title: 'Review & Launch',
      content: <ReviewLaunch data={campaign} onLaunch={() => navigate('/campaigns')} />,
    },
  ];

  return (
    <Card title="Edit Campaign">
      <Steps current={currentStep} onChange={setCurrentStep}>
        {steps.map((step, index) => (
          <Step key={index} title={step.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[currentStep].content}</div>
      <div className="steps-action">
        {currentStep > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => setCurrentStep(currentStep - 1)}>
            Previous
          </Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button type="primary" onClick={() => setCurrentStep(currentStep + 1)}>
            Next
          </Button>
        )}
        {currentStep === steps.length - 1 && (
          <Button type="primary" onClick={() => navigate('/campaigns')}>
            Done
          </Button>
        )}
      </div>
    </Card>
  );
};

export default EditCampaignPage;