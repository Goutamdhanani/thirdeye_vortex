import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CampaignsPage from './pages/CampaignsPage';
import NewCampaignPage from './pages/NewCampaignPage';
import SettingsPage from './pages/SettingsPage';
import LeadsPage from './pages/LeadsPage';
import TemplatesPage from './pages/TemplatesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import EditCampaignPage from './pages/EditCampaignPage';
import CampaignPage from './pages/CampaignPage';
import MailPage from './pages/MailPage'; // Import the new MailPage
import MailSettingsPage from './pages/MailSettingsPage';
import MailDashboardPage from './pages/MailDashboardPage';

const { Content } = Layout;

// Main Layout Component
const MainLayout: React.FC = ({ children }) => {
  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout>
        <Content className="bg-gray-50 p-6">{children}</Content>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/campaigns"
          element={
            <MainLayout>
              <CampaignsPage />
            </MainLayout>
          }
        />
        <Route
          path="/campaigns/new"
          element={
            <MainLayout>
              <NewCampaignPage />
            </MainLayout>
          }
        />
        <Route
          path="/campaigns/:id"
          element={
            <MainLayout>
              <CampaignDetailPage />
            </MainLayout>
          }
        />
        <Route
          path="/campaigns/:id/edit"
          element={
            <MainLayout>
              <EditCampaignPage />
            </MainLayout>
          }
        />
        <Route
          path="/leads"
          element={
            <MainLayout>
              <LeadsPage />
            </MainLayout>
          }
        />
        <Route
          path="/campaign"
          element={
            <MainLayout>
              <CampaignPage />
            </MainLayout>
          }
        />
        <Route
          path="/templates"
          element={
            <MainLayout>
              <TemplatesPage />
            </MainLayout>
          }
        />
        <Route
          path="/analytics"
          element={
            <MainLayout>
              <AnalyticsPage />
            </MainLayout>
          }
        />
        <Route
          path="/mail"
          element={
            <MainLayout>
              <MailDashboardPage />
            </MainLayout>
          }
        />
        <Route
          path="/mail-settings"
          element={
            <MainLayout>
              <MailSettingsPage />
            </MainLayout>
          }
        />
        <Route
          path="/mail-settings/:id"
          element={
            <MainLayout>
              <MailSettingsPage />
            </MainLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <MainLayout>
              <SettingsPage />
            </MainLayout>
          }
        />
      </Routes>
    
  );
};

export default App;