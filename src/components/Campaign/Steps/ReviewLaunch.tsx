import React, { useState } from 'react';
import { Card, Button, Alert, List, Tag, Timeline, Progress, Descriptions } from 'antd';
import { CheckCircleOutlined, WarningOutlined, LoadingOutlined } from '@ant-design/icons';
import type { Campaign } from '../../../types/campaign';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  data: Partial<Campaign>;
  onLaunch: () => void;
}

const ReviewLaunch: React.FC<Props> = ({ data, onLaunch }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [checkResults, setCheckResults] = useState<{
    passed: string[];
    warnings: string[];
    errors: string[];
  }>({
    passed: [],
    warnings: [],
    errors: [],
  });

  const performPreflightChecks = async () => {
    setIsChecking(true);
    
    // Simulate API checks
    await new Promise(resolve => setTimeout(resolve, 1500));

    const results = {
      passed: [
        'Domain authentication verified',
        'Sender profile active',
        'Email template valid',
      ],
      warnings: data.abTest?.enabled ? [] : ['A/B testing disabled - consider testing for better results'],
      errors: [] as string[],
    };

    // Check required fields
    if (!data.template?.subject) {
      results.errors.push('Email subject is required');
    }
    if (!data.template?.content) {
      results.errors.push('Email content is required');
    }
    if (!data.leads || data.leads.length === 0) {
      results.errors.push('No recipients selected');
    }
    if (!data.schedule?.startDate) {
      results.errors.push('Campaign schedule not set');
    }

    setCheckResults(results);
    setIsChecking(false);
  };

  const renderStatus = () => {
    if (checkResults.errors.length > 0) {
      return (
        <Alert
          message="Campaign Not Ready"
          description="Please fix the errors below before launching"
          type="error"
          showIcon
          className="mb-6"
        />
      );
    }
    if (checkResults.warnings.length > 0) {
      return (
        <Alert
          message="Campaign Ready (with Warnings)"
          description="You can proceed, but consider addressing the warnings below"
          type="warning"
          showIcon
          className="mb-6"
        />
      );
    }
    if (checkResults.passed.length > 0) {
      return (
        <Alert
          message="Campaign Ready to Launch"
          description="All checks passed successfully"
          type="success"
          showIcon
          className="mb-6"
        />
      );
    }
    return null;
  };

  return (
    <div className="max-w-3xl">
      <Card className="mb-6">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-4">Campaign Review</h2>
          <Button
            type="primary"
            size="large"
            loading={isChecking}
            onClick={performPreflightChecks}
          >
            Run Pre-flight Checks
          </Button>
        </div>
      </Card>

      {renderStatus()}

      <Card title="Campaign Summary" className="mb-6">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Campaign Name">
            {data.name || 'Untitled Campaign'}
          </Descriptions.Item>
          <Descriptions.Item label="Recipients">
            {data.leads?.length || 0} leads selected
          </Descriptions.Item>
          <Descriptions.Item label="Schedule">
            {data.schedule ? (
              <>
                Starts: {dayjs(data.schedule.startDate).format('MMMM D, YYYY h:mm A')}
                <br />
                Time Zone: {data.schedule.timeZone}
              </>
            ) : (
              'Not scheduled'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="A/B Testing">
            {data.abTest?.enabled ? (
              <>
                Testing: {data.abTest.type}
                <br />
                Variants: {data.abTest.variants?.length || 0}
                <br />
                Duration: {data.abTest.testDuration} hours
              </>
            ) : (
              'Disabled'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Follow-ups">
            {data.followUpRules?.length || 0} automated follow-ups configured
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card title="Pre-flight Checks">
          {isChecking ? (
            <div className="text-center py-4">
              <LoadingOutlined style={{ fontSize: 24 }} />
              <p className="mt-2">Running checks...</p>
            </div>
          ) : (
            <List
              size="small"
              dataSource={[
                ...checkResults.passed.map(item => ({ text: item, type: 'success' })),
                ...checkResults.warnings.map(item => ({ text: item, type: 'warning' })),
                ...checkResults.errors.map(item => ({ text: item, type: 'error' })),
              ]}
              renderItem={item => (
                <List.Item>
                  {item.type === 'success' && <CheckCircleOutlined className="text-green-500 mr-2" />}
                  {item.type === 'warning' && <WarningOutlined className="text-yellow-500 mr-2" />}
                  {item.type === 'error' && <WarningOutlined className="text-red-500 mr-2" />}
                  {item.text}
                </List.Item>
              )}
            />
          )}
        </Card>

        <Card title="Campaign Timeline">
          <Timeline>
            <Timeline.Item>
              Campaign Start
              <br />
              <small>
                {dayjs(data.schedule?.startDate).format('MMMM D, YYYY h:mm A')}
              </small>
            </Timeline.Item>
            {data.abTest?.enabled && (
              <Timeline.Item>
                A/B Test Winner Selection
                <br />
                <small>
                  After {data.abTest.testDuration} hours
                </small>
              </Timeline.Item>
            )}
            {data.followUpRules?.map((rule, index) => (
              <Timeline.Item key={rule.id}>
                Follow-up #{index + 1}: {rule.name}
                <br />
                <small>
                  {rule.trigger.delay} {rule.trigger.delayUnit} after{' '}
                  {rule.trigger.type === 'no_response' ? 'no response' : rule.trigger.type}
                </small>
              </Timeline.Item>
            ))}
            <Timeline.Item>
              Campaign End
              <br />
              <small>
                {dayjs(data.schedule?.endDate).format('MMMM D, YYYY h:mm A')}
              </small>
            </Timeline.Item>
          </Timeline>
        </Card>
      </div>

      <Card>
        <div className="text-center">
          <Button
            type="primary"
            size="large"
            disabled={checkResults.errors.length > 0 || isChecking}
            onClick={onLaunch}
          >
            Launch Campaign
          </Button>
          {checkResults.errors.length > 0 && (
            <p className="text-red-500 mt-2">
              Please fix all errors before launching
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ReviewLaunch;
