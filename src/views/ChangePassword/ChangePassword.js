import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import request from '../../utils/request';
import './ChangePassword.scss';

const ChangePassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await request.put('/users/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      message.success('密码修改成功');
      navigate('/home');
    } catch (error) {
      message.error('密码修改失败: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="change-password-container">
      <Form
        form={form}
        name="change-password"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="currentPassword"
          label="当前密码"
          rules={[{ required: true, message: '请输入当前密码' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[
            { required: true, message: '请输入新密码' },
            { min: 6, message: '密码长度不能少于6个字符' }
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="确认新密码"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: '请确认新密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            修改密码
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;