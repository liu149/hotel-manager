import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Button, Modal, Form, Input, message } from 'antd';
import request from '../../utils/request';  // Import the custom axios instance
import { useNavigate, useLocation } from 'react-router-dom';

function User() {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUsers = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    request.get('/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        const usersWithKeys = response.data.data.map(user => ({
          ...user,
          key: user.id
        }));
        setUsers(usersWithKeys);
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
        if (error.response && error.response.status === 401) {
          navigate('/', { state: { from: location.pathname } });
        }
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [navigate, location]);

  const showModal = (user = null) => {
    setEditingUser(user);
    setIsModalVisible(true);
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem('token');
      if (editingUser) {
        await request.put(`/users/${editingUser.id}`, values, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        message.success('用户更新成功');
      } else {
        await request.post('/users', values, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        message.success('用户创建成功');
      }
      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await request.delete(`/users/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      message.success('用户删除成功');
      fetchUsers();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => showModal(record)}>编辑</Button>
          <Button danger onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 16 }}>
        添加用户
      </Button>
      <Table columns={columns} dataSource={users} rowKey="id" />
      <Modal
        title={editingUser ? "编辑用户" : "添加用户"}
        open={isModalVisible}  // 将 visible 改为 open
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          {!editingUser && (
            <Form.Item name="password" label="密码" rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default User;
