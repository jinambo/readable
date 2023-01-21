// React dependencies
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

// Components
import Home from 'pages/home';
import Auth from 'pages/auth';
import Book from 'pages/book';
import Layout from 'layouts/layout';

// Import global styles
import 'styles/main.scss';

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
    path: '/auth/:type',
    element: <Auth />,
  },
  {
    path: '/book/:id',
    element: (
      <Layout>
        <Book />
      </Layout>
    )
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
