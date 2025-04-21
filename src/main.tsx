import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import DocumentEditor from './pages/DocumentEditor';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import { DocumentProvider } from './context/DocumentContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'editor',
        element: <DocumentEditor />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DocumentProvider>
      <RouterProvider router={router} />
    </DocumentProvider>
  </StrictMode>
);