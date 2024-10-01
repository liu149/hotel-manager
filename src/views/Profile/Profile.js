import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Row, Col, Avatar, Descriptions } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './Profile.css';  // Corrected import statement

const Profile = () => {
  const user = useSelector((state) => state.user);

  return (
    <div className="profile-container">
      <Row justify="center">
        <Col span={12}>
          <Card title="个人信息" bordered={false}>
            <Row align="middle" gutter={[16, 16]}>
              <Col>
                <Avatar size={64} icon={<UserOutlined />} />
              </Col>
              <Col>
                <Descriptions column={1}>
                  <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
                  <Descriptions.Item label="邮箱">{user.email}</Descriptions.Item>
                  {/* Add more user details as needed */}
                </Descriptions>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
