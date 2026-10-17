import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { RegistrationScreen } from './components/RegistrationScreen';
import { SuccessScreen } from './components/SuccessScreen';
import { MainPortal } from './components/MainPortal';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { DatabaseInfoModal } from './components/DatabaseInfoModal';
import { RegistrationResponse } from './types';

type Screen = 'welcome' | 'register' | 'success' | 'portal' | 'admin-login' | 'admin-dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [registrationData, setRegistrationData] = useState<RegistrationResponse['data'] | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminUsername, setAdminUsername] = useState<string>('admin');
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);

  // Check existing admin session on initial load
  useEffect(() => {
    const savedToken = sessionStorage.getItem('welcome_gift_admin_token');
    const savedUser = sessionStorage.getItem('welcome_gift_admin_user');

    if (savedToken) {
      // Verify token with backend
      fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => {
          if (res.ok) {
            setAdminToken(savedToken);
            if (savedUser) setAdminUsername(savedUser);
          } else {
            sessionStorage.removeItem('welcome_gift_admin_token');
            sessionStorage.removeItem('welcome_gift_admin_user');
          }
        })
        .catch(() => {
          // Keep in state or handle gracefully
        });
    }
  }, []);

  const handleAdminLoginSuccess = (token: string, username: string) => {
    setAdminToken(token);
    setAdminUsername(username);
    sessionStorage.setItem('welcome_gift_admin_token', token);
    sessionStorage.setItem('welcome_gift_admin_user', username);
    setCurrentScreen('admin-dashboard');
  };

  const handleAdminLogout = async () => {
    if (adminToken) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminToken}` },
        });
      } catch (e) {
        // Ignore network errors on logout
      }
    }
    setAdminToken(null);
    sessionStorage.removeItem('welcome_gift_admin_token');
    sessionStorage.removeItem('welcome_gift_admin_user');
    setCurrentScreen('welcome');
  };

  const handleRegistrationSuccess = (data: RegistrationResponse['data']) => {
    setRegistrationData(data);
    setCurrentScreen('success');
  };

  return (
    <div className="min-h-screen bg-[#EAF7FF] text-[#17243A] flex flex-col font-sans selection:bg-[#FF5C93] selection:text-white">
      {/* Dynamic Screen Routing */}
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          onContinue={() => setCurrentScreen('register')}
          onOpenAdmin={() =>
            setCurrentScreen(adminToken ? 'admin-dashboard' : 'admin-login')
          }
          onOpenDbInfo={() => setIsDbModalOpen(true)}
        />
      )}

      {currentScreen === 'register' && (
        <RegistrationScreen
          onBack={() => setCurrentScreen('welcome')}
          onSuccess={handleRegistrationSuccess}
        />
      )}

      {currentScreen === 'success' && (
        <SuccessScreen
          registrationData={registrationData}
          onOpenGiftWebsite={() => setCurrentScreen('portal')}
          onReset={() => {
            setRegistrationData(null);
            setCurrentScreen('register');
          }}
          onOpenAdmin={() =>
            setCurrentScreen(adminToken ? 'admin-dashboard' : 'admin-login')
          }
        />
      )}

      {currentScreen === 'portal' && (
        <MainPortal
          displayName={registrationData?.displayName}
          registrationId={registrationData?.id}
          onOpenAdmin={() =>
            setCurrentScreen(adminToken ? 'admin-dashboard' : 'admin-login')
          }
          onBackToWelcome={() => setCurrentScreen('welcome')}
        />
      )}

      {currentScreen === 'admin-login' && (
        <AdminLogin
          onBack={() => setCurrentScreen('welcome')}
          onLoginSuccess={handleAdminLoginSuccess}
        />
      )}

      {currentScreen === 'admin-dashboard' && adminToken && (
        <AdminDashboard
          adminToken={adminToken}
          adminUsername={adminUsername}
          onLogout={handleAdminLogout}
          onGoToVisitor={() => setCurrentScreen('welcome')}
          onOpenDbInfo={() => setIsDbModalOpen(true)}
        />
      )}

      {/* Database Diagnostic & Architecture Modal */}
      <DatabaseInfoModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
      />
    </div>
  );
}
