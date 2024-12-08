import React, { useState } from 'react';
import { Form, Switch, Select, InputNumber, Card, Radio, Input, Button, Slider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Campaign, ABTest } from '../../../types/campaign';

const { Option } = Select;
const { TextArea } = Input;

interface Props {
  data: Partial<Campaign>;
  onUpdate: (data: Partial<Campaign>) => void;
}

const ABTestingSetup: React.FC<Props> = ({ data, onUpdate }) => {
  const [isEnabled, setIsEnabled] = useState(data.abTest?.enabled || false);
  const [testType, setTestType] = useState<'subject' | 'content' | 'sender'>(
    data.abTest?.type || 'subject'
  );

  const handleABTestChange = (values: any) => {
    const abTest: ABTest = {
      enabled: isEnabled,
      type: testType,
      variants: values.variants || [],
      splitRatio: values.splitRatio || 50,
      testDuration: values.testDuration || 24,
      winningCriteria: values.winningCriteria || 'opens',
    };
    onUpdate({ abTest });
  };

  return (
    <div className="max-w-3xl">
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium mb-1">A/B Testing</h3>
            <p className="text-gray-600">
              Test different variations to optimize your campaign performance
            </p>
          </div>
          <Switch
            checked={isEnabled}
            onChange={(checked) => {
              setIsEnabled(checked);
              handleABTestChange({ enabled: checked });
            }}
          />
        </div>
      </Card>

      {isEnabled && (
        <Form
          layout="vertical"
          initialValues={{
            type: data.abTest?.type || 'subject',
            splitRatio: data.abTest?.splitRatio || 50,
            testDuration: data.abTest?.testDuration || 24,
            winningCriteria: data.abTest?.winningCriteria || 'opens',
            variants: data.abTest?.variants || [
              { id: '1', name: 'Variant A', content: '' },
              { id: '2', name: 'Variant B', content: '' },
            ],
          }}
          onValuesChange={handleABTestChange}
        >
          <Form.Item
            label="What would you like to test?"
            name="type"
          >
            <Radio.Group
              onChange={(e) => setTestType(e.target.value)}
              value={testType}
            >
              <Radio.Button value="subject">Subject Line</Radio.Button>
              <Radio.Button value="content">Email Content</Radio.Button>
              <Radio.Button value="sender">Sender Profile</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.List name="variants">
            {(fields, { add, remove }) => (
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <Card key={field.key} size="small">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <Form.Item
                          {...field}
                          label={`Variant ${String.fromCharCode(65 + index)}`}
                          name={[field.name, 'content']}
                          rules={[{ required: true, message: 'Please enter content' }]}
                        >
                          {testType === 'subject' ? (
                            <Input placeholder="Enter subject line variant" />
                          ) : testType === 'content' ? (
                            <TextArea rows={4} placeholder="Enter email content variant" />
                          ) : (
                            <Select placeholder="Select sender profile">
                              <Option value="profile1">John from Sales</Option>
                              <Option value="profile2">Sarah from Marketing</Option>
                            </Select>
                          )}
                        </Form.Item>
                      </div>
                      {fields.length > 2 && (
                        <Button
                          type="text"
                          danger
                          onClick={() => remove(field.name)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
                {fields.length < 4 && (
                  <Button
                    type="dashed"
                    onClick={() => add({ id: Date.now(), content: '' })}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Variant
                  </Button>
                )}
              </div>
            )}
          </Form.List>

          <Card title="Test Settings" className="mt-6">
            <Form.Item
              label="Split Ratio"
              name="splitRatio"
              help="Percentage of recipients to include in test"
            >
              <Slider
                marks={{
                  10: '10%',
                  25: '25%',
                  50: '50%',
                  75: '75%',
                  100: '100%',
                }}
                step={5}
              />
            </Form.Item>

            <Form.Item
              label="Test Duration"
              name="testDuration"
              help="Hours to wait before selecting winning variant"
            >
              <InputNumber
                min={1}
                max={72}
                addonAfter="hours"
                style={{ width: '200px' }}
              />
            </Form.Item>

            <Form.Item
              label="Winning Criteria"
              name="winningCriteria"
              help="Metric to determine the winning variant"
            >
              <Select>
                <Option value="opens">Open Rate</Option>
                <Option value="clicks">Click Rate</Option>
                <Option value="replies">Reply Rate</Option>
              </Select>
            </Form.Item>
          </Card>
        </Form>
      )}
    </div>
  );
};

export default ABTestingSetup;
