import { createBrowserRouter } from 'react-router-dom';
import AppShellLayout from './layout/AppShellLayout';
import Home from './pages/home';
import CryptoDetail from './pages/coindetail/index';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShellLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'coin/:id',
        element: <CryptoDetail />,
      },
    ],
  },
]);
