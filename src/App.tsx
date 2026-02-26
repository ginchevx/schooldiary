import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Sidebar } from './components/Layout/Sidebar';
import { TopBar } from './components/Layout/TopBar';
import { MobileNav } from './components/Layout/MobileNav';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Grades } from './pages/Grades';
import { Absences } from './pages/Absences';
import { Homework } from './pages/Homework';
import { Timetable } from './pages/Timetable';
import { Announcements } from './pages/Announcements';
import { Messages } from './pages/Messages';
import { TeacherGradebook } from './pages/TeacherGradebook';
import { TeacherAbsences } from './pages/TeacherAbsences';
import { TeacherHomework } from './pages/TeacherHomework';
import { ClassList } from './pages/ClassList';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role } = useAuth();
  
  if (!role) return null;
  
  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col md:pl-64">
        <TopBar />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  );
};

function AppRoutes() {
  const { role } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Student Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/grades"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Grades />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/absences"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Absences />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/homework"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Homework />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/timetable"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Timetable />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/announcements"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Announcements />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <Messages />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      {/* Teacher Routes */}
      <Route
        path="/gradebook"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <TeacherGradebook />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/teacher/absences"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <TeacherAbsences />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/teacher/homework"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <TeacherHomework />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/class-list"
        element={
          <PrivateRoute>
            <DashboardLayout>
              <ClassList />
            </DashboardLayout>
          </PrivateRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
