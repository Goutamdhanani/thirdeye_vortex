import React from 'react';
import { Form, Input, Card } from 'antd';
import type { Campaign } from '../../../types/campaign';

interface Props {
  data: Partial<Campaign>;
  onUpdate: (data: Partial<Campaign>) => void;
}

const ContentCreation: React.FC<Props> = ({ data, onUpdate }) => {
  const [form] = Form.useForm();

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    onUpdate({ ...data, content: values });
  };

  return (
    <Card title="Content Creation">
      <Form
        form={form}
        layout="vertical"
        initialValues={data.content}
        onValuesChange={handleFormChange}
      >
        <Form.Item
          label="Email Subject"
          name="subject"
          rules={[{ required: true, message: 'Please enter the email subject' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email Content"
          name="content"
          rules={[{ required: true, message: 'Please enter the email content' }]}
        >
          <Input.TextArea rows={6} />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ContentCreation;