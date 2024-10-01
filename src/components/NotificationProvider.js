// NotificationProvider.js
import React, { createContext, useContext } from 'react';
import { notification } from 'antd';

// 创建一个上下文来提供 notification API
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  // 封装通知方法，添加duration参数
  const notify = (type, message, description, duration = 4.5) => {
    api[type]({
      message: message || 'Notification Title',
      description: description || 'This is the content of the notification.',
      duration: duration, // 使用传入的duration参数，默认为4.5秒（Ant Design的默认值）
    });
  };

  return (
    <NotificationContext.Provider value={notify}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

// 自定义 Hook，用于其他组件中访问通知功能
export const useNotification = () => {
  return useContext(NotificationContext);
};
