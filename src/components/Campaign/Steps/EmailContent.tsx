import React, { useState } from 'react';
import { Form, Input, Card, Select, Button, Alert, Tabs } from 'antd';
import type { Campaign, EmailTemplate } from '../../../types/campaign';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface Props {
  data: Partial<Campaign>;
  onUpdate: (data: Partial<Campaign>) => void;
}

const EmailContent: React.FC<Props> = ({ data, onUpdate }) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('design');
  const [spamScore, setSpamScore] = useState(0);

  // Mock templates (replace with API call)
  const templates: EmailTemplate[] = [
    {
      id: '1',
      name: 'Initial Outreach',
      subject: 'Quick question about {{company}}',
      content: 'Hi {{name}},\n\nI noticed that {{company}} is doing great work in...',
      variables: ['name', 'company'],
      category: 'initial',
    },
    {
      id: '2',
      name: 'Follow-up Template',
      subject: 'Following up on my previous email',
      content: 'Hi {{name}},\n\nI wanted to follow up on my previous email...',
      variables: ['name'],
      category: 'followup',
    },
  ];

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    const template: EmailTemplate = {
      id: Date.now().toString(),
      name: values.name,
      subject: values.subject,
      content: values.content,
      htmlContent: values.htmlContent,
      variables: detectVariables(values.content),
      category: 'custom',
    };
    
    onUpdate({ template });
    checkSpamScore(values.subject, values.content);
  };

  const detectVariables = (content: string): string[] => {
    const matches = content.match(/{{([^}]+)}}/g) || [];
    return matches.map(match => match.slice(2, -2).trim());
  };

  const checkSpamScore = (subject: string, content: string) => {
    // Mock spam checking logic
    let score = 0;
    const spamTriggers = ['free', 'guarantee', 'unlimited', 'urgent', 'act now'];
    const fullText = (subject + ' ' + content).toLowerCase();

    spamTriggers.forEach(trigger => {
      if (fullText.includes(trigger)) score += 1;
    });

    // Check for excessive capitalization
    const capsRatio = (fullText.match(/[A-Z]/g) || []).length / fullText.length;
    if (capsRatio > 0.3) score += 2;

    setSpamScore(score);
  };

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Design Email" key="design">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              name: data.template?.name,
              subject: data.template?.subject,
              content: data.template?.content,
              htmlContent: data.template?.htmlContent,
            }}
            onValuesChange={handleFormChange}
          >
            <div className="mb-6">
              <Select
                className="w-full"
                placeholder="Load from template"
                onChange={(templateId) => {
                  const template = templates.find(t => t.id === templateId);
                  if (template) {
                    form.setFieldsValue({
                      name: template.name,
                      subject: template.subject,
                      content: template.content,
                    });
                    handleFormChange();
                  }
                }}
              >
                {templates.map(template => (
                  <Option key={template.id} value={template.id}>
                    {template.name}
                  </Option>
                ))}
              </Select>
            </div>

            <Form.Item
              label="Template Name"
              name="name"
              rules={[{ required: true, message: 'Please enter a template name' }]}
            >
              <Input placeholder="e.g., Initial Outreach Template" />
            </Form.Item>

            <Form.Item
              label="Subject Line"
              name="subject"
              rules={[{ required: true, message: 'Please enter a subject line' }]}
            >
              <Input placeholder="e.g., Quick question about {{company}}" />
            </Form.Item>

            <Form.Item
              label="Email Content"
              name="content"
              rules={[{ required: true, message: 'Please enter email content' }]}
            >
              <TextArea
                rows={10}
                placeholder="Use {{name}}, {{company}}, etc. for personalization"
              />
            </Form.Item>

            {spamScore > 0 && (
              <Alert
                message="Spam Score Warning"
                description={`Your email has a spam score of ${spamScore}. Consider revising to improve deliverability.`}
                type={spamScore > 2 ? "warning" : "info"}
                showIcon
                className="mb-4"
              />
            )}

            <Card title="Available Variables" size="small" className="mb-4">
              <div className="flex flex-wrap gap-2">
                {detectVariables(form.getFieldValue('content')).map(variable => (
                  <Tag key={variable} color="blue">{`{{${variable}}}`}</Tag>
                ))}
              </div>
            </Card>
          </Form>
        </TabPane>

        <TabPane tab="HTML Editor" key="html">
          <Alert
            message="Advanced Editor"
            description="Use HTML to create more sophisticated email templates with custom styling."
            type="info"
            showIcon
            className="mb-4"
          />
          <Form.Item name="htmlContent">
            <TextArea
              rows={20}
              placeholder="<html><body>Your HTML content here...</body></html>"
            />
          </Form.Item>
        </TabPane>

        <TabPane tab="Preview" key="preview">
          <Card title="Desktop Preview" className="mb-4">
            <div className="border p-4 rounded">
              <h3 className="font-medium">{form.getFieldValue('subject')}</h3>
              <div className="whitespace-pre-wrap mt-4">
                {form.getFieldValue('content')}
              </div>
            </div>
          </Card>

          <Card title="Mobile Preview">
            <div className="border p-4 rounded max-w-sm mx-auto">
              <h3 className="font-medium">{form.getFieldValue('subject')}</h3>
              <div className="whitespace-pre-wrap mt-4">
                {form.getFieldValue('content')}
              </div>
            </div>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default EmailContent;
