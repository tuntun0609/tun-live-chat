import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import { ErrorPage, ChatPage, SettingPage } from './pages';
import './index.css';

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
    <RouterProvider router={router} />
  </React.StrictMode>,
)
