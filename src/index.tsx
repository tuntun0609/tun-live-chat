import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { ConfigProvider } from 'antd';
import dayjs from 'dayjs';

import 'dayjs/locale/zh-cn';
// import zhCN from '../node_modules/antd/locale/zh_CN';
import './reset.css';

import { ErrorPage, ChatPage, SettingPage } from './pages';

dayjs.locale('zh-cn');

const router = createBrowserRouter([
  {
    path: '/',
    element: <SettingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/chat',
    element: <ChatPage />,
    errorElement: <ErrorPage />,
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider
      // locale={zhCN}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  </React.StrictMode>,
)
