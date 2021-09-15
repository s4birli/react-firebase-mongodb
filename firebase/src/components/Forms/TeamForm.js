import React from 'react';
import { Form, Input, Space, DatePicker, Select } from 'antd';
import useResetFormOnCloseModal from './useResetForm';
const { Option } = Select;

const TeamForm = ({ form, onFinish, visible, players }) => {
  useResetFormOnCloseModal({
    form,
    visible
  });

  return (
    <Form form={form} layout="vertical" name="playerForm" onFinish={onFinish}>
      <Space align="baseline">
        <Form.Item
          name="name"
          label="Team Name"
          rules={[
            {
              required: true
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="nationality"
          label="Nationality"
          rules={[
            {
              required: true
            }
          ]}
        >
          <Input />
        </Form.Item>
      </Space>
      <Form.Item name="players" label="Players">
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Please select"
          defaultValue={[]}
        >
          {players.map((player) => (
            <Option key={player._id}>{player.name}</Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default TeamForm;
