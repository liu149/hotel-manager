import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './Login.scss';
import { Button, Form, Input } from 'antd';
import { $login } from '../../api/adminApi';
import { useNotification } from '../../components/NotificationProvider';
import { setUser } from '../../features/user/userSlice';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const notify = useNotification();

  const handleLoginSuccess = () => {
    const { from } = location.state || { from: '/' };
    navigate(from);
  };

  const onFinish = async (values) => {
    try {
      const res = await $login(values);
      console.log('Login successful:', res);
      notify('success', 'Login Successful', 'You have successfully logged in!', 3); // 添加持续时间参数，这里设置为3秒
      
      // 保存token
      localStorage.setItem('token', res.token);
      
      // 将用户信息存储到Redux
      dispatch(setUser({
        username: res.username,
        email: res.email,
        token: res.token,
        expirationTime: res.expirationTime
      }));
      
      // 跳转页面
      console.log("navigate to home");
      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
      notify('error', 'Login Failed', error.message || 'An error occurred during login. Please try again.', 3); // 同样添加持续时间参数
    }
  };

  return (
    <div className="login">
      <div className="content">
        <h2>hotel manager</h2>
        <Form
          name="basic"
          form={form}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          initialValues={{
            username: '',
            password: '',
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 6,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button
              style={{ marginLeft: '10px' }}
              onClick={() => {
                form.resetFields();
              }}
            >
              Reset
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
