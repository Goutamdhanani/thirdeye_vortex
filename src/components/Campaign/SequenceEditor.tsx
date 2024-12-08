import React, { useState } from 'react';
import { Input, Button, Card, Space, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { mailService } from '../../services/mailService';

interface Variant {
  id: string;
  subject: string;
  content: string;
}

interface Step {
  id: string;
  subject: string;
  content: string;
  variants: Variant[];
}

interface SequenceEditorProps {
  campaignId: string;
  onSave: (steps: Step[]) => void;
}

const SequenceEditor: React.FC<SequenceEditorProps> = ({ campaignId, onSave }) => {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: '1',
      subject: '{{firstName}} - quick question',
      content: `Hey {{firstName}},

Your LinkedIn was impressive and I wanted to reach out directly:)

So we're helping (target group) from (location) to fill their cal with 5-12 calls with (their ideal customer) daily. If you let me have a call with you about how we can do the same for you, I will send you a burger with UberEats:D

Are you free any time this week for a quick chat?

Cheers,
{{senderName}}`,
      variants: [],
    },
  ]);

  const handleAddStep = () => {
    const newStep: Step = {
      id: String(steps.length + 1),
      subject: '',
      content: '',
      variants: [],
    };
    setSteps([...steps, newStep]);
  };

  const handleAddVariant = (stepIndex: number) => {
    const newSteps = [...steps];
    const newVariant: Variant = {
      id: String(newSteps[stepIndex].variants.length + 1),
      subject: newSteps[stepIndex].subject,
      content: newSteps[stepIndex].content,
    };
    newSteps[stepIndex].variants.push(newVariant);
    setSteps(newSteps);
  };

  const handleStepChange = (
    stepIndex: number,
    field: 'subject' | 'content',
    value: string
  ) => {
    const newSteps = [...steps];
    newSteps[stepIndex][field] = value;
    setSteps(newSteps);
  };

  const handleVariantChange = (
    stepIndex: number,
    variantIndex: number,
    field: 'subject' | 'content',
    value: string
  ) => {
    const newSteps = [...steps];
    newSteps[stepIndex].variants[variantIndex][field] = value;
    setSteps(newSteps);
  };

  const handleSave = async () => {
    try {
      await onSave(steps);
      message.success('Sequence saved successfully');
    } catch (error) {
      message.error('Failed to save sequence');
    }
  };

  return (
    <div className="space-y-6">
      {steps.map((step, stepIndex) => (
        <Card key={step.id} title={`Step ${stepIndex + 1}`} className="w-full">
          <Space direction="vertical" className="w-full">
            <Input
              placeholder="Subject"
              value={step.subject}
              onChange={(e) =>
                handleStepChange(stepIndex, 'subject', e.target.value)
              }
            />
            <Input.TextArea
              placeholder="Email content"
              value={step.content}
              onChange={(e) =>
                handleStepChange(stepIndex, 'content', e.target.value)
              }
              rows={6}
            />
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => handleAddVariant(stepIndex)}
            >
              Add variant
            </Button>

            {step.variants.map((variant, variantIndex) => (
              <Card
                key={variant.id}
                size="small"
                title={`Variant ${variantIndex + 1}`}
                extra={
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      const newSteps = [...steps];
                      newSteps[stepIndex].variants.splice(variantIndex, 1);
                      setSteps(newSteps);
                    }}
                  />
                }
              >
                <Space direction="vertical" className="w-full">
                  <Input
                    placeholder="Subject"
                    value={variant.subject}
                    onChange={(e) =>
                      handleVariantChange(
                        stepIndex,
                        variantIndex,
                        'subject',
                        e.target.value
                      )
                    }
                  />
                  <Input.TextArea
                    placeholder="Email content"
                    value={variant.content}
                    onChange={(e) =>
                      handleVariantChange(
                        stepIndex,
                        variantIndex,
                        'content',
                        e.target.value
                      )
                    }
                    rows={6}
                  />
                </Space>
              </Card>
            ))}
          </Space>
        </Card>
      ))}

      <Space className="w-full">
        <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddStep}>
          Add step
        </Button>
        <Button type="primary" onClick={handleSave}>
          Save sequence
        </Button>
      </Space>
    </div>
  );
};

export default SequenceEditor;
