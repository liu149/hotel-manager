import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Button, Modal, Form, Input, message } from 'antd';
import request from '../../utils/request';  // Import the custom axios instance
import { useNavigate, useLocation } from 'react-router-dom';

function Role(props) {
  const [roles, setRoles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRole, setEditingRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
          <Space size="middle">
            <Button onClick={() => showEditModal(record)}>Edit</Button>
            <Button danger onClick={() => showDeleteConfirm(record)}>Delete</Button>
          </Space>
      ),
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if there's no token
      navigate('/login');
      return;
    }

    request.get('/roles', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        const rolesWithKeys = response.data.data.map(role => ({
          ...role,
          key: role.id
        }));
        setRoles(
          rolesWithKeys
        );
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
        if (error.response && error.response.status === 401) {
          // Save the current location before redirecting
          navigate('/', { state: { from: location.pathname } });
        }
      });
  }, [navigate, location]);

  const showModal = () => {
    setEditingRole(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (role) => {
    setEditingRole(role);
    form.setFieldsValue(role);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingRole) {
        const updatedValues = { ...values, id: editingRole.id };
        console.log(updatedValues);
        updateRole(updatedValues);
      } else {
        createRole(values);
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const createRole = (values) => {
    request.post('/roles', values, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then((response) => {
        setRoles([...roles, { ...response.data.data, key: response.data.data.id }]);
        setIsModalVisible(false);
        message.success('Role created successfully');
      })
      .catch((error) => {
        console.error('Error creating role:', error);
        message.error('Failed to create role');
      });
  };

  const updateRole = (values) => {
    request.put(`/roles/${values.id}`, values, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then((response) => {
        setRoles(roles.map(role => role.id === values.id ? { ...response.data.data, key: response.data.data.id } : role));
        setIsModalVisible(false);
        message.success('Role updated successfully');
      })
      .catch((error) => {
        console.error('Error updating role:', error);
        message.error('Failed to update role');
      });
  };

  const showDeleteConfirm = (role) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this role?',
      content: `Role: ${role.name}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteRole(role.id);
      },
    });
  };

  const deleteRole = (id) => {
    request.delete(`/roles/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(() => {
        setRoles(roles.filter(role => role.id !== id));
        message.success('Role deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting role:', error);
        message.error('Failed to delete role');
      });
  };

  return (
    <>
      <Button onClick={showModal} type="primary" style={{ marginBottom: 16 }}>
        Add New Role
      </Button>
      <Table columns={columns} dataSource={roles} />
      <Modal
        title={editingRole ? "Edit Role" : "Create New Role"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Role;
