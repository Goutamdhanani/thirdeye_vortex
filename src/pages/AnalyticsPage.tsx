import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  MailOutlined,
  EyeOutlined,
  MessageOutlined,
  UserAddOutlined,
} from '@ant-design/icons';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Emails Sent"
              value={1234}
              prefix={<MailOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Open Rate"
              value={45.2}
              suffix="%"
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Reply Rate"
              value={12.5}
              suffix="%"
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Opportunities Created"
              value={28}
              prefix={<UserAddOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <div className="mt-6">
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card title="Campaign Performance">
              {/* Add campaign performance chart here */}
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Response Rates">
              {/* Add response rates chart here */}
            </Card>
          </Col>
        </Row>
      </div>

      <div className="mt-6">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="Email Activity Timeline">
              {/* Add email activity timeline here */}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AnalyticsPage;
