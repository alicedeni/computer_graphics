import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Main from './pages/MainPage';
import ErrorPage404 from './pages/ErrorPage404';

import "./scss/main.scss";

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "*",
    element: <ErrorPage404 />
  },
  {
    path: '/',
    element: <Main />
  }
]);

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);