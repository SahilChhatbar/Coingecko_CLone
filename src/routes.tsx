import { createBrowserRouter } from 'react-router-dom'
import Appshell from './layout/Appshell'
import Table from './pages/cryptocurrency table'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Appshell />,
    children: [
      {
        index: true,
        element: <Table />,
      },
    ],
  },
])