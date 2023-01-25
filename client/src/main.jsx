// React dependencies
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

// Context provider
import UserProvider from 'contexts/UserProvider.jsx';

// Components
import Home from 'pages/home';
import Auth from 'pages/auth';
import Book from 'pages/book';
import Account from 'pages/account';
import Admin from 'pages/admin';
import Dashboard from 'pages/admin/dashboard';
import Layout from 'layouts/layout';

// Import global styles
import 'styles/main.scss';
import AdminLayout from 'layouts/adminLayout';

// Router paths
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: '/account',
    element: (
      <Layout>
        <Account />
      </Layout>
    ),
  },
  {
    path: '/book/:id',
    element: (
      <Layout>
        <Book />
      </Layout>
    )
  },
  {
    path: '/auth/:type',
    element: <Auth />,
  },
  {
    path: '/admin',
    element: <Admin />,
  },
  {
    path: '/admin/dashboard',
    element: (
      <AdminLayout>
        <Dashboard />
      </AdminLayout>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserProvider currentUser={null}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </UserProvider>,
);
