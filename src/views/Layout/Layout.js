import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  HomeOutlined,
  NotificationOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons';
import { Button, Layout, Menu, Modal, theme } from 'antd';
import './Layout.scss';
import { Outlet, useNavigate } from 'react-router-dom';
import { useNotification } from '../../components/NotificationProvider';

const { Header, Sider, Content } = Layout;

const MyLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const { confirm } = Modal;

  const notify = useNotification();

  const menuList = [
    {
      key: 'account',
      icon: <UserOutlined />,
      label: '账户管理',
      children: [
        {
          key: 'role',
          label: '角色管理',
        },
      ],
    },
    {
      key: '2',
      icon: <VideoCameraOutlined />,
      label: '客房管理',
    },
    {
      key: 'user',
      icon: <UploadOutlined />,
      label: '用户管理',
    },
  ];

  const [current, setCurrent] = useState('mail');

  const items = [
    {
      label: '首页',
      key: 'home',
      icon: <HomeOutlined />,
    },
    {
      label: '邮件',
      key: 'mail',
      icon: <MailOutlined />,
    },
    {
      label: '通知',
      key: 'notification',
      icon: <NotificationOutlined />,
    },
    {
      label: '个人中心',
      key: 'SubMenu',
      icon: <UserOutlined />,
      children: [
        {
          type: 'item',
          key: 'profile',
          label: '个人信息',
        },
        {
          type: 'item',
          key: 'password',
          label: '修改密码',
        },
        {
          type: 'item',
          key: 'exit',
          label: '退出系统',
        },
      ],
    },
  ];

  const onClickMenu = (e) => {
    setCurrent(e.key);
    switch (e.key) {
      case 'exit':
        confirm({
          title: '确认退出?',
          okText: '确认',
          cancelText: '取消',
          icon: <ExclamationCircleFilled />,
          content: 'Some descriptions',
          onOk() {
            localStorage.removeItem('token');
            notify('success', '操作成功', '你已成功完成操作！');
            navigate('/');
          },
          onCancel() {
            console.log('Cancel');
          },
        });
        break;
      case 'role':
        navigate('/home/role');
        break;
      case 'user':
        navigate('/home/user');
        break;
      case 'profile': // New case for profile
        navigate('/home/profile');
        break;
      default:
        break;
    }
  };

  return (
    <Layout className="layout">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">{collapsed ? '酒店' : '酒店管理系统'}</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[current]}
          onClick={onClickMenu}
          items={menuList}
        />
      </Sider>
      <Layout>
        <Header className="header">
          <Button
            type="text"
            className="trigger"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Menu
            theme="dark"
            onClick={onClickMenu}
            className="menu"
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
          />
        </Header>
        <Content className="content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MyLayout;
