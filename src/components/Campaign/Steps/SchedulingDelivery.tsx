import React from 'react';
import { Form, DatePicker, TimePicker, Select, InputNumber, Switch, Card, Alert } from 'antd';
import type { Campaign, ScheduleSettings } from '../../../types/campaign';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;
const { RangePicker } = DatePicker;

interface Props {
  data: Partial<Campaign>;
  onUpdate: (data: Partial<Campaign>) => void;
}

const SchedulingDelivery: React.FC<Props> = ({ data, onUpdate }) => {
  const [form] = Form.useForm();

  const timeZones = Intl.supportedValuesOf('timeZone');
  const workingDays = [
    { label: 'Monday', value: 1 },
    { label: 'Tuesday', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
    { label: 'Saturday', value: 6 },
    { label: 'Sunday', value: 0 },
  ];

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    const schedule: ScheduleSettings = {
      startDate: values.dateRange[0].toDate(),
      endDate: values.dateRange[1].toDate(),
      timeZone: values.timeZone,
      sendingSpeed: {
        emailsPerHour: values.emailsPerHour,
        batchSize: values.batchSize,
        delayBetweenBatches: values.delayBetweenBatches,
      },
      optimizeDeliveryTime: values.optimizeDeliveryTime,
      workingHours: {
        start: values.workingHours[0].format('HH:mm'),
        end: values.workingHours[1].format('HH:mm'),
        days: values.workingDays,
      },
    };
    onUpdate({ schedule });
  };

  const calculateDailyLimit = () => {
    const values = form.getFieldsValue();
    const hoursPerDay = dayjs(values.workingHours[1]).diff(dayjs(values.workingHours[0]), 'hour', true);
    return Math.floor(values.emailsPerHour * hoursPerDay);
  };

  return (
    <div className="max-w-3xl">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          dateRange: [dayjs(), dayjs().add(7, 'days')],
          timeZone: dayjs.tz.guess(),
          emailsPerHour: 50,
          batchSize: 10,
          delayBetweenBatches: 5,
          optimizeDeliveryTime: true,
          workingHours: [dayjs('09:00', 'HH:mm'), dayjs('17:00', 'HH:mm')],
          workingDays: [1, 2, 3, 4, 5],
        }}
        onValuesChange={handleFormChange}
      >
        <Card title="Campaign Schedule" className="mb-6">
          <Form.Item
            label="Campaign Duration"
            name="dateRange"
            rules={[{ required: true, message: 'Please select campaign duration' }]}
          >
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label="Time Zone"
            name="timeZone"
            rules={[{ required: true, message: 'Please select a time zone' }]}
          >
            <Select
              showSearch
              placeholder="Select campaign time zone"
              filterOption={(input, option) =>
                option?.children.toString().toLowerCase().includes(input.toLowerCase())
              }
            >
              {timeZones.map(tz => (
                <Option key={tz} value={tz}>{tz}</Option>
              ))}
            </Select>
          </Form.Item>
        </Card>

        <Card title="Sending Speed" className="mb-6">
          <Alert
            message="Sending Speed Configuration"
            description="Configure these settings carefully to maintain good deliverability and avoid being marked as spam."
            type="info"
            showIcon
            className="mb-4"
          />

          <Form.Item
            label="Emails per Hour"
            name="emailsPerHour"
            rules={[{ required: true, message: 'Please set emails per hour' }]}
          >
            <InputNumber min={1} max={200} className="w-full" />
          </Form.Item>

          <Form.Item
            label="Batch Size"
            name="batchSize"
            help="Number of emails to send in each batch"
            rules={[{ required: true, message: 'Please set batch size' }]}
          >
            <InputNumber min={1} max={50} className="w-full" />
          </Form.Item>

          <Form.Item
            label="Delay Between Batches (minutes)"
            name="delayBetweenBatches"
            rules={[{ required: true, message: 'Please set delay between batches' }]}
          >
            <InputNumber min={1} max={60} className="w-full" />
          </Form.Item>
        </Card>

        <Card title="Working Hours" className="mb-6">
          <Form.Item
            label="Optimize Delivery Time"
            name="optimizeDeliveryTime"
            valuePropName="checked"
            help="Send emails during recipient's working hours based on their timezone"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Working Hours"
            name="workingHours"
            rules={[{ required: true, message: 'Please set working hours' }]}
          >
            <TimePicker.RangePicker format="HH:mm" className="w-full" />
          </Form.Item>

          <Form.Item
            label="Working Days"
            name="workingDays"
            rules={[{ required: true, message: 'Please select working days' }]}
          >
            <Select
              mode="multiple"
              placeholder="Select working days"
            >
              {workingDays.map(day => (
                <Option key={day.value} value={day.value}>
                  {day.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Card>

        <Card>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Daily Email Limit</h3>
              <p className="text-gray-600">
                Based on your settings, you'll send approximately {calculateDailyLimit()} emails per day
              </p>
            </div>
            <Alert
              message={`${calculateDailyLimit()} emails/day`}
              type="info"
              showIcon
            />
          </div>
        </Card>
      </Form>
    </div>
  );
};

export default SchedulingDelivery;
