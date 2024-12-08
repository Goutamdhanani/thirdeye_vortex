import React, { useState } from 'react';
import { Button, Card, List, Space, Modal, Input, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
}

const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);

  const handleNewTemplate = () => {
    setCurrentTemplate(null);
    setIsModalVisible(true);
  };

  const handleEditTemplate = (template: Template) => {
    setCurrentTemplate(template);
    setIsModalVisible(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    Modal.confirm({
      title: 'Delete Template',
      content: 'Are you sure you want to delete this template?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        setTemplates(templates.filter(t => t.id !== templateId));
        message.success('Template deleted successfully');
      },
    });
  };

  const handleSaveTemplate = (values: any) => {
    if (currentTemplate) {
      // Edit existing template
      setTemplates(templates.map(t => 
        t.id === currentTemplate.id ? { ...t, ...values } : t
      ));
      message.success('Template updated successfully');
    } else {
      // Add new template
      setTemplates([...templates, { 
        id: Date.now().toString(),
        ...values 
      }]);
      message.success('Template created successfully');
    }
    setIsModalVisible(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Email Templates</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleNewTemplate}
        >
          New Template
        </Button>
      </div>

      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={templates}
        renderItem={template => (
          <List.Item>
            <Card
              title={template.name}
              extra={
                <Space>
                  <Button 
                    type="text" 
                    icon={<EditOutlined />}
                    onClick={() => handleEditTemplate(template)}
                  />
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteTemplate(template.id)}
                  />
                </Space>
              }
            >
              <p className="font-medium mb-2">{template.subject}</p>
              <p className="text-gray-600 truncate">{template.content}</p>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title={currentTemplate ? 'Edit Template' : 'New Template'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSaveTemplate}
      >
        <Space direction="vertical" className="w-full">
          <Input placeholder="Template Name" />
          <Input placeholder="Email Subject" />
          <Input.TextArea 
            placeholder="Email Content" 
            rows={6}
          />
        </Space>
      </Modal>
    </div>
  );
};

export default TemplatesPage;
