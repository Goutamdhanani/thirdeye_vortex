import React, { useState } from 'react';
import { Form, Switch, Card, Select, InputNumber, Button, Input, Timeline, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, BranchesOutlined } from '@ant-design/icons';
import type { Campaign, FollowUpRule } from '../../../types/campaign';

const { Option } = Select;
const { TextArea } = Input;

interface Props {
  data: Partial<Campaign>;
  onUpdate: (data: Partial<Campaign>) => void;
}

const FollowupAutomation: React.FC<Props> = ({ data, onUpdate }) => {
  const [isEnabled, setIsEnabled] = useState(data.followUpRules?.length > 0 || false);

  const triggerTypes = [
    { label: 'No Response', value: 'no_response' },
    { label: 'Email Opened', value: 'opened' },
    { label: 'Link Clicked', value: 'clicked' },
    { label: 'Reply Received', value: 'replied' },
  ];

  const handleFollowUpChange = (values: any) => {
    if (!isEnabled) {
      onUpdate({ followUpRules: [] });
      return;
    }

    const rules: FollowUpRule[] = values.rules?.map((rule: any) => ({
      id: rule.id || Date.now().toString(),
      name: rule.name,
      trigger: {
        type: rule.triggerType,
        delay: rule.delay,
        delayUnit: rule.delayUnit,
      },
      action: {
        type: 'send_email',
        template: {
          subject: rule.subject,
          content: rule.content,
        },
      },
      conditions: rule.conditions || [],
      enabled: true,
    })) || [];

    onUpdate({ followUpRules: rules });
  };

  return (
    <div className="max-w-3xl">
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium mb-1">Follow-up Automation</h3>
            <p className="text-gray-600">
              Automatically send follow-up emails based on recipient behavior
            </p>
          </div>
          <Switch
            checked={isEnabled}
            onChange={(checked) => {
              setIsEnabled(checked);
              if (!checked) {
                handleFollowUpChange({ rules: [] });
              }
            }}
          />
        </div>
      </Card>

      {isEnabled && (
        <Form
          layout="vertical"
          initialValues={{
            rules: data.followUpRules?.map(rule => ({
              id: rule.id,
              name: rule.name,
              triggerType: rule.trigger.type,
              delay: rule.trigger.delay,
              delayUnit: rule.trigger.delayUnit,
              subject: rule.action.template.subject,
              content: rule.action.template.content,
              conditions: rule.conditions,
            })) || [
              {
                id: '1',
                name: 'First Follow-up',
                triggerType: 'no_response',
                delay: 3,
                delayUnit: 'days',
              },
            ],
          }}
          onValuesChange={handleFollowUpChange}
        >
          <Form.List name="rules">
            {(fields, { add, remove }) => (
              <div className="space-y-6">
                {fields.map((field, index) => (
                  <Card
                    key={field.key}
                    title={`Follow-up Rule ${index + 1}`}
                    extra={
                      fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(field.name)}
                        >
                          Remove Rule
                        </Button>
                      )
                    }
                  >
                    <Form.Item
                      {...field}
                      label="Rule Name"
                      name={[field.name, 'name']}
                      rules={[{ required: true, message: 'Please enter a rule name' }]}
                    >
                      <Input placeholder="e.g., First Follow-up" />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                      <Form.Item
                        {...field}
                        label="Trigger"
                        name={[field.name, 'triggerType']}
                        rules={[{ required: true, message: 'Please select a trigger' }]}
                      >
                        <Select placeholder="Select trigger">
                          {triggerTypes.map(type => (
                            <Option key={type.value} value={type.value}>
                              {type.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <div className="grid grid-cols-2 gap-2">
                        <Form.Item
                          {...field}
                          label="Delay"
                          name={[field.name, 'delay']}
                          rules={[{ required: true, message: 'Required' }]}
                        >
                          <InputNumber min={1} className="w-full" />
                        </Form.Item>

                        <Form.Item
                          {...field}
                          label="Unit"
                          name={[field.name, 'delayUnit']}
                          rules={[{ required: true, message: 'Required' }]}
                        >
                          <Select>
                            <Option value="minutes">Minutes</Option>
                            <Option value="hours">Hours</Option>
                            <Option value="days">Days</Option>
                          </Select>
                        </Form.Item>
                      </div>
                    </div>

                    <Form.Item
                      {...field}
                      label="Follow-up Subject"
                      name={[field.name, 'subject']}
                      rules={[{ required: true, message: 'Please enter a subject' }]}
                    >
                      <Input placeholder="Re: {{original_subject}}" />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      label="Follow-up Content"
                      name={[field.name, 'content']}
                      rules={[{ required: true, message: 'Please enter content' }]}
                    >
                      <TextArea
                        rows={4}
                        placeholder="I wanted to follow up on my previous email..."
                      />
                    </Form.Item>

                    <Form.List name={[field.name, 'conditions']}>
                      {(conditionFields, { add: addCondition, remove: removeCondition }) => (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="font-medium">Additional Conditions</label>
                            <Button
                              type="link"
                              icon={<PlusOutlined />}
                              onClick={() => addCondition()}
                            >
                              Add Condition
                            </Button>
                          </div>
                          {conditionFields.map((conditionField, conditionIndex) => (
                            <div key={conditionField.key} className="flex items-center gap-2 mb-2">
                              <Form.Item
                                {...conditionField}
                                name={[conditionField.name, 'type']}
                                noStyle
                              >
                                <Select style={{ width: 200 }}>
                                  <Option value="email_opened">Email Opened</Option>
                                  <Option value="link_clicked">Link Clicked</Option>
                                  <Option value="replied">Replied</Option>
                                </Select>
                              </Form.Item>
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => removeCondition(conditionField.name)}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </Form.List>
                  </Card>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Follow-up Rule
                </Button>
              </div>
            )}
          </Form.List>
        </Form>
      )}

      {isEnabled && data.followUpRules && data.followUpRules.length > 0 && (
        <Card title="Follow-up Sequence" className="mt-6">
          <Timeline>
            <Timeline.Item dot={<BranchesOutlined />}>
              Initial Email Sent
            </Timeline.Item>
            {data.followUpRules.map((rule, index) => (
              <Timeline.Item key={rule.id}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{rule.name}</span>
                  <Tag color="blue">
                    {rule.trigger.delay} {rule.trigger.delayUnit}
                  </Tag>
                  {rule.trigger.type === 'no_response' && (
                    <Tag color="orange">If no response</Tag>
                  )}
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      )}
    </div>
  );
};

export default FollowupAutomation;
