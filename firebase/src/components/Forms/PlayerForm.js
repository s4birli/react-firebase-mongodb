import React from "react";
import { Form, Input, Space, DatePicker, Select } from "antd";
import useResetFormOnCloseModal from "./useResetForm";
const { Option } = Select;

const PlayerForm = ({ form, onFinish, visible, teams }) => {
  useResetFormOnCloseModal({
    form,
    visible,
  });

  return (
    <Form form={form} layout="vertical" name="playerForm" onFinish={onFinish}>
      <Space align="baseline">
        <Form.Item
          name="name"
          label="First Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="last_name" label="Last Name">
          <Input />
        </Form.Item>
      </Space>
      <Space align="baseline">
        <Form.Item
          name="birthday"
          label="Date of Birth"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="nationality"
          label="Nationality"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Space>
      <Form.Item
        name="position"
        label="Position"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          mode="multiple"
          allowClear
          style={{ width: "100%" }}
          placeholder="Please select"
          defaultValue={[]}
        >
          <Option key={"cf"}>CF</Option>
          <Option key={"lmf"}>LMF</Option>
          <Option key={"rmf"}>RMF</Option>
        </Select>
      </Form.Item>
      <Form.Item name="team" label="Team">
        <Select
          allowClear
          style={{ width: "100%" }}
          placeholder="Please select"
          defaultValue={[]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          {teams.map((team) => (
            <Option key={team._id}>{team.name}</Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default PlayerForm;
