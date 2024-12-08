import React, { useState, useEffect } from 'react';
import { Steps, Card, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCampaignStore } from '../store/campaignStore';
import CampaignBasics from '../components/Campaign/Steps/CampaignBasics';
import AudienceSetup from '../components/Campaign/Steps/AudienceSetup';
import EmailContent from '../components/Campaign/Steps/EmailContent';
import ABTestingSetup from '../components/Campaign/Steps/ABTestingSetup';
import SchedulingDelivery from '../components/Campaign/Steps/SchedulingDelivery';
import FollowupAutomation from '../components/Campaign/Steps/FollowupAutomation';
import ReviewLaunch from '../components/Campaign/Steps/ReviewLaunch';
import type { Campaign } from '../types/campaign';

const { Step } = Steps;

const NewCampaignPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    draftCampaign,
    setDraftCampaign,
    updateDraftCampaign,
    saveDraftCampaign,
    addCampaign,
  } = useCampaignStore();

  useEffect(() => {
    // Initialize draft campaign if not exists
    if (!draftCampaign) {
      setDraftCampaign({});
    }

    // Cleanup on unmount
    return () => {
      if (draftCampaign?.status === 'draft') {
        setDraftCampaign(null);
      }
    };
  }, []);

  const steps = [
    {
      title: 'Basics',
      component: CampaignBasics,
      description: 'Campaign details',
    },
    {
      title: 'Audience',
      component: AudienceSetup,
      description: 'Select recipients',
    },
    {
      title: 'Content',
      component: EmailContent,
      description: 'Email template',
    },
    {
      title: 'A/B Testing',
      component: ABTestingSetup,
      description: 'Test variations',
    },
    {
      title: 'Schedule',
      component: SchedulingDelivery,
      description: 'Delivery settings',
    },
    {
      title: 'Follow-ups',
      component: FollowupAutomation,
      description: 'Automation rules',
    },
    {
      title: 'Review',
      component: ReviewLaunch,
      description: 'Launch campaign',
    },
  ];

  const handleStepUpdate = (data: Partial<Campaign>) => {
    updateDraftCampaign(data);
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (currentStep === 0 && !draftCampaign?.name) {
      message.error('Please enter a campaign name');
      return;
    }
    if (currentStep === 1 && (!draftCampaign?.leads || draftCampaign.leads.length === 0)) {
      message.error('Please select at least one recipient');
      return;
    }
    if (currentStep === 2 && !draftCampaign?.template?.content) {
      message.error('Please create email content');
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSaveDraft = () => {
    try {
      saveDraftCampaign();
      message.success('Campaign saved as draft');
      navigate('/campaigns');
    } catch (error) {
      message.error('Failed to save campaign draft');
    }
  };

  const handleLaunch = async () => {
    setLoading(true);
    try {
      if (!draftCampaign) {
        throw new Error('No draft campaign found');
      }

      const campaign: Campaign = {
        ...draftCampaign as Campaign,
        status: 'active',
        updatedAt: new Date(),
      };

      addCampaign(campaign);
      setDraftCampaign(null);
      message.success('Campaign launched successfully!');
      navigate('/campaigns');
    } catch (error) {
      console.error('Error launching campaign:', error);
      message.error('Failed to launch campaign');
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Campaign</h1>
        <Button onClick={handleSaveDraft}>
          Save as Draft
        </Button>
      </div>

      <Card className="mb-6">
        <Steps 
          current={currentStep} 
          onChange={(step) => {
            // Prevent direct navigation if required fields are not filled
            if (step > currentStep) {
              handleNext();
            } else if (step < currentStep) {
              handlePrev();
            }
          }}
        >
          {steps.map(step => (
            <Step
              key={step.title}
              title={step.title}
              description={step.description}
            />
          ))}
        </Steps>
      </Card>

      <Card className="mb-6">
        <CurrentStepComponent
          data={draftCampaign || {}}
          onUpdate={handleStepUpdate}
          onLaunch={currentStep === steps.length - 1 ? handleLaunch : undefined}
        />
      </Card>

      <div className="flex justify-between">
        <Button
          disabled={currentStep === 0}
          onClick={handlePrev}
        >
          Previous
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button type="primary" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button
            type="primary"
            loading={loading}
            onClick={handleLaunch}
          >
            Launch Campaign
          </Button>
        )}
      </div>
    </div>
  );
};

export default NewCampaignPage;
